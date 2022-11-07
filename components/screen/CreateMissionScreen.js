import React from 'react';
import {View, Button, Text} from 'react-native';
import {styles} from '../../utils/styles';
import {useNavigation} from '@react-navigation/native';

export default function CreateMissionScreen({navigation}) {
  return (
    <>
      <View style={styles.makeCenter}>
        <Button onPress={() => navigation.goBack()}>GO BACK</Button>
      </View>
    </>
  );
}
