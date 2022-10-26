import React from 'react';
import {StyleSheet} from 'react-native';
import {NativeBaseProvider, Center, Button} from 'native-base';

import AppListModule from '../wrap_module';

function Detail({navigation}) {
  const onPressAppList = async () => {
    const {nameList, iconList} = await AppListModule.getAppList();
    console.log('7번째 앱: ' + nameList[7]);
    console.log(iconList[7]);
  };

  return (
    <NativeBaseProvider style={styles.v}>
      <Center flex={1}>
        <Button onPress={onPressAppList}>Detail</Button>
      </Center>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  v: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Detail;
