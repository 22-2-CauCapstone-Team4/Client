/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {LockAppModule} from './wrap_module';

const AppCheckHeadlessTask = async taskData => {
  console.log('CheckApp 이벤트를 받았습니다. ', taskData);

  try {
    await LockAppModule.viewLockScreen();
  } catch (err) {
    console.error(err.message);
  }
};

AppRegistry.registerHeadlessTask('CheckApp', () => AppCheckHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
