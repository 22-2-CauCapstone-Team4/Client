import React, {useEffect, useState} from 'react';
import Icon from 'react-native-vector-icons/Ionicons';
import {
  SafeAreaView,
  TouchableOpacity,
  Text,
  View,
  FlatList,
  StyleSheet,
} from 'react-native';

import {styles} from '../../utils/styles';
import Colors from '../../utils/Colors';

const numColumns = 3;
export const apps = [
  {id: 0, appName: 'Chrome'},
  {id: 1, appName: 'YouTube'},
  {id: 2, appName: '카카오톡'},
  {id: 3, appName: 'Instagram'},
  {id: 4, appName: 'Chrome'},
  {id: 5, appName: 'YouTube'},
  {id: 6, appName: '카카오톡'},
  {id: 7, appName: 'Instagram'},
  {id: 8, appName: 'Chrome'},
  {id: 9, appName: 'YouTube'},
  {id: 10, appName: '카카오톡'},
  {id: 11, appName: 'Instagram'},
  {id: 12, appName: 'Chrome'},
  {id: 13, appName: 'YouTube'},
  {id: 14, appName: '카카오톡'},
  {id: 15, appName: 'Instagram'},
  {id: 16, appName: 'Chrome'},
  {id: 17, appName: 'YouTube'},
  {id: 18, appName: '카카오톡'},
  {id: 19, appName: 'Instagram'},
]; // image 추가 예정

// blockedApps: 해당 유저가 설정해놓은 금지 앱 정보들

export default function BlockApp({navigation, onCreate}) {
  const [blockedApps, setBlockedApps] = useState([
    // 사용자가 설정해 둔 금지 어플 여기다가 저장
    {id: 0, appName: 'Chrome'},
    {id: 1, appName: 'YouTube'},
    {id: 2, appName: '카카오톡'},
  ]);

  const [clicked, setClicked] = useState(true);

  const clickedText = () => <Text>123</Text>;

  //FlatList에 어플 하나씩 나열
  _renderItems = ({item, index}) => {
    return (
      <View style={{justifyContent: 'center', alignItems: 'center'}}>
        <TouchableOpacity
          style={styled.appBox}
          onPress={() => {
            // blockedApp에 있는데 클릭됐으면 blockedApp에서 제거하고 클릭 표시 아이콘 state 변경
            if (blockedApps.find(item => item.id === index)) {
              console.log('now is free');
              setBlockedApps(blockedApps.filter(app => app.id !== index));
              setClicked(false);
            }
            // 없으면 blockedApp에 추가하고 클릭 표시 아이콘 state 변경
            else {
              console.log('now is blocked');
              setBlockedApps(blockedApps.concat(item));
              setClicked(true);
            }
          }}>
          {blockedApps.find(item => item.id === index) ? (
            <Icon
              name={'checkmark-circle'}
              size={30}
              color={Colors.MAIN_COLOR}
            />
          ) : null}
        </TouchableOpacity>
        <Text style={{color: 'black'}}>{item.appName}</Text>
      </View>
    );
  };
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
