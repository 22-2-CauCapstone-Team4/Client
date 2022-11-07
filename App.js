import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider} from './providers/AuthProvider';
import LogInScreen from './components/LogInScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import Detail from './components/Detail';
import {LogBox} from 'react-native';

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
            name="Detail"
            component={Detail}
            options={{headerShown: false}}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}

export default App;
