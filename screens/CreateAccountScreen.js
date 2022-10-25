import * as React from 'react';
import {useAuth} from '../providers/AuthProvider';
import {
  NativeBaseProvider,
  Center,
  Box,
  Button,
  Input,
  Text,
  HStack,
  VStack,
  Pressable,
} from 'native-base';
import SnackBar from 'react-native-snackbar';

function CreateAccountScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');

  const {signUp, signIn} = useAuth();

  const onPressSignUp = async () => {
    // validation 코드 필요
    // - 이메일 형식
    // - 비밀번호 8자 이상
    // - email === confirm

    try {
      await signUp(email, password);
      await signIn(email, password);
      navigation.navigate('Detail');

      SnackBar.show({
        text: '계정 생성이 완료되었습니다. ',
        duration: SnackBar.LENGTH_SHORT,
      });
    } catch (err) {
      console.error(err.message);
      SnackBar.show({
        text: `계정 생성을 실패했습니다. : ${err.message}`,
        duration: SnackBar.LENGTH_SHORT,
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Text mb="10" fontSize="20" fontWeight="700">
          계정을 만들어주세요
        </Text>
        <Box>
          <HStack
            mb="7"
            w="280px"
            space={2}
            alignItems="center"
            justifyContent="space-between"
            maxW="500px"
            maxH="120px">
            <Input
              onChangeText={setEmail}
              value={email}
              w="180px"
              h="45px"
              size="md"
              mr="3"
              placeholder="이메일"
            />
            <Button onPress={() => {}}>확인</Button>
          </HStack>
          <VStack w="280px" justifyContent="center" mb="7">
            <Input
              onChangeText={text => setPassword(text)}
              value={password} // 입력하면, 입력 이메일 안 보이게 수정하기
              w="180px"
              mb="7"
              size="md"
              placeholder="비밀번호"
            />
            <Input
              onChangeText={text => setConfirm(text)}
              value={confirm} // 입력하면, 입력 이메일 안 보이게 수정하기
              w="180px"
              size="md"
              placeholder="비밀번호 확인"
            />
          </VStack>

          <HStack
            mb="10"
            alignItems="center"
            justifyContent="space-between"
            w="280px">
            <Input w="180px" h="45px" size="md" mr="3" placeholder="닉네임" />
            <Button onPress={() => {}}>확인</Button>
          </HStack>
          <Pressable
            alignSelf="flex-end"
            onPress={() => navigation.navigate('로그인')}>
            <Text>로그인 화면으로 전환</Text>
          </Pressable>
        </Box>
        <Button onPress={onPressSignUp}>계정 생성</Button>
      </Center>
    </NativeBaseProvider>
  );
}

export default CreateAccountScreen;
