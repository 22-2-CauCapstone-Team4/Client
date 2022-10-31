import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Home, Goal, Record, Statistics, Friends} from './tabbarList';
import Icon from 'react-native-vector-icons/Ionicons';
import Color from '../utils/Colors';
const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({focused, color}) => {
          let iconName;

          if (route.name === '홈') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '목표') {
            iconName = focused ? 'paper-plane' : 'paper-plane-outline';
          } else if (route.name === '기록') {
            iconName = focused ? 'settings' : 'settings-outline';
          } else if (route.name === '통계') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === '친구') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: Color.MAIN_COLOR,
        tabBarInactiveTintColor: 'gray',
      })}>
      {/* 홈 -> tabBarBadge 현재 미션 개수를 띄워두는건 어떨까? */}
      <Tab.Screen name="홈" component={Home} options={{tabBarBadge: 0}} />
      <Tab.Screen name="목표" component={Goal} />
      <Tab.Screen name="기록" component={Record} />
      <Tab.Screen name="통계" component={Statistics} />
      <Tab.Screen name="친구" component={Friends} />
    </Tab.Navigator>
  );
}

export default Detail;
