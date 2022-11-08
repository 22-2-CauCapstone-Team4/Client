import React, {useEffect} from 'react';
import {View, TouchableOpacity, Text, BackHandler} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';

export default function CreateMissionScreen({navigation}) {
  //뒤로가기 -> 페이지 뒤로
  useEffect(() => {
    const backAction = () => {
      if (navigation?.canGoBack()) {
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
  }, []);
  return (
    <>
      <View style={styles.makeCenter}>
        <Text>CreateMissionScreen.js</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>뒤로가려면 절 눌러주세요</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
