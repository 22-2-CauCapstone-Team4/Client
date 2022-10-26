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
    }
  };

  return (
    <NativeBaseProvider>
      <VStack my="20" flex={1} alignItems="center">
        <Box w="300px" alignItems="center">
          <VStack>
            <Text mb="2" fontSize="20" fontWeight="700">
              회원 가입
            </Text>
          </VStack>
          <Divider
            mb="10"
            _light={{
              bg: 'muted.400',
            }}></Divider>
        </Box>

        <Box w="280px">
          <HStack
            w="280px"
            alignItems="center"
            justifyContent="space-between"
            maxW="500px"
            maxH="100px">
            <Input
              onChangeText={setEmail}
              value={email}
              w="180px"
              h="45px"
              size="md"
              mr="3"
              placeholder="이메일"
            />
            <Button
              bg="#0891b220"
              _text={{color: 'primary.600'}}
              variant={'active'}
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
          <Text mb="1" fontSize="xs" color="#DD0000">
            {emailValid}
          </Text>
          <VStack w="280px" justifyContent="center">
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
              value={password} // 입력하면, 입력 이메일 안 보이게 수정하기
              w="180px"
              size="md"
              placeholder="비밀번호"
            />
            <Text mb="1" fontSize="xs" color="#DD0000">
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
              value={confirm} // 입력하면, 입력 이메일 안 보이게 수정하기
              w="180px"
              size="md"
              placeholder="비밀번호 확인"
            />
            <Text mb="1" fontSize="xs" color="#DD0000">
              {confirmValid}
            </Text>
          </VStack>
          <HStack
            mb="7"
            alignItems="center"
            justifyContent="space-between"
            w="280px">
            <Input w="180px" h="45px" size="md" mr="3" placeholder="닉네임" />
            <Button
              bg="#0891b220"
              _text={{color: 'primary.600'}}
              onPress={() => {}}>
              확인
            </Button>
          </HStack>
        </Box>
        <Box alignItems="center">
          <Pressable onPress={() => navigation.pop()}>
            <Text mb="5">로그인 화면으로 전환</Text>
          </Pressable>
          <Button w="200px" onPress={onPressSignUp}>
            계정 생성
          </Button>
        </Box>
      </VStack>
    </NativeBaseProvider>
  );
}

export default CreateAccountScreen;
