import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {LogBox} from 'react-native';

import {AuthProvider} from './providers/AuthProvider';
import LogInScreen from './components/screen/LogInScreen';
import CreateAccountScreen from './components/screen/CreateAccountScreen';
import CreateMission from './components/screen/CreateMissionScreen';
import Detail from './components/screen/Detail';
import MenuDrawer from './components/screen/MenuDrawer';

const Stack = createStackNavigator();

function App() {
  LogBox.ignoreLogs(['Warning: Internal React error']); // 화면 전환 WARNING 생략
  return (
    <AuthProvider>
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
          {/* <Stack.Screen
            name="Detail"
            component={Detail}
            options={{headerShown: false}}
          /> */}
          <Stack.Screen
            name="Mission"
            component={CreateMission}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
