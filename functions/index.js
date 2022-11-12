import {mkConfig, mkConfigWithSubscriptions} from './mkConfig';
import {readProhibitedApps, updateProhibitedApps} from './crud';
import {appCheckHeadlessTask} from './task';

module.exports = {
  appCheckHeadlessTask,
  readProhibitedApps,
  updateProhibitedApps,
  mkConfig,
  mkConfigWithSubscriptions,
};
