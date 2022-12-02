/* eslint-disable no-labels */
import {mkTodayMissionsInRealm} from '../index';
import {Mission, TodayMission, Place, Goal} from '../../schema';
import {mkConfig} from '../mkConfig';
import {MissionSetterModule} from '../../wrap_module';
import Realm from 'realm';

const everyMidnightTask = async (user, taskData) => {
  let realm = null;

  try {
    console.log('Midnignt event js에서 받음');

    realm = await Realm.open(
      mkConfig(user, [
        TodayMission.schema,
        Mission.schema,
        Place.schema,
        Goal.schema,
      ]),
    );

    const todayMissions = mkTodayMissionsInRealm(user, realm);
    console.log(todayMissions);

    // 다음 12시 알람 맞추기
    MissionSetterModule.startMidnightAlarm();

    // 각 미션 예약
    todayMissions.forEach(todayMission => {
      const mission = todayMission.mission;

      MissionSetterModule.setTimeMission(
        parseInt(mission.startTime / 60),
        mission.startTime % 60,
        mission._id,
        parseInt(Math.random() * 10000000),
      );
    });

    realm.close();
  } catch (err) {
    console.log(err.message());
    if (realm !== null) realm.close();
  }
};

export {everyMidnightTask};
