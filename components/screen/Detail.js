/* eslint-disable curly */
import React, {useEffect, useState} from 'react';
import {useIsFocused} from '@react-navigation/native';
import {TouchableOpacity, Text, Alert, BackHandler, View} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';

import {Record, Statistics} from '../tab/tabbarList';
import HomeTab from '../tab/HomeTab';
import GoalTab from '../tab/GoalTab';
import FriendTab from '../tab/FriendTab';
import PlaceListModal from '../modal/PlaceListModal';
import Color from '../../utils/Colors';
import {styles} from '../../utils/styles';
import {useAuth} from '../../providers/AuthProvider';
import {
  ForegroundServiceModule,
  LockAppModule,
  AppListModule,
  MissionSetterModule,
} from '../../wrap_module';
import {useDispatch, useSelector} from 'react-redux';
import {
  readProhibitedAppsInRealm,
  readGoalsInRealm,
  readPlacesInRealm,
  readMissionsInRealm,
  readTodayMissionsInRealm,
  mkMissionRealmObjToObj,
  mkTodayMissionRealmObjToObj,
} from '../../functions';
import {
  addApps,
  addBlockedApps,
  initCategory,
  initMission,
  initPlace,
  initTodayMission,
} from '../../store/action';
import Realm from 'realm';
import {mkConfig} from '../../functions/mkConfig';
import {composeEventHandlers} from 'native-base';
import {ProhibitedApp, Goal, Place, Mission, TodayMission} from '../../schema';

const Tab = createBottomTabNavigator();

function Detail({navigation}) {
  const dispatch = useDispatch();

  const Status = {
    NOT_YET: 0,
    OK: 1,
  };
  Object.freeze(Status);

  const [blockedApps, setBlockedApps] = React.useState([]);
  const [isInit, setIsInit] = React.useState(true);
  const [checkStatus, setCheckStatus] = React.useState(Status.NOT_YET);
  const [modalVisible, setModalVisible] = useState(false);
  const {user, signOut} = useAuth();

  React.useEffect(() => {
    if (isInit) {
      loadApps();
    }
    if (checkStatus === Status.NOT_YET) checkPermissionAlert();
  }, [checkStatus, isInit]);

  const loadApps = React.useCallback(async () => {
    setIsInit(false);

    console.log('설치 앱 리스트 및 데이터 불러오기 시작');
    try {
      const realm = await Realm.open(
        mkConfig(user, [
          ProhibitedApp.schema,
          Goal.schema,
          Place.schema,
          Mission.schema,
          TodayMission.schema,
        ]),
      );

      // * TODO : 이거때문에 빌드 속도 너무 느림... 나중에 수정 필요
      let tempApps;
      AppListModule.getAppList().then(result => {
        tempApps = result;
        tempApps = tempApps.appList;
        tempApps.sort(function (a, b) {
          if (a.name.toLowerCase() > b.name.toLowerCase()) return 1;
          else if (a.name.toLowerCase() < b.name.toLowerCase()) return -1;
          else return 0;
        });
        dispatch(addApps(tempApps));
      });

      let [
        tempBlockedApps,
        tempGoals,
        tempPlaces,
        tempMissions,
        tempTodayMissions,
      ] = await Promise.all([
        readProhibitedAppsInRealm(user, realm),
        readGoalsInRealm(user, realm),
        readPlacesInRealm(user, realm),
        readMissionsInRealm(user, realm),
        readTodayMissionsInRealm(user, realm),
      ]);

      realm.close();

      dispatch(addBlockedApps(tempBlockedApps));
      setBlockedApps(tempBlockedApps);
      dispatch(initCategory(tempGoals));
      dispatch(initPlace(tempPlaces));
      // console.log(
      //   '미션',
      //   tempMissions.map(mission => mkMissionRealmObjToObj(mission)),
      // );
      dispatch(
        initMission(
          tempMissions.map(mission => mkMissionRealmObjToObj(mission)),
        ),
      );

      dispatch(
        initTodayMission(
          tempTodayMissions.map(mission =>
            mkTodayMissionRealmObjToObj(mission),
          ),
        ),
      );
      // console.log(
      //   '오늘 미션!!!',
      //   tempTodayMissions.map(mission => mkTodayMissionRealmObjToObj(mission)),
      // );
      console.log('불러오기 완료');
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, user]);

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
    if (checkStatus !== Status.NOT_YET) return;
    let allowCnt = 0;

    const {
      checkPermission: checkCurAppPermission,
      allowPermission: allowCurAppPermission,
    } = ForegroundServiceModule;
    const {
      checkPermission: checkLockAppPermission,
      allowPermission: allowLockAppPermission,
    } = LockAppModule;
    const {
      checkPermission: checkMissionPermission,
      allowPermission: allowMissionPermission,
    } = MissionSetterModule;

    let [
      isCurAppPermissionAllowed,
      isLockAppPermissionAllowed,
      isMissionPermissionAllowed,
    ] = await Promise.all([
      checkCurAppPermission(),
      checkLockAppPermission(),
      checkMissionPermission(),
    ]);

    isCurAppPermissionAllowed = isCurAppPermissionAllowed.isAllowed;
    isLockAppPermissionAllowed = isLockAppPermissionAllowed.isAllowed;
    isMissionPermissionAllowed = isMissionPermissionAllowed.isAllowed;

    if (isCurAppPermissionAllowed) allowCnt++;
    if (isLockAppPermissionAllowed) allowCnt++;
    if (isMissionPermissionAllowed) allowCnt++;

    console.log('허용된 권한 개수', allowCnt);
    if (allowCnt === 3) {
      setCheckStatus(Status.OK);

      console.log('서비스 시작');
      ForegroundServiceModule.startService(
        blockedApps.map(blockedApp => {
          return {
            name: blockedApp.name,
            packageName: blockedApp.packageName,
          };
        }),
        null,
      );

      return;
    }

    try {
      console.log('권한 허용 창 띄우기');
      Alert.alert(
        '권한 허용 필요',
        `${3 - allowCnt}개의 권한 허용이 필요합니다.\n\n${
          !isCurAppPermissionAllowed ? '- 사용정보 접근 허용\n' : ''
        }${!isLockAppPermissionAllowed ? '- 다른 앱 위에 표시\n' : ''}${
          !isMissionPermissionAllowed ? '- 백그라운드 위치 항상 허용' : ''
        }
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
              } else {
                allowMissionPermission();
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
  }, [
    Status.NOT_YET,
    Status.OK,
    blockedApps,
    checkStatus,
    deniedPermissionAlert,
  ]);

  const onPressLogOut = async () => {
    await signOut();
    navigation.replace('Login');
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    const backAction = () => {
      if (isFocused) {
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
        tabBarStyle: {height: 60},
        tabBarLabelStyle: {fontSize: 14},
        headerLeft: () => {
          if (route.name === '홈') {
            return (
              <TouchableOpacity
                style={[{marginLeft: 10}]}
                onPress={() => navigation.openDrawer()}>
                <Icon name={'menu'} size={30} color={'black'} />
              </TouchableOpacity>
            );
          }
        },
        headerRight: () => {
          if (route.name === '홈') {
            return (
              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={onPressLogOut}>
                <Text style={{color: 'black', marginRight: 3}}>로그아웃</Text>
                <Icon name={'log-out'} size={30} color={'black'} />
              </TouchableOpacity>
            );
          } else if (route.name === '목표') {
            return (
              <View style={{flexDirection: 'row'}}>
                <View style={styles.centeredView}>
                  <PlaceListModal
                    navigation={navigation}
                    modalVisible={modalVisible}
                    setModalVisible={setModalVisible}></PlaceListModal>
                </View>
                <TouchableOpacity
                  style={styles.tabButtonStyle}
                  onPress={() => {
                    setModalVisible(!modalVisible);
                  }}>
                  <Text style={{color: 'black', marginRight: 3}}>
                    장소 목록
                  </Text>
                  <Icon name={'map-sharp'} size={30} color={'black'} />
                </TouchableOpacity>
              </View>
            );
          }
        },
      })}>
      {/* 홈 -> tabBarBadge: 현재 진행 중인 미션 개수를 띄워두기(?) */}
      <Tab.Screen name="홈" component={HomeTab} />
      <Tab.Screen name="목표" component={GoalTab} />
      <Tab.Screen name="기록" component={Record} />
      <Tab.Screen name="통계" component={Statistics} />
      <Tab.Screen name="친구" component={FriendTab} />
    </Tab.Navigator>
  );
}

export default Detail;
