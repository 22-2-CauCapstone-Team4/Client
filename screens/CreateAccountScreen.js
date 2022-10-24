import * as React from 'react';
import {
  Box,
  NativeBaseProvider,
  Center,
  Button,
  Input,
  Flex,
} from 'native-base';
import SnackBar from 'react-native-snackbar';

function CreateAccountScreen({navigation}) {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Box maxW="500px" maxH="600px">
          <Flex direction="row" alignItems="center" maxW="500px" maxH="120px">
            <Input w="150px" h="45px" size="md" mr="3" placeholder="이메일" />
            <Button m="10" onPress={() => {}}>
              확인
            </Button>
          </Flex>

          <Input w="250px" m="1" size="md" placeholder="비밀번호" />
          <Input w="250px" m="1" size="md" placeholder="비밀번호 확인" />

          <Flex direction="row" alignItems="center" maxW="500px" maxH="120px">
            <Input w="150px" h="45px" size="md" mr="3" placeholder="닉네임" />
            <Button m="10" onPress={() => {}}>
              확인
            </Button>
          </Flex>
          <Flex direction="row" alignItems="center" maxW="500px" maxH="120px">
            <Button
              m="6"
              onPress={() =>
                SnackBar.show({
                  text: '계정이 생성됐습니다!',
                  duration: SnackBar.LENGTH_SHORT,
                })
              }>
              계정 생성
            </Button>
            <Button m="6" onPress={() => navigation.navigate('Detail')}>
              로그인하기
            </Button>
          </Flex>
        </Box>

        {/*로그인 성공 시 Detail(가명) 네비로 이동 */}
      </Center>
    </NativeBaseProvider>
  );
}

export default CreateAccountScreen;
