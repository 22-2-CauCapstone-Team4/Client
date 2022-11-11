/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import {appCheckHeadlessTask} from './functions';

AppRegistry.registerHeadlessTask('CheckApp', () => appCheckHeadlessTask);
AppRegistry.registerComponent(appName, () => App);
