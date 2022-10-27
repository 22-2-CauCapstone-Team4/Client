import React from 'react';
import {StyleSheet} from 'react-native';
import {NativeBaseProvider, Center, Button} from 'native-base';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import styled from 'styled-components/native';
import {Home, Goal, Record, Statistics, Friends} from './tabbarList';
const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  return (
    <Tab.Navigator>
      <Tab.Screen name="홈" component={Home} />
      <Tab.Screen name="목표" component={Goal} />
      <Tab.Screen name="기록" component={Record} />
      <Tab.Screen name="통계" component={Statistics} />
      <Tab.Screen name="친구" component={Friends} />
    </Tab.Navigator>
  );
}

export default Detail;
