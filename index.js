/**
 * @format
 */

import App from './App';
import {name as appName} from './app.json';
import {getRealmApp} from './getRealmApp';
import {
  appCheckHeadlessTask,
  startServiceTask,
  everyMidnightTask,
  acceptMissionTriggerTask,
  breakTimeEndTask,
  btnClickTask,
  mkConfig,
  readProhibitedAppsInRealm,
} from './functions';
import {ForegroundServiceModule, MissionSetterModule} from './wrap_module';
import Realm from 'realm';
import {ProhibitedApp} from './schema';
import {AppRegistry, Text, TextInput} from 'react-native';

// 텍스트 크기 기본으로 고정
Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

TextInput.defaultProps = TextInput.defaultProps || {};
TextInput.defaultProps.autoCorrect = false;
TextInput.defaultProps.allowFontScaling = false;

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerComponent(appName, () => App);

AppRegistry.registerHeadlessTask('Boot', () => startServiceTask);

const app = getRealmApp();
const user = app.currentUser;

console.log('index.js - 앱 처음 실행, 로그인 여부 확인');
if (user !== null && user.providerType === 'local-userpass') {
  console.log('index.js - 로그인 된 상태');

  Realm.open(mkConfig(user, [ProhibitedApp.schema])).then(async realm => {
    AppRegistry.registerHeadlessTask('CheckApp', () =>
      appCheckHeadlessTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('Midnight', () =>
      everyMidnightTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('MissionTrigger', () =>
      acceptMissionTriggerTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('BreakTimeEnd', () =>
      breakTimeEndTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('ClickBtn', () =>
      btnClickTask.bind(null, user),
    );

    // *TODO : 정보 불러오기
    MissionSetterModule.startMidnightAlarm();
    realm.close();
    console.log('index.js - service start, realm close');
  });
}

export {app};
