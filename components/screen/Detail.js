/* eslint-disable curly */
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
import {readProhibitedApps, updateProhibitedApps} from '../../functions';

const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  const Status = {
    NOT_YET: 0,
    OK: 1,
  };
  Object.freeze(Status);

  const [checkStatus, setCheckStatus] = React.useState(Status.NOT_YET);
  const {user, signOut} = useAuth();

  React.useEffect(() => {
    // if (checkStatus !== Status.OK) checkPermissionAlert();
    // test용 alert 띄우기
    Alert.alert('테스트', '테스트할 함수를 선택하세요.', [
      {
        text: 'read prohibited apps',
        onPress: () => {
          const list = readProhibitedApps(user);
          console.log(list);
        },
      },
      {
        text: 'write prohibited apps',
        onPress: () => {
          const list = updateProhibitedApps(user, [
            {
              packageName: 'test3',
              name: 'test3',
              icon: 'test3',
            },
            {
              packageName: 'test2',
              name: 'test2',
              icon: 'test2',
            },
          ]);
          console.log(list);
        },
      },
    ]);
  }, [Status.OK, checkPermissionAlert, checkStatus, user]);

  // const finishAllPermissionAlert = () => {
  //   Alert.alert('완료', '모든 권한 설정이 완료되었습니다. ', [
  //     {
  //       text: '확인',
  //     },
  //   ]);
  // };

  const deniedPermissionAlert = React.useCallback(() => {
    Alert.alert(
      '경고',
      '필요 권한을 얻지 못하면 앱이 종료됩니다.\n설정으로 이동하여 권한을 허용해주세요. ',
      [
        {
          text: '앱 종료',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
        {
          text: '필요 권한 확인',
          onPress: () => {
            checkPermissionAlert();
          },
        },
      ],
    );
  }, [checkPermissionAlert]);

  const checkPermissionAlert = React.useCallback(async () => {
    if (checkStatus === 2) return;
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

    isCurAppPermissionAllowed = isCurAppPermissionAllowed.isAllowed;
    isLockAppPermissionAllowed = isLockAppPermissionAllowed.isAllowed;

    if (isCurAppPermissionAllowed) allowCnt++;
    if (isLockAppPermissionAllowed) allowCnt++;

    console.log('허용된 권한 개수', allowCnt);
    if (allowCnt === 2) {
      setCheckStatus(Status.OK);
      return;
    }

    try {
      console.log('권한 허용 창 띄우기');
      Alert.alert(
        '권한 허용 필요',
        `${2 - allowCnt}개의 권한 허용이 필요합니다.\n\n${
          !isCurAppPermissionAllowed ? '- 사용정보 접근 허용\n' : ''
        }${!isLockAppPermissionAllowed ? '- 다른 앱 위에 표시\n' : ''}
      `,
        [
          {
            text: '거부',
            onPress: () => {
              deniedPermissionAlert();
            },
          },
          {
            text: '설정으로 이동',
            onPress: async () => {
              if (!isCurAppPermissionAllowed) {
                allowCurAppPermission();
              } else if (!isLockAppPermissionAllowed) {
                allowLockAppPermission();
              }

              setTimeout(() => {
                checkPermissionAlert();
              }, 500);
            },
          },
        ],
      );
    } catch (err) {
      console.log(err.message);
    }
  }, [Status.OK, checkStatus, deniedPermissionAlert]);

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
