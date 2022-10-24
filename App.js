import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import LogInScreen from './screens/LogInScreen';
import CreateAccountScreen from './screens/CreateAccountScreen';
import Detail from './screens/Detail';

const Stack = createStackNavigator();

function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="로그인"
        screenOptions={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            textAlign: 'center',
            alignSelf: 'center',
          },
        }}>
        <Stack.Screen name="로그인" component={LogInScreen} />
        <Stack.Screen name="계정 만들기" component={CreateAccountScreen} />
        <Stack.Screen name="Detail" component={Detail} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default App;
