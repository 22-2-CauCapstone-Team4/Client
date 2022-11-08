import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';

export default function CreateMissionScreen({navigation}) {
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
