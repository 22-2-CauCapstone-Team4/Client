import React from 'react';
import {StyleSheet} from 'react-native';
import {NativeBaseProvider, Center, Button} from 'native-base';

import {AppListModule, CurAppModule, LockAppModule} from '../wrap_module';
import SnackBar from 'react-native-snackbar';

function Detail({navigation}) {
  const onPressAppList = async () => {
    try {
      const {nameList, iconList} = await AppListModule.getAppList();
      // 예시 코드 : 콘솔에 설치된 앱 중 7번째 앱의 이름, icon bitmap string 띄우기
      console.log('7번째 앱: ' + nameList[7]);
      console.log(iconList[7]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onPressCheckPermission = async () => {
    try {
      const {alreadyAllowed} = await CurAppModule.allowPermission();

      if (alreadyAllowed) {
        SnackBar.show({
          text: '이미 권한이 허용되었습니다. ',
          duration: SnackBar.LENGTH_SHORT,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  const onPressStartService = async () => {
    try {
      await CurAppModule.startService([
        'com.github.android',
        'com.android.chrome',
      ]);
    } catch (err) {
      console.error(err.message);
    }
  };

  const onPressCheckPermission2 = async () => {
    try {
      const {alreadyAllowed} = await LockAppModule.allowPermission();

      if (alreadyAllowed) {
        SnackBar.show({
          text: '이미 권한이 허용되었습니다. ',
          duration: SnackBar.LENGTH_SHORT,
        });
      }
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <NativeBaseProvider style={styles.v}>
      <Center flex={1}>
        <Button onPress={onPressAppList}>App List</Button>
        <Button onPress={onPressCheckPermission}>Check Permission</Button>
        <Button onPress={onPressStartService}>Start Service</Button>
        <Button onPress={onPressCheckPermission2}>Check Permission 2</Button>
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
