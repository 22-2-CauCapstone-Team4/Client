/* eslint-disable no-labels */
import Realm from 'realm';
import {Mission, TodayMission, Goal, Place, CurState} from '../../schema';
import {ForegroundServiceModule, MissionSetterModule} from '../../wrap_module';
import {mkConfig} from '../mkConfig';

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

    realm.write(async () => {
      const todayMission = realm
        .objects('TodayMission')
        .filtered(`mission._id == oid(${id})`)[0];
      const mission = todayMission.mission;
      const curState = realm.objects('CurState')[0];

      // console.log(JSON.parse(JSON.stringify(curState)), mission.name);
      if (
        todayMission.state === TodayMission.STATE.NONE &&
        curState.isNowDoingMission
      ) {
        // 미션 수행
        console.log(mission.name, '미션 시작');

        curState.isNowDoingMission = true;
        curState.mission = mission;
        todayMission.state = TodayMission.STATE.START;

        ForegroundServiceModule.startService(null, null, {
          title: `[ ${mission.goal.name} - ${mission.name} ] 미션 진행 중`,
          content: '당신의 목표를 응원합니다! 👍',
        });

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

        ForegroundServiceModule.startService(null, null, {
          title: `감지 중`,
          content: '금지 앱 접속을 감지 중입니다. ',
        });
      }
    });

    realm.close();
  } catch (err) {
    console.log(err.message);
    if (realm !== null) realm.close();
  }
};

export {acceptMissionTriggerTask};
