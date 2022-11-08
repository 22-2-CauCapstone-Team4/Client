import React from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import {styles} from '../../utils/styles';

export default function FriendScreen({navigation}) {
  return (
    <>
      <View style={styles.makeCenter}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text>FriendScreen.js</Text>
          <Text>뒤로가려면 절 눌러주세요</Text>
        </TouchableOpacity>
      </View>
    </>
  );
}
