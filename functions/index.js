import {mkConfig, mkConfigWithSubscriptions} from './mkConfig';
import {
  readProhibitedApps,
  updateProhibitedApps,
  readGoals,
  createGoal,
  updateGoal,
  deleteGoal,
} from './crud';
import {appCheckHeadlessTask, startServiceTask} from './task';

module.exports = {
  appCheckHeadlessTask,
  startServiceTask,
  readProhibitedApps,
  updateProhibitedApps,
  readGoals,
  createGoal,
  updateGoal,
  deleteGoal,
  mkConfig,
  mkConfigWithSubscriptions,
};
