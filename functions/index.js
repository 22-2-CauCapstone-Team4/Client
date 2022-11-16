import {mkConfig, mkConfigWithSubscriptions} from './mkConfig';
import {
  readProhibitedAppsInRealm,
  updateProhibitedAppsInRealm,
  readGoalsInRealm,
  createGoalInRealm,
  updateGoalInRealm,
  deleteGoalInRealm,
  readPlacesInRealm,
  createPlaceInRealm,
  updatePlaceInRealm,
  deletePlaceInRealm,
} from './crud';
import {appCheckHeadlessTask, startServiceTask} from './task';

module.exports = {
  appCheckHeadlessTask,
  startServiceTask,
  readProhibitedAppsInRealm,
  updateProhibitedAppsInRealm,
  readGoalsInRealm,
  createGoalInRealm,
  updateGoalInRealm,
  deleteGoalInRealm,
  readPlacesInRealm,
  createPlaceInRealm,
  updatePlaceInRealm,
  deletePlaceInRealm,
  mkConfig,
  mkConfigWithSubscriptions,
};
