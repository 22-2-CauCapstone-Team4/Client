import React, {useState, useEffect} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
  BackHandler,
} from 'react-native';
import {useAuth} from '../../providers/AuthProvider';
import {AppListModule, ForegroundServiceModule} from '../../wrap_module';
import {readProhibitedApps, updateProhibitedApps} from '../../functions';

import {styles} from '../../utils/styles';
import Colors from '../../utils/Colors';

const numColumns = 3;
// blockedApps: 해당 유저가 설정해놓은 금지 앱 정보들

export default function BlockApp({navigation}) {
  const Status = {};
  Object.freeze(Status);

  const {user} = useAuth();

  const [isLoadingStarted, setIsLoadingStarted] = useState(false);
  const [apps, setApps] = useState([]);
  const [blockedApps, setBlockedApps] = useState([]);

  useEffect(() => {
    if (!isLoadingStarted) {
      loadingApps();
    }

    const backAction = async () => {
      if (navigation?.canGoBack()) {
        try {
          await Promise.all([
            updateProhibitedApps(user, blockedApps),
            ForegroundServiceModule.startService(
              blockedApps.map(blockedApp => blockedApp.packageName),
            ),
          ]);
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
  }, [blockedApps, loadingApps, isLoadingStarted, navigation, user]);

  const loadingApps = React.useCallback(async () => {
    setIsLoadingStarted(true);

    console.log('설치 앱 리스트 불러오기 시작');
    let [tempApps, tempBlockApps] = await Promise.all([
      AppListModule.getAppList(),
      readProhibitedApps(user),
    ]);
    tempApps = tempApps.appList;
    console.log(tempApps[0]);

    tempApps = tempApps.map((app, index) => {
      return {...app, index};
    });
    setApps(tempApps);

    tempBlockApps.map((app, index) => {
      return {...app, index};
    });
    setBlockedApps(tempBlockApps);
    // console.log(apps, blockedApps);
    console.log('불러오기 완료');
  }, [user]);

  //FlatList에 어플 하나씩 나열
  _renderItems = ({item, index}) => {
    return (
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          style={styled.appBox}
          onPress={() => {
            // blockedApp에 있는데 클릭됐으면 blockedApp에서 제거하고 클릭 표시 아이콘 state 변경
            if (blockedApps.find(item => item.index === index)) {
              console.log('now is free');
              setBlockedApps(blockedApps.filter(app => app.index !== index));
            }
            // 없으면 blockedApp에 추가하고 클릭 표시 아이콘 state 변경
            else {
              console.log('now is blocked');
              setBlockedApps(blockedApps.concat(item));
            }
          }}>
          {blockedApps.find(item => item.index === index) ? (
            <Icon
              name={'checkmark-circle'}
              size={30}
              color={Colors.MAIN_COLOR}
            />
          ) : null}
        </TouchableOpacity>
        {/*앱 박스 너비, 높이 달라지면 width 변경해줘야함*/}
        <View style={{width: 80}}>
          <Text numberOfLines={1} style={{color: 'black'}}>
            {item.name}
          </Text>
        </View>
      </View>
    );
  };
  // 현재 잠금 앱 목록 Log
  console.log(blockedApps);
  return (
    <>
      <SafeAreaView style={styles.centeredView}>
        <Text
          style={{
            color: Colors.MAIN_COLOR,
            fontSize: 20,
            fontWeight: 'bold',
            paddingTop: 40,
          }}>
          제한할 앱을 선택해주세요
        </Text>
        <FlatList
          style={{marginTop: 40}}
          numColumns={numColumns}
          data={apps}
          renderItem={this._renderItems}
          keyExtractor={(item, index) => index.toString()}
        />
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
    borderColor: 'black',
    borderWidth: 1,
    width: 80,
    height: 80,
    margin: 10,
  },
});
