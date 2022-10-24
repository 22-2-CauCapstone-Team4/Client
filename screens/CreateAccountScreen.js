import * as React from 'react';
import {
  Box,
  NativeBaseProvider,
  Center,
  Button,
  Input,
  Flex,
  Text,
  HStack,
  VStack,
  Spacer,
} from 'native-base';
import SnackBar from 'react-native-snackbar';

function CreateAccountScreen({navigation}) {
  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Text mb="10" fontSize="20" fontWeight="700">
          계정을 만들어주세요
        </Text>
        <HStack
          mb="7"
          w="280px"
          space={2}
          alignItems="center"
          justifyContent="space-between"
          maxW="500px"
          maxH="120px">
          <Input w="180px" h="45px" size="md" mr="3" placeholder="이메일" />
          <Button onPress={() => {}}>확인</Button>
        </HStack>
        <VStack w="280px" justifyContent="center" mb="7">
          <Input w="180px" mb="7" size="md" placeholder="비밀번호" />
          <Input w="180px" size="md" placeholder="비밀번호 확인" />
        </VStack>

        <HStack
          mb="10"
          alignItems="center"
          justifyContent="space-between"
          w="280px">
          <Input w="180px" h="45px" size="md" mr="3" placeholder="닉네임" />
          <Button onPress={() => {}}>확인</Button>
        </HStack>
        <HStack alignItems="center" justifyContent="space-evenly" w="280px">
          <Button
            onPress={() =>
              SnackBar.show({
                text: '계정이 생성됐습니다!',
                duration: SnackBar.LENGTH_SHORT,
              })
            }>
            계정 생성
          </Button>
          <Button onPress={() => navigation.navigate('Detail')}>
            로그인하기
          </Button>
        </HStack>

        {/*로그인 성공 시 Detail(가명) 네비로 이동 */}
      </Center>
    </NativeBaseProvider>
  );
}

export default CreateAccountScreen;
