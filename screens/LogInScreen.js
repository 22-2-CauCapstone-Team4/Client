import * as React from 'react';
import {
  Text,
  Circle,
  Box,
  NativeBaseProvider,
  Center,
  Button,
  Input,
  Pressable,
} from 'native-base';

function LogInScreen({navigation}) {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Circle size="100px" bg="secondary.400" m="2" />
        <Box>
          <Input w="200px" m="1" size="md" placeholder="이메일" />
          <Input w="200px" m="1" size="md" placeholder="비밀번호" />
          <Pressable
            alignSelf="flex-end"
            onPress={() => navigation.navigate('계정 만들기')}>
            <Text>가입하기</Text>
          </Pressable>
        </Box>

        {/*로그인 성공 시 Detail(가명) 네비로 이동 */}
        <Button m="10" onPress={() => navigation.navigate('Detail')}>
          로그인
        </Button>
      </Center>
    </NativeBaseProvider>
  );
}

export default LogInScreen;
