/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {AppCheckHeadlessTask} from './functions';

AppRegistry.registerHeadlessTask('CheckApp', () => AppCheckHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
