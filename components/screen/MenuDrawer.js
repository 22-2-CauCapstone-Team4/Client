import React, {useState, useRef} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import BlockApp from './BlockAppScreen';
import Detail from './Detail';
import {blockedApps} from './BlockAppScreen';
import Colors from '../../utils/Colors';
export default function MenuDrawer() {
  const Drawer = createDrawerNavigator();

  return (
    <Drawer.Navigator
      initialRouteName="메인"
      screenOptions={{
        drawerStyle: {
          backgroundColor: 'white',
        },
      }}>
      <Drawer.Screen
        name="메인"
        component={Detail}
        options={{
          drawerActiveBackgroundColor: Colors.MAIN_COLOR,
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: 'black',
          title: '메인',
          headerShown: false,
        }}
      />
      <Drawer.Screen
        name="금지 앱 설정"
        component={BlockApp}
        options={{
          drawerActiveBackgroundColor: Colors.MAIN_COLOR,
          drawerActiveTintColor: 'white',
          drawerInactiveTintColor: 'black',
        }}
      />
    </Drawer.Navigator>
  );
}
