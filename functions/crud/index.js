import {readProhibitedApps, updateProhibitedApps} from './ProhibitedApp';
import {readGoals, createGoal, updateGoal, deleteGoal} from './Goal';
import {readPlaces, createPlace, updatePlace, deletePlace} from './Place';
import {
  readMissions,
  createMission,
  updateMission,
  deleteMission,
} from './Mission';

import {readUsage, readAppSec, readAppCnt} from './UsageRecord';

module.exports = {
  readProhibitedAppsInRealm: readProhibitedApps,
  updateProhibitedAppsInRealm: updateProhibitedApps,
  readGoalsInRealm: readGoals,
  createGoalInRealm: createGoal,
  updateGoalInRealm: updateGoal,
  deleteGoalInRealm: deleteGoal,
  readPlacesInRealm: readPlaces,
  createPlaceInRealm: createPlace,
  updatePlaceInRealm: updatePlace,
  deletePlaceInRealm: deletePlace,
  readMissionsInRealm: readMissions,
  createMissionInRealm: createMission,
  updateMissionInRealm: updateMission,
  deleteMissionInRealm: deleteMission,
  readUsageInRealm: readUsage,
  readAppSecInRealm: readAppSec,
  readAppCntInRealm: readAppCnt,
};
