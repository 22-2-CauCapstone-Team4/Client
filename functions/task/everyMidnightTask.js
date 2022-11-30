/* eslint-disable no-labels */
import {mkTodayMissionsInRealm} from '../index';
import {Mission, TodayMission, Place, Goal} from '../../schema';
import {mkConfig} from '../mkConfig';
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

    realm.close();
  } catch (err) {
    console.log(err.message());
    if (realm !== null) realm.close();
  }
};

export {everyMidnightTask};
