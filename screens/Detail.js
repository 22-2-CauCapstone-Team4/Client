import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Goal, Record, Statistics, Friends} from './tabbarList';
import Ionicons from 'react-native-vector-icons/Ionicons';
const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  return (
    <Tab.Navigator>
      <Tab.Screen
        name="홈"
        component={Home}
        options={{tabBarIcon: () => <Ionicons name="home" size={30} />}}
      />
      <Tab.Screen
        name="목표"
        component={Goal}
        options={{tabBarIcon: () => <Ionicons name="paper-plane" size={30} />}}
      />
      <Tab.Screen
        name="기록"
        component={Record}
        options={{
          tabBarIcon: () => <Ionicons name="trophy" size={30} />,
        }}
      />
      <Tab.Screen
        name="통계"
        component={Statistics}
        options={{
          tabBarIcon: () => <Ionicons name="stats-chart" size={30} />,
        }}
      />
      <Tab.Screen
        name="친구"
        component={Friends}
        options={{tabBarIcon: () => <Ionicons name="people" size={30} />}}
      />
    </Tab.Navigator>
  );
}

export default Detail;
