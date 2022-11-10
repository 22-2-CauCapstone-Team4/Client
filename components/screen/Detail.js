import React, {useEffect} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity, Text, Alert, BackHandler} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {Record, Statistics} from '../tab/tabbarList';
import HomeTab from '../tab/HomeTab';
import GoalTab from '../tab/GoalTab';
import FriendTab from '../tab/FriendTab';
import Color from '../../utils/Colors';
import {styles} from '../../utils/styles';
import {useAuth} from '../../providers/AuthProvider';
import {CurAppModule, LockAppModule} from '../../wrap_module';

const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  const {user, signOut} = useAuth();

  // 화면 추가 코드
  React.useEffect(() => {
    const innerFunc = async () => {
      let allowCnt = 0;
      const {
        checkPermission: checkCurAppPermission,
        allowPermission: allowCurAppPermission,
      } = CurAppModule;
      const {
        checkPermission: checkLockAppPermission,
        allowPermission: allowLockAppPermission,
      } = LockAppModule;

      let [isCurAppPermissionAllowed, isLockAppPermissionAllowed] =
        await Promise.all([checkCurAppPermission(), checkLockAppPermission()]);

      isCurAppPermissionAllowed = isCurAppPermissionAllowed.alreadyAllowed;
      isLockAppPermissionAllowed = isLockAppPermissionAllowed.alreadyAllowed;

      if (isCurAppPermissionAllowed) allowCnt++;
      if (isLockAppPermissionAllowed) allowCnt++;

      console.log(allowCnt);

      if (allowCnt === 2) return;
      try {
        Alert.alert(
          '권한 허용 필요',
          `원활한 애플리케이션 사용을 위해 ${
            2 - allowCnt
          }개의 권한 허용이 필요합니다.\n\n${
            !isCurAppPermissionAllowed ? '- 권한이름 1\n' : ''
          }${!isLockAppPermissionAllowed ? '- 권한이름 2\n' : ''}
      `,
          [
            {
              text: '취소',
              onPress: () => {},
            },
            {
              text: '설정으로 이동',
              onPress: async () => {
                if (!isCurAppPermissionAllowed) await allowCurAppPermission();
                else if (!isLockAppPermissionAllowed)
                  await allowLockAppPermission();
              },
            },
          ],
        );
      } catch (err) {
        console.log(err.message);
      }
      return true;
    };

    innerFunc();
  }, []);

  // React.useEffect(() => {
  //   const innerFunc = async () => {
  //     const customUserData = await user.refreshCustomData();
  //     console.log(user, customUserData);
  //   };

  //   innerFunc();
  // }, [user]);

  const onPressLogOut = () => {
    navigation.replace('Login');
    signOut();
  };

  // 뒤로가기 -> 앱 종료 Alert
  const isFocused = useIsFocused(); // 포커싱 감지
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
        //console.log('Is Focused');
        Alert.alert('종료', '앱을 종료하시겠습니까?', [
          {
            text: '취소',
            onPress: () => null,
          },
          {text: '확인', onPress: () => BackHandler.exitApp()},
        ]);
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );
    return () => backHandler.remove();
  }, [isFocused]);

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
        headerRight: () => {
          if (route.name === '홈') {
            return (
              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={onPressLogOut}>
                <Text style={{color: 'black'}}>로그아웃</Text>
                <Icon name={'log-out'} size={30} color={'black'} />
              </TouchableOpacity>
            );
          } else if (route.name === '목표') {
            return (
              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={() => {}}>
                <Text style={{color: 'black'}}>공간 추가</Text>
                <Icon name={'compass'} size={30} color={'black'} />
              </TouchableOpacity>
            );
          }
        },
      })}>
      {/* 홈 -> tabBarBadge: 현재 진행 중인 미션 개수를 띄워두기(?) */}
      <Tab.Screen name="홈" component={HomeTab} options={{tabBarBadge: 0}} />
      <Tab.Screen name="목표" component={GoalTab} />
      <Tab.Screen name="기록" component={Record} />
      <Tab.Screen name="통계" component={Statistics} />
      <Tab.Screen name="친구" component={FriendTab} />
    </Tab.Navigator>
  );
}

export default Detail;
