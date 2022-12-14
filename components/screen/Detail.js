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
  readMissionRecordsInRealm,
  mkStaticStr,
  nowRecordInRealm,
} from '../../functions';
import {
  addApps,
  addBlockedApps,
  initCategory,
  initFriend,
  initMission,
  initPlace,
  initTodayMission,
  initRecord,
  initStatics,
} from '../../store/action';
import Realm from 'realm';
import {mkConfig} from '../../functions/mkConfig';
import {composeEventHandlers} from 'native-base';
import {
  ProhibitedApp,
  Goal,
  Place,
  Mission,
  TodayMission,
  AppUsageEmbedded,
  GiveUpAppEmbedded,
  MissionRecord,
  UserInfo,
  AppUsageRecord,
  PhoneUsageRecord,
} from '../../schema';
import moment from 'moment';

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

    console.log('?????? ??? ????????? ??? ????????? ???????????? ??????');
    try {
      const realm = await Realm.open(
        mkConfig(user, [
          ProhibitedApp.schema,
          Goal.schema,
          Place.schema,
          Mission.schema,
          TodayMission.schema,
          MissionRecord.schema,
          GiveUpAppEmbedded.schema,
          AppUsageEmbedded.schema,
          AppUsageRecord.schema,
          PhoneUsageRecord.schema,
          UserInfo.schema,
        ]),
      );

      // * TODO : ??????????????? ?????? ?????? ?????? ??????... ????????? ?????? ??????
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
        tempRecords,
        tempStatics,
        tempRecord,
      ] = await Promise.all([
        readProhibitedAppsInRealm(user, realm),
        readGoalsInRealm(user, realm),
        readPlacesInRealm(user, realm),
        readMissionsInRealm(user, realm),
        readTodayMissionsInRealm(user, realm),
        readMissionRecordsInRealm(user, realm),
        mkStaticStr(user, realm),
        nowRecordInRealm(user, realm),
      ]);
      realm.close();

      dispatch(addBlockedApps(tempBlockedApps));
      setBlockedApps(tempBlockedApps);
      dispatch(initCategory(tempGoals));
      dispatch(initPlace(tempPlaces));
      // console.log(
      //   '??????',
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
      dispatch(initRecord({data: tempRecords, data2: tempRecord}));
      // console.log('??? ??????????', tempRecord);
      dispatch(initStatics(tempStatics));

      const {friendInfo, friendCurStates} = await user.callFunction(
        'friend/readFriends',
        {
          owner_id: user.id,
        },
      );
      console.log(friendInfo, friendCurStates);
      let tempFriends = !friendInfo.items ? [] : friendInfo.items,
        tempCandidates = !friendInfo.receivedRequests
          ? []
          : friendInfo.receivedRequests.map(cand => {
              return {_id: cand.owner_id, nickname: cand.nickname};
            });

      const resultFriends = [];
      for (let i = 0; i < tempFriends.length; i++) {
        const state = friendCurStates[i].isNowUsingProhibitedApp
          ? friendCurStates[i].isNowGivingUp
            ? 'unlock_quit'
            : 'quit'
          : friendCurStates[i].isNowDoingMission
          ? 'lock'
          : 'none';

        const friend = {
          _id: tempFriends[i].owner_id,
          nickname: tempFriends[i].nickname,
          state,
        };
        resultFriends.push(friend);
      }
      dispatch(initFriend({data: resultFriends, candidate: tempCandidates}));
      // console.log(tempFriends, tempCandidates);
      // console.log(
      //   '?????? ??????!!!',
      //   tempTodayMissions.map(mission => mkTodayMissionRealmObjToObj(mission)),
      // );
      console.log('???????????? ??????');
    } catch (err) {
      console.log(err);
    }
  }, [dispatch, user]);

  const deniedPermissionAlert = React.useCallback(() => {
    Alert.alert(
      '??????',
      '?????? ????????? ?????? ????????? ?????? ???????????????.\n???????????? ???????????? ????????? ??????????????????. ',
      [
        {
          text: '??? ??????',
          onPress: () => {
            BackHandler.exitApp();
          },
        },
        {
          text: '?????? ?????? ??????',
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

    console.log('????????? ?????? ??????', allowCnt);
    if (allowCnt === 3) {
      setCheckStatus(Status.OK);

      console.log('????????? ??????');
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
      console.log('?????? ?????? ??? ?????????');
      Alert.alert(
        '?????? ?????? ??????',
        `${3 - allowCnt}?????? ?????? ????????? ???????????????.\n\n${
          !isCurAppPermissionAllowed ? '- ???????????? ?????? ??????\n' : ''
        }${!isLockAppPermissionAllowed ? '- ?????? ??? ?????? ??????\n' : ''}${
          !isMissionPermissionAllowed ? '- ??????????????? ?????? ?????? ??????' : ''
        }
      `,
        [
          {
            text: '??????',
            onPress: () => {
              deniedPermissionAlert();
            },
          },
          {
            text: '???????????? ??????',
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
        Alert.alert('??????', '?????? ?????????????????????????', [
          {
            text: '??????',
          },
          {text: '??????', onPress: () => BackHandler.exitApp()},
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

          if (route.name === '???') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === '??????') {
            iconName = focused ? 'paper-plane' : 'paper-plane-outline';
          } else if (route.name === '??????') {
            iconName = focused ? 'trophy' : 'trophy-outline';
          } else if (route.name === '??????') {
            iconName = focused ? 'podium' : 'podium-outline';
          } else if (route.name === '??????') {
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
          if (route.name === '???') {
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
          if (route.name === '???') {
            return (
              <TouchableOpacity
                style={styles.tabButtonStyle}
                onPress={onPressLogOut}>
                <Text style={{color: 'black', marginRight: 3}}>????????????</Text>
                <Icon name={'log-out'} size={30} color={'black'} />
              </TouchableOpacity>
            );
          } else if (route.name === '??????') {
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
                    ?????? ??????
                  </Text>
                  <Icon name={'map-sharp'} size={30} color={'black'} />
                </TouchableOpacity>
              </View>
            );
          }
        },
      })}>
      {/* ??? -> tabBarBadge: ?????? ?????? ?????? ?????? ????????? ????????????(?) */}
      <Tab.Screen name="???" component={HomeTab} />
      <Tab.Screen name="??????" component={GoalTab} />
      <Tab.Screen name="??????" component={Record} />
      <Tab.Screen name="??????" component={Statistics} />
      <Tab.Screen name="??????" component={FriendTab} />
    </Tab.Navigator>
  );
}

export default Detail;
