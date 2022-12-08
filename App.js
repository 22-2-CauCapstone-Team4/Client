import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LogBox} from 'react-native';
import rootReducer from './store/reducers';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import {AuthProvider} from './providers/AuthProvider';
import LogInScreen from './components/screen/LogInScreen';
import CreateAccountScreen from './components/screen/CreateAccountScreen';
import MenuDrawer from './components/screen/MenuDrawer';
import FriendScreen from './components/screen/FriendScreen';
import DirectCreateMissionScreen from './components/screen/DirectCreateMissionScreen';
import CreateMissionScreen from './components/screen/CreateMissionScreen';
import CreateSpaceScreen from './components/screen/CreateSpaceScreen';
import WatchLocationScreen from './components/screen/WatchLocationScreen';

const Stack = createStackNavigator();
const store = createStore(rootReducer);
function App() {
  LogBox.ignoreLogs(['Animated']);
  LogBox.ignoreLogs(['Warning: Internal React error']); // 화면 전환 WARNING 생략
  LogBox.ignoreLogs([
    'BSON: For React Native please polyfill crypto.getRandomValues, e.g. using: https://www.npmjs.com/package/react-native-get-random-values.',
  ]); // crypto WARN 생략
  LogBox.ignoreLogs([
    'Tried to show an alert while not attached to an Activity',
  ]); // 나도 아니까 쉿...
  LogBox.ignoreLogs([
    'Please report: Excessive number of pending callbacks: 501. Some pending callbacks that might have leaked by never being called from native code:',
  ]);
  LogBox.ignoreLogs([
    'registerHeadlessTask or registerCancellableHeadlessTask called multiple times for same key',
  ]);
  return (
    <AuthProvider>
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen
              name="Login"
              component={LogInScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateAccount"
              component={CreateAccountScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="Menu"
              component={MenuDrawer}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="DirectCreateMission"
              component={DirectCreateMissionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateMission"
              component={CreateMissionScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="CreateSpace"
              component={CreateSpaceScreen}
              options={{headerShown: false}}
            />
            <Stack.Screen
              name="WatchLocation"
              component={WatchLocationScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    </AuthProvider>
  );
}

export default App;
