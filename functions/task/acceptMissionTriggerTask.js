/* eslint-disable no-labels */
import Realm from 'realm';
import {
  Mission,
  TodayMission,
  Goal,
  Place,
  CurState,
  PhoneUsageRecord,
} from '../../schema';
import {ForegroundServiceModule, MissionSetterModule} from '../../wrap_module';
import {mkConfig} from '../mkConfig';
import {LockAppModule} from '../../wrap_module';
import {appCheckHeadlessTask} from './appCheckHeadlessTask';

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
      ]),
    );

    let appPackageName, appName, isProhibitedApp;
    realm.write(async () => {
      const todayMission = realm
        .objects('TodayMission')
        .filtered(`mission._id == oid(${id})`)[0];
      const mission = todayMission.mission;
      const curState = realm.objects('CurState')[0];

      // console.log(JSON.parse(JSON.stringify(curState)), mission.name);
      if (
        todayMission.state === TodayMission.STATE.NONE &&
        !curState.isNowDoingMission
      ) {
        // 미션 수행
        console.log(mission.name, '미션 시작');

        curState.isNowDoingMission = true;
        curState.mission = mission;
        todayMission.state = TodayMission.STATE.START;

        ForegroundServiceModule.startService(null, {
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
        MissionSetterModule.setTimeMission(
          parseInt(mission.endTime / 60),
          mission.endTime % 60,
          mission._id.toString(),
          parseInt(Math.random() * 10000000),
        );
      } else if (todayMission.state === TodayMission.STATE.START) {
        // 미션 종료
        console.log(mission.name, '미션 종료');

        curState.isNowDoingMission = false;
        delete curState.mission;

        todayMission.state = TodayMission.STATE.OVER;

        ForegroundServiceModule.startService(null, {
          title: `감지 중`,
          content: '금지 앱 접속을 감지 중입니다. ',
        });
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
