/* eslint-disable no-labels */
import Realm from 'realm';
import {
  Mission,
  TodayMission,
  Goal,
  Place,
  CurState,
  PhoneUsageRecord,
  ProhibitedApp,
  MissionRecord,
  GiveUpAppEmbedded,
  AppUsageEmbedded,
  UserInfo,
} from '../../schema';
import {
  ForegroundServiceModule,
  MissionSetterModule,
  LockAppModule,
} from '../../wrap_module';
import {mkConfig} from '../mkConfig';
import {appCheckHeadlessTask} from './appCheckHeadlessTask';
import moment from 'moment';

const acceptMissionTriggerTask = async (user, taskData) => {
  let realm = null;

  try {
    console.log('MissionTrigger 이벤트', taskData);
    const {id} = taskData;

    realm = await Realm.open(
      mkConfig(user, [
        Mission.schema,
        TodayMission.schema,
        Goal.schema,
        Place.schema,
        CurState.schema,
        ProhibitedApp.schema,
        UserInfo.schema,
        GiveUpAppEmbedded.schema,
        AppUsageEmbedded.schema,
        MissionRecord.schema,
      ]),
    );

    const now = new Date();
    let appPackageName, appName, isProhibitedApp;
    let prevType,
      curType,
      isRecordResetNeeded = false;

    await realm.write(async () => {
      const todayMission = realm
        .objects('TodayMission')
        .filtered(`mission._id == oid(${id})`)[0];
      const mission = todayMission.mission;
      const goal = realm
        .objects('Goal')
        .filtered(`_id == oid(${mission.goal._id})`)[0];
      const curState = realm.objects('CurState')[0];
      const prohibitedApps = JSON.parse(
        JSON.stringify(realm.objects('ProhibitedApp')),
      ).map(app => {
        return {name: app.name, packageName: app.packageName};
      });

      appPackageName = curState.appPackageName;
      appName = curState.appName;
      isProhibitedApp = curState.isNowUsingProhibitedApp;

      prevType = curState.isNowDoingMission
        ? curState.isNowGivingUp
          ? PhoneUsageRecord.TYPE.GIVE_UP
          : PhoneUsageRecord.TYPE.MISSION
        : PhoneUsageRecord.TYPE.DEFAULT;

      // console.log(JSON.parse(JSON.stringify(curState)), mission.name);
      if (todayMission.state === TodayMission.STATE.NONE && mission.isActive) {
        if (!curState.isNowDoingMission) {
          // 미션 수행
          console.log(mission.name, '미션 시작');

          isRecordResetNeeded = true;
          curType = PhoneUsageRecord.TYPE.MISSION;

          // 미션 기록 추가
          const missionRecord = new MissionRecord({
            owner_id: user.id,
            mission,
            startTime: now,
          });
          realm.create('MissionRecord', missionRecord);

          curState.isNowDoingMission = true;
          curState.missionStartTime = now;
          curState.isNowGivingUp = false;
          curState.lastBreakTime = null;
          curState.mission = mission;
          todayMission.state = TodayMission.STATE.START;

          ForegroundServiceModule.startService(prohibitedApps, {
            title: `[ ${mission.goal.name} - ${mission.name} ] 미션 진행 중`,
            content:
              mission.type === Mission.TYPE.TIME
                ? `${
                    parseInt(mission.endTime / 60) < 10
                      ? '0' + parseInt(mission.endTime / 60)
                      : parseInt(mission.endTime / 60)
                  }:${
                    mission.endTime % 60 < 10
                      ? '0' + (mission.endTime % 60)
                      : mission.endTime % 60
                  }에 미션이 종료됩니다. `
                : mission.type === Mission.TYPE.IN_PLACE
                ? `${mission.place.name} 공간 안에서 미션을 수행해 주세요.  `
                : `${mission.place.name} 공간을 향해 출발해 봅시다! `,
          });

          // console.log(
          //   appPackageName,
          //   appName,
          //   isProhibitedApp,
          //   JSON.parse(JSON.stringify(curState)),
          // );

          // curState, appCheckHeadlessTask 관련
          if (curState.isNowUsingProhibitedApp) {
            try {
              LockAppModule.viewLockScreen(
                curState.mission.goal.name,
                curState.mission.name,
                goal.nowDoingMissionCnt, // totalNum
                0, // passedTime
                0, // usedTime
                0, // left time (10min)
              );
            } catch (err) {
              console.error(err.message);
            }
          }

          // 미선 종료 조건 trigger
          if (mission.type === Mission.TYPE.TIME) {
            MissionSetterModule.setTimeMission(
              parseInt(mission.endTime / 60),
              mission.endTime % 60,
              mission._id.toString(),
              parseInt(Math.random() * 10000000),
            );
          } else {
            if (mission.type === Mission.TYPE.BOTH_PLACE) {
              if (!todayMission.extraState) {
                todayMission.extraState = TodayMission.EXTRA_STATE.MOVE_PLACE;
              } else {
                todayMission.extraState = TodayMission.EXTRA_STATE.IN_PLACE;
              }
            }

            const isEnter =
              mission.type === Mission.TYPE.IN_PLACE ||
              mission.type === Mission.TYPE.BOTH_PLACE
                ? false // 공간 벗어나기가 종료 조건 (or 다음 상태 이동 조건) 인 미션들
                : true;
            MissionSetterModule.setPlaceMission(
              mission.place.lat,
              mission.place.lng,
              parseInt(mission.place.range * 1000),
              isEnter,
              mission._id.toString(),
              parseInt(Math.random() * 10000000),
            );
          }
        } else {
          console.log(mission.name, '미션 대기');
          todayMission.state = TodayMission.STATE.PENDING;
        }
      } else if (
        (todayMission.state === TodayMission.STATE.START ||
          todayMission.state === TodayMission.STATE.PENDING) &&
        mission.isActive
      ) {
        switch (todayMission.extraState) {
          case TodayMission.STATE.MOVE_PLACE:
            // 상태 이동
            console.log(
              'BOTH_PLACE extraState 변화 - move place 종료, in place로 넘어감',
            );
            todayMission.extraState = Mission.TYPE.IN_PLACE;

            MissionSetterModule.setPlaceMission(
              mission.place.lat,
              mission.place.lng,
              parseInt(mission.place.range * 1000),
              true,
              mission._id.toString(),
              parseInt(Math.random() * 10000000),
            );

            ForegroundServiceModule.startService(prohibitedApps, {
              title: `[ ${mission.goal.name} - ${mission.name} ] 미션 진행 중`,
              content: '공간 이동 완료! 공간 안에서 미션을 수행해 주세요. ',
            });

            break;
          case Mission.TYPE.IN_PLACE:
            delete todayMission.extraState;
          // eslint-disable-next-line no-fallthrough
          default:
            if (todayMission.state === TodayMission.STATE.START) {
              // 미션 종료
              console.log(mission.name, '미션 종료');

              isRecordResetNeeded = true;
              curType = PhoneUsageRecord.TYPE.DEFAULT;

              curState.isNowDoingMission = false;
              curState.isNowGivingUp = false;
              curState.lastBreakTime = null;
              curState.mission = null;

              todayMission.state = TodayMission.STATE.OVER;

              ForegroundServiceModule.startService(prohibitedApps, {
                title: `감지 중`,
                content: '금지 앱 접속을 감지 중입니다. ',
              });

              const missionRecord = realm
                .objects('MissionRecord')
                .sorted('startTime', true)[0];

              // 종료 시간 기록
              missionRecord.endTime = parseInt(
                moment().diff(missionRecord.startTime) / 1000,
              );
            } else {
              // pending -> none
              console.log(mission.name, '대기 미션 조건 종료');
              todayMission.state = TodayMission.STATE.NONE;
            }
        }
      } else if (todayMission.state === TodayMission.STATE.QUIT) {
        console.log(mission.name, '포기한 미션 실제 종료');
        console.log(curState);

        if (curState.isNowGivingUp) {
          // 다른 미션 진행 중이지 않은 경우, 예전 내용 초기화 및 다시 알림 주기 필요
          curState.isNowDoingMission = false;
          curState.isNowGivingUp = false;
          curState.lastBreakTime = null;
          curState.mission = null;

          isRecordResetNeeded = true;
          curType = PhoneUsageRecord.TYPE.DEFAULT;

          ForegroundServiceModule.startService(prohibitedApps, {
            title: `감지 중`,
            content: '금지 앱 접속을 감지 중입니다. ',
          });
        }

        const missionRecord = realm
          .objects('MissionRecord')
          .filtered(`mission._id == oid(${id})`)[0];

        // 종료 시간 기록
        missionRecord.endTime = parseInt(
          moment().diff(missionRecord.startTime) / 1000,
        );
      }
    });

    realm.close();

    // 기존의 금지 앱 기록 끝내기
    if (isRecordResetNeeded) {
      await appCheckHeadlessTask(user, {
        appPackageName: '',
        appName: '',
        isProhibitedApp: false,
        // isPhoneOn,
        isPhoneOff: true,
        type: prevType,
        lastRecord: prevType !== PhoneUsageRecord.TYPE.DEFAULT ? true : false,
      });

      await appCheckHeadlessTask(user, {
        appPackageName: isProhibitedApp ? appPackageName : '',
        appName: isProhibitedApp ? appName : '',
        isProhibitedApp,
        isPhoneOn: true,
        // isPhoneOff,
        type: curType,
      });
    }
  } catch (err) {
    console.log(err.message);
    if (realm !== null) realm.close();
  }

  console.log('acceptMissionTriggerTask 완료');
};

export {acceptMissionTriggerTask};
