import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {AuthProvider} from './providers/AuthProvider';
import LogInScreen from './components/LogInScreen';
import CreateAccountScreen from './components/CreateAccountScreen';
import Detail from './components/Detail';

const Stack = createStackNavigator();

function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="로그인">
          <Stack.Screen
            name="로그인"
            component={LogInScreen}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="계정 만들기"
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
