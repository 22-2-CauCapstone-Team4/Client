import {readProhibitedApps, updateProhibitedApps} from './ProhibitedApp';
import {readGoals, createGoal, updateGoal, deleteGoal} from './Goal';
import {readPlaces, createPlace, updatePlace, deletePlace} from './Place';

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
};
