/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {getRealmApp} from './getRealmApp';
import {appCheckHeadlessTask, startServiceTask} from './functions';

AppRegistry.registerComponent(appName, () => App);

const app = getRealmApp();
console.log('headless 태스크 등록 시도');
if (
  app.currentUser !== null &&
  app.currentUser.providerType === 'local-userpass'
) {
  console.log('headless 태스크 등록 성공');
  AppRegistry.registerHeadlessTask('CheckApp', () =>
    appCheckHeadlessTask.bind(null, app.currentUser),
  );
  AppRegistry.registerHeadlessTask('Boot', () => {
    startServiceTask.bind(null, app.currentUser);
  });
}

export {app};
