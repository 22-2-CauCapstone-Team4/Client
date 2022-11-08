import React, {useState, useRef} from 'react';
import {createDrawerNavigator} from '@react-navigation/drawer';

import BlockApp from './BlockAppScreen';
import Detail from './Detail';
import {blockedApps} from './BlockAppScreen';
export default function MenuDrawer() {
  const Drawer = createDrawerNavigator();

  // 금지 앱 배열 컴포넌트 -> 데이터 받아오면 useState 파라미터에 넣으면 될것 같다
  // const [blockedApp, setBlockedApp] = useState([]);
  // const nextAppId = useRef(blockedApp.length);
  // const onCreate = () => {
  //   const target = {
  //     id: nextAppId.current,
  //     //image:
  //     //appName:
  //   };
  //   setBlockedApp([...blockedApp, target]);
  // };
  return (
    <Drawer.Navigator initialRouteName="메인">
      <Drawer.Screen name="메인" component={Detail} />
      <Drawer.Screen name="금지 앱 설정" component={BlockApp} />
    </Drawer.Navigator>
  );
}
