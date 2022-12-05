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
} from '../../schema';
import {ForegroundServiceModule, MissionSetterModule} from '../../wrap_module';
import {mkConfig} from '../mkConfig';
import {LockAppModule} from '../../wrap_module';
import {appCheckHeadlessTask} from './appCheckHeadlessTask';
import {unstable_renderSubtreeIntoContainer} from 'react-dom';

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
      ]),
    );

    let appPackageName, appName, isProhibitedApp;
    realm.write(async () => {
      const todayMission = realm
        .objects('TodayMission')
        .filtered(`mission._id == oid(${id})`)[0];
      const mission = todayMission.mission;
      const curState = realm.objects('CurState')[0];
      const prohibitedApps = JSON.parse(
        JSON.stringify(realm.objects('ProhibitedApp')),
      ).map(app => {
        return {name: app.name, packageName: app.packageName};
      });

      // console.log(JSON.parse(JSON.stringify(curState)), mission.name);
      if (todayMission.state === TodayMission.STATE.NONE) {
        if (!curState.isNowDoingMission) {
          // 미션 수행
          console.log(mission.name, '미션 시작');

          curState.isNowDoingMission = true;
          curState.mission = mission;
          todayMission.state = TodayMission.STATE.START;

          ForegroundServiceModule.startService(prohibitedApps, {
            title: `[ ${mission.goal.name} - ${mission.name} ] 미션 진행 중`,
            content: '당신의 목표를 응원합니다!',
          });

          appPackageName = curState.appPackageName;
          appName = curState.appName;
          isProhibitedApp = curState.isNowUsingProhibitedApp;
          console.log(
            appPackageName,
            appName,
            isProhibitedApp,
            JSON.parse(JSON.stringify(curState)),
          );

          // curState, appCheckHeadlessTask 관련
          if (curState.isNowUsingProhibitedApp && curState.isNowDoingMission) {
            try {
              LockAppModule.viewLockScreen(
                curState.mission.goal.name,
                curState.mission.name,
                5,
                1540,
                643,
                123, // test int
                // * TODO : 미션 수행 기록 데이터 구조 만들어서 여기다가 해야 함
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
        todayMission.state === TodayMission.STATE.START ||
        todayMission.state === TodayMission.STATE.PENDING
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
            break;
          case Mission.TYPE.IN_PLACE:
            delete todayMission.extraState;
          default:
            if (todayMission.state === TodayMission.STATE.START) {
              // 미션 종료
              console.log(mission.name, '미션 종료');

              curState.isNowDoingMission = false;
              delete curState.mission;

              todayMission.state = TodayMission.STATE.OVER;

              ForegroundServiceModule.startService(prohibitedApps, {
                title: `감지 중`,
                content: '금지 앱 접속을 감지 중입니다. ',
              });
            } else {
              // pending -> none
              console.log(mission.name, '대기 미션 조건 종료');
              todayMission.state = TodayMission.STATE.NONE;
            }
        }
      }
    });

    realm.close();

    await appCheckHeadlessTask(user, {
      appPackageName: '',
      appName: '',
      isProhibitedApp: false,
      // isPhoneOn,
      isPhoneOff: true,
      type: PhoneUsageRecord.TYPE.DEFAULT,
    });

    await appCheckHeadlessTask(user, {
      appPackageName,
      appName,
      isProhibitedApp,
      isPhoneOn: true,
      // isPhoneOff,
      type: PhoneUsageRecord.TYPE.MISSION,
    });
  } catch (err) {
    console.log(err.message);
    if (realm !== null) realm.close();
  }

  console.log('acceptMissionTriggerTask 완료');
};

export {acceptMissionTriggerTask};
