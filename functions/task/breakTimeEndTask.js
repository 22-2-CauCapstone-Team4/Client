import {mkConfig, takeBreakTime} from '..';
import {CurState, ProhibitedApp, Mission, Goal, Place} from '../../schema';
import Realm from 'realm';
import {
  ForegroundServiceModule,
  LockAppModule,
  MissionSetterModule,
} from '../../wrap_module';
import moment from 'moment';

const breakTimeEndTask = async (user, taskData) => {
  // 금지 앱 가리는 화면에서 버튼을 클릭한 경우
  console.log('BreakTimeEnd event js에서 받음');

  let realm = null;

  try {
    realm = await Realm.open(
      mkConfig(user, [
        CurState.schema,
        Mission.schema,
        Goal.schema,
        Place.schema,
        ProhibitedApp.schema,
      ]),
    );
    const curState = await realm.objects('CurState')[0];
    const mission = await realm
      .objects('Mission')
      .filtered(`_id == oid(${curState.mission._id})`)[0];
    const prohibitedApps = JSON.parse(
      JSON.stringify(realm.objects('ProhibitedApp')),
    ).map(app => {
      return {name: app.name, packageName: app.packageName};
    });

    // 1. 다시 원래 mission noti 주기
    ForegroundServiceModule.startService(prohibitedApps, {
      title: `[ ${mission.goal.name} - ${mission.name} ] 미션 진행 중`,
      content: '당신의 목표를 응원합니다!',
    });

    // 2. 현재 금지 앱 사용 중이면, 금지 앱 가리는 화면 켜기
    if (curState.isNowUsingProibitedApp) {
      const missionRecord = realm
        .objects('MissionRecord')
        .sorted('startTime', true)[0];

      LockAppModule.viewLockScreen(
        curState.mission.goal.name,
        curState.mission.name,
        curState.mission.goal.nowDoingMissionCnt, // totalNum
        parseInt(moment().diff(missionRecord.startTime) / 1000), // passedTime
        missionRecord.totalProhibitedAppUsageSec, // usedTime
        60 * 50, // left time (저번 쉬는시간으로부터 60min 뒤 -> 쉬는시간 10min 끝난 직후이므로 50min 남음)
      );
    }

    realm.close();
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {breakTimeEndTask};
