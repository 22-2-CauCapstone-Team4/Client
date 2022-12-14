import React, {useState, useEffect} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  BackHandler,
  Image,
} from 'react-native';
import {useDispatch} from 'react-redux';
import {useAuth} from '../../providers/AuthProvider';
import {ForegroundServiceModule} from '../../wrap_module';
import {updateProhibitedAppsInRealm} from '../../functions';
import {addBlockedApps} from '../../store/action';
import {useSelector} from 'react-redux';
import {styles} from '../../utils/styles';
import Colors from '../../utils/Colors';
import {mkConfig} from '../../functions/mkConfig';
import {ProhibitedApp} from '../../schema';
import Realm from 'realm';

// blockedApps: 해당 유저가 설정해놓은 금지 앱 정보들
export default function BlockApp({navigation}) {
  const dispatch = useDispatch();
  const numColumns = 3;
  const {user} = useAuth();

  const apps = useSelector(store => store.appReducer.data);
  const [blockedApps, setBlockedApps] = useState(
    useSelector(store => store.blockedAppReducer.data),
  );

  useEffect(() => {
    const backAction = async () => {
      if (navigation?.canGoBack()) {
        try {
          Realm.open(mkConfig(user, [ProhibitedApp.schema])).then(
            async realm => {
              await updateProhibitedAppsInRealm(user, realm, blockedApps);
              realm.close();
            },
          );
          ForegroundServiceModule.startService(
            blockedApps.map(blockedApp => {
              return {
                name: blockedApp.name,
                packageName: blockedApp.packageName,
              };
            }),
            null,
          );

          dispatch(addBlockedApps(blockedApps));
        } catch (err) {
          console.log(err);
        }

        navigation.goBack();
        return true;
      }
      return false;
    };
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction,
    );

    return () => backHandler.remove();
  }, [blockedApps, dispatch, navigation, user]);

  //FlatList에 어플 하나씩 나열
  _renderItems = ({item}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={[
            styled.appBox,
            {
              backgroundColor: blockedApps.find(
                blockedItem => blockedItem.packageName === item.packageName,
              )
                ? Colors.MAIN_COLOR
                : null,
            },
          ]}
          onPress={() => {
            // blockedApp에 있는데 클릭됐으면 blockedApp에서 제거하고 클릭 표시 아이콘 state 변경
            if (
              blockedApps.find(
                blockedItem => blockedItem.packageName === item.packageName,
              )
            ) {
              console.log('now is free');
              setBlockedApps(
                blockedApps.filter(
                  blockedItem => blockedItem.packageName !== item.packageName,
                ),
              );
            }
            // 없으면 blockedApp에 추가하고 클릭 표시 아이콘 state 변경
            else {
              console.log('now is blocked');
              setBlockedApps(blockedApps.concat(item));
            }
          }}>
          <Image
            source={{
              uri: item.icon,
            }}
            style={{width: 60, height: 60}}
            color={Colors.MAIN_COLOR}
          />

          {/* {blockedApps.find(
            blockedItem => blockedItem.packageName === item.packageName,
          ) ? (
            <Ionicons
              style={{
                position: 'absolute',
                top: 10,
                left: 10,
              }}
              name={'checkmark-circle'}
              size={60}
              color="red"
            />
          ) : null} */}
        </TouchableOpacity>
        {/*앱 박스 너비, 높이 달라지면 width 변경해줘야함*/}
        <View style={{width: 80, alignItems: 'center'}}>
          <Text
            numberOfLines={1}
            style={{
              color: blockedApps.find(
                blockedItem => blockedItem.packageName === item.packageName,
              )
                ? Colors.MAIN_COLOR
                : 'black',
              fontSize: 10,
            }}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };
  // 현재 잠금 앱 목록 Log
  // console.log(blockedApps);
  return (
    <>
      <SafeAreaView style={styles.centeredView}>
        <Text
          style={{
            color: Colors.MAIN_COLOR,
            fontSize: 16,
            fontWeight: 'bold',
            paddingTop: 20,
          }}>
          미션 수행 시 금지할 앱을 선택해주세요.
        </Text>
        <View
          style={{
            padding: 5,
            marginTop: 25,
            borderLeftWidth: 1,
            borderLeftColor: Colors.MAIN_COLOR,
            borderRightWidth: 1,
            borderRightColor: Colors.MAIN_COLOR,
            borderTopWidth: 1,
            borderTopColor: Colors.MAIN_COLOR,
            borderRadius: 25,
          }}>
          <FlatList
            numColumns={numColumns}
            data={apps}
            renderItem={this._renderItems}
            keyExtractor={item => item.packageName}
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styled = StyleSheet.create({
  appBox: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    borderStyle: 'solid',
    borderColor: 'grey',
    borderWidth: 1,
    width: 80,
    height: 80,
    margin: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
