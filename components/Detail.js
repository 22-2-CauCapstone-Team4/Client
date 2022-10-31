import React from 'react';
import {TouchableOpacity, Text} from 'react-native';
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
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === '통계') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === '친구') {
            iconName = focused ? 'people' : 'people-outline';
          }
          return <Icon name={iconName} size={25} color={color} />;
        },
        tabBarActiveTintColor: Color.MAIN_COLOR,
        tabBarInactiveTintColor: 'gray',
        headerStyle: {
          borderBottomWidth: 1,
        },
        headerRight: () => (
          <TouchableOpacity
            style={{flexDirection: 'row', marginRight: 20}}
            onPress={() => navigation.navigate('로그인')}>
            <Text style={{color: 'black'}}>로그아웃</Text>
            <Icon name={'log-out'} size={30} color={'black'} />
          </TouchableOpacity>
        ),
      })}>
      {/* 홈 -> tabBarBadge: 현재 진행 중인 미션 개수를 띄워두기(?) */}
      <Tab.Screen name="홈" component={Home} options={{tabBarBadge: 0}} />
      <Tab.Screen name="목표" component={Goal} />
      <Tab.Screen name="기록" component={Record} />
      <Tab.Screen name="통계" component={Statistics} />
      <Tab.Screen name="친구" component={Friends} />
    </Tab.Navigator>
  );
}

export default Detail;
