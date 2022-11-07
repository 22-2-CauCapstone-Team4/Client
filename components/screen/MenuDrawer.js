import React from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';
import {useAuth} from '../../providers/AuthProvider';
import Icon from 'react-native-vector-icons/Ionicons';

import Detail from './Detail';

export default function MenuDrawer() {
  const Drawer = createDrawerNavigator();
  return (
    <Drawer.Navigator initialRouteName="메인">
      <Drawer.Screen name="메인" component={Detail} />
    </Drawer.Navigator>
  );
}
