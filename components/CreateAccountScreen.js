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
  Divider,
  FormControl,
} from 'native-base';
import SnackBar from 'react-native-snackbar';
import {enableScreens} from 'react-native-screens';

function CreateAccountScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [emailValid, setEmailValid] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState('');
  const [confirmValid, setConfirmValid] = React.useState('');
  const [createValid, setCreateValid] = React.useState('');

  const {signUp, signIn} = useAuth();

  const regexEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

  const comparePasswords = text => {
    if (text != confirm) {
      setConfirmValid('비밀번호가 동일하지 않습니다.');
    } else {
      setConfirmValid(' ');
    }
  };

  const onPressSignUp = async () => {
    if (emailValid === ' ' && passwordValid === ' ' && confirmValid === ' ') {
      setCreateValid('');
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
    } else {
      setCreateValid('필요한 정보를 모두 입력해주세요.');
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} alignItems="center">
        <VStack>
          <Box w="300px" alignItems="center">
            <VStack>
              <Text mb="8" fontSize="3xl" fontWeight="700">
                회원 가입
              </Text>
            </VStack>
          </Box>

          <Box w="300px" justifyItems="center" mb="6">
            <HStack
              w="300px"
              justifyContent="space-between"
              alignItems="center"
              maxW="500px"
              maxH="100px">
              <Input
                onChangeText={setEmail}
                value={email}
                w="200px"
                h="45px"
                size="md"
                mr="3"
                placeholder="이메일"
              />
              <Button
                w="80px"
                bg="#0891b220"
                _text={{color: 'primary.600'}}
                onPress={() => {
                  if (!regexEmail.test(email)) {
                    setEmailValid('올바른 형식이 아닙니다.');
                  } else {
                    setEmailValid(' ');
                  }
                }}>
                확인
              </Button>
            </HStack>
            <Text my="1" fontSize="xs" color="#DD0000">
              {emailValid}
            </Text>
            <VStack w="300px" justifyContent="center">
              <Input
                secureTextEntry={true}
                onChangeText={text => {
                  setPassword(text);
                  comparePasswords(text);
                  if (text.length < 8) {
                    setPasswordValid('비밀번호는 8자리 이상이어야 합니다.');
                  } else {
                    setPasswordValid(' ');
                  }
                }}
                value={password}
                w="300px"
                size="md"
                placeholder="비밀번호"
              />
              <Text my="1" fontSize="xs" color="#DD0000">
                {passwordValid}
              </Text>
              <Input
                secureTextEntry={true}
                onChangeText={text => {
                  setConfirm(text);
                  if (text !== password) {
                    setConfirmValid('비밀번호가 동일하지 않습니다.');
                  } else {
                    setConfirmValid(' ');
                  }
                }}
                value={confirm}
                w="300px"
                size="md"
                placeholder="비밀번호 확인"
              />
              <Text my="1" fontSize="xs" color="#DD0000">
                {confirmValid}
              </Text>
            </VStack>
            <HStack
              justifyContent="space-between"
              alignItems="center"
              w="300px">
              <Input w="200px" h="45px" size="md" mr="3" placeholder="닉네임" />
              <Button
                w="80px"
                bg="#0891b220"
                _text={{color: 'primary.600'}}
                onPress={() => {}}>
                확인
              </Button>
            </HStack>
          </Box>
          <Box>
            <Pressable onPress={() => navigation.pop()}>
              <Text textAlign="right" mb="2">
                로그인하기
              </Text>
            </Pressable>
            <Button mb="2" w="300px" onPress={onPressSignUp}>
              계정 생성
            </Button>
            <Text textAlign="center" color="#DD0000">
              {createValid}
            </Text>
          </Box>
        </VStack>
      </Center>
    </NativeBaseProvider>
  );
}

export default CreateAccountScreen;
