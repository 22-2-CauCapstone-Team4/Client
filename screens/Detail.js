import React from 'react';
import {StyleSheet} from 'react-native';
import {NativeBaseProvider, Center, Button} from 'native-base';

function Detail({navigation}) {
  return (
    <NativeBaseProvider style={styles.v}>
      <Center flex={1}>
        <Button onPress={() => {}}>BLANK</Button>
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
