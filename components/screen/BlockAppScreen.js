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
import {useDispatch} from 'react-redux';
import {useAuth} from '../../providers/AuthProvider';
import {ForegroundServiceModule} from '../../wrap_module';
import {updateProhibitedApps} from '../../functions';
import {addBlockedApps} from '../../store/action';
import {useSelector} from 'react-redux';
import {styles} from '../../utils/styles';
import Colors from '../../utils/Colors';

// blockedApps: 해당 유저가 설정해놓은 금지 앱 정보들
export default function BlockApp({navigation}) {
  const dispatch = useDispatch();
  const numColumns = 3;
  const {user} = useAuth();

  const apps = useSelector(store => store.appReducer.data);
  const blockedApps = useSelector(store => store.blockedAppReducer.data);

  useEffect(() => {
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
  }, [blockedApps, navigation, user]);

  //FlatList에 어플 하나씩 나열
  _renderItems = ({item}) => {
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
            if (
              blockedApps.find(
                blockedItem => blockedItem.packageName === item.packageName,
              )
            ) {
              console.log('now is free');
              dispatch(
                blockedApps.filter(
                  blockedItem => blockedItem.packageName !== item.packageName,
                ),
              );
            }
            // 없으면 blockedApp에 추가하고 클릭 표시 아이콘 state 변경
            else {
              console.log('now is blocked');
              dispatch(addBlockedApps(blockedApps.concat(item)));
            }
          }}>
          {blockedApps.find(
            blockedItem => blockedItem.packageName === item.packageName,
          ) ? (
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
  // console.log(blockedApps);
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
          keyExtractor={item => item.packageName}
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
