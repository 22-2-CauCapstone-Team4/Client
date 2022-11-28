/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {getRealmApp} from './getRealmApp';
import {
  appCheckHeadlessTask,
  startServiceTask,
  // everyMidnightTask,
  // acceptMissionTriggerTask,
  mkConfig,
  readProhibitedAppsInRealm,
} from './functions';
import {ForegroundServiceModule} from './wrap_module';
import Realm from 'realm';
import {ProhibitedApp} from './schema';

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('Boot', () => startServiceTask);
// AppRegistry.registerHeadlessTask('Midnight', () => everyMidnightTask);
// AppRegistry.registerHeadlessTask('MissionTrigger', () => acceptMissionTriggerTask);

const app = getRealmApp();
const user = app.currentUser;

console.log('index.js - 앱 처음 실행, 로그인 여부 확인');
if (user !== null && user.providerType === 'local-userpass') {
  console.log('index.js - 로그인 된 상태');

  Realm.open(mkConfig(user, [ProhibitedApp.schema])).then(async realm => {
    AppRegistry.registerHeadlessTask('CheckApp', () =>
      appCheckHeadlessTask.bind(null, app.currentUser),
    );

    const prohibitedApps = await readProhibitedAppsInRealm(user, realm);
    console.log('index.js - 금지 앱 불러오기 완료');

    ForegroundServiceModule.startService(
      prohibitedApps.map(prohibitedApp => {
        return {
          packageName: prohibitedApp.packageName,
          name: prohibitedApp.name,
        };
      }),
      null,
    );
    realm.close();
    console.log('index.js - service start, realm close');
  });
}

export {app};
