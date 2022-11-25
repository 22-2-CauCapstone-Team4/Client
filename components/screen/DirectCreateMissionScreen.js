import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from '../../utils/styles';

export default function DirectCreateMissionScreen({navigation}) {
  return (
    <>
      <View style={styles.makeCenter}>
        <Text>DirectCreateMissionScreen</Text>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>뒤로가려면 절 눌러주세요</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
