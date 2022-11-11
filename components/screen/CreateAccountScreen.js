import * as React from 'react';
import {useAuth} from '../../providers/AuthProvider';
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
  const Status = {
    NOT_CHECKED_YET: 0,
    NOW_CHECKING: 1,
    ERROR: 2,
    OK: 3,
  };
  Object.freeze(Status);

  const [tempUser, setTempUser] = React.useState();
  const [email, setEmail] = React.useState('');
  const [nickname, setNickname] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirm, setConfirm] = React.useState('');
  const [emailValid, setEmailValid] = React.useState('');
  const [passwordValid, setPasswordValid] = React.useState('');
  const [confirmValid, setConfirmValid] = React.useState('');
  const [nicknameValid, setNicknameValid] = React.useState('');
  const [createValid, setCreateValid] = React.useState('');
  const [checkEmailStatus, setCheckEmailStatus] = React.useState(
    Status.NOT_CHECKED_YET,
  );
  const [checkNicknameStatus, setCheckNicknameStatus] = React.useState(
    Status.NOT_CHECKED_YET,
  );
  const [checkSignUpStatus, setCheckSignUpStatus] = React.useState(
    Status.NOT_CHECKED_YET,
  );

  const {signUp, tempSignIn, user} = useAuth();

  React.useEffect(() => {
    const innerFunc = async () => {
      if (user !== null) {
        setTempUser(user);
        console.log('user 존재');
      } else {
        const temp = await tempSignIn();
        setTempUser(temp);
        console.log('user 존재 X');
      }
    };

    innerFunc();
  }, [navigation, tempSignIn, user]);

  // 클릭 시 사용 가능한 메소드
  const comparePasswords = text => {
    if (text !== confirm) {
      setConfirmValid('비밀번호가 동일하지 않습니다.');
    } else {
      setConfirmValid(' ');
    }
  };

  const checkEmail = text => {
    const regexEmail = /^[A-Za-z0-9_\.\-]+@[A-Za-z0-9\-]+\.[A-Za-z0-9\-]+/;

    setEmail(text);
    setCheckEmailStatus(Status.NOT_CHECKED_YET);
    if (!regexEmail.test(text)) {
      setEmailValid('올바른 형식이 아닙니다.');
      return false;
    }

    setEmailValid(' ');
    return true;
  };

  const checkNickname = text => {
    text.trim();
    setNickname(text);
    setCheckNicknameStatus(Status.NOT_CHECKED_YET);
    if (text.length > 8) {
      setNicknameValid('닉네임은 8자 이내여야 합니다. ');
      return false;
    } else if (text === '') {
      setNicknameValid('빈 문자열은 닉네임으로 사용이 불가능합니다. ');
      return false;
    }

    setNicknameValid(' ');
    return true;
  };

  const onPressCheckEmail = async () => {
    if (!checkEmail(email)) {
      return;
    }

    try {
      // 중복 유무 확인 시작
      setCheckEmailStatus(Status.NOW_CHECKING);

      // if (tempUser === null || typeof tempUser === 'undefined') {
      //   const temp = await tempSignIn();
      //   setTempUser(temp);
      // }

      const {success, isExisted, err} = await tempUser.callFunction(
        'user/checkEmailExisted',
        email,
      );

      if (!success) {
        throw new Error(err);
      }

      if (isExisted) {
        setEmailValid('이미 사용 중인 이메일입니다. ');
        setCheckEmailStatus(Status.ERROR);
      } else {
        setEmailValid('사용 가능한 이메일입니다. ');
        setCheckEmailStatus(Status.OK);
      }
    } catch (err) {
      setEmailValid('문제가 발생했습니다. 다시 한 번 시도해주세요. ');
      setCheckEmailStatus(Status.ERROR);
      console.log(err.message);
    }
  };

  const onPressCheckNickname = async () => {
    if (!checkNickname(nickname)) {
      return;
    }

    try {
      // 확인 시작
      setCheckNicknameStatus(Status.NOW_CHECKING);

      // if (tempUser === null || typeof tempUser === 'undefined') {
      //   const temp = await tempSignIn();
      //   setTempUser(temp);
      // }

      const {success, isExisted, err} = await tempUser.callFunction(
        'user/checkNicknameExisted',
        nickname,
      );

      if (!success) {
        throw new Error(err);
      }

      if (isExisted) {
        setNicknameValid('이미 사용 중인 닉네임입니다. ');
        setCheckNicknameStatus(Status.ERROR);
      } else {
        setNicknameValid('사용 가능한 닉네임입니다. ');
        setCheckNicknameStatus(Status.OK);
      }
    } catch (err) {
      setEmailValid('문제가 발생했습니다. 다시 한 번 시도해주세요. ');
      setCheckNicknameStatus(Status.ERROR);
      console.log(err.message);
    }
  };

  const onPressSignUp = async () => {
    setCheckSignUpStatus(Status.NOW_CHECKING);

    if (
      checkEmailStatus !== Status.OK ||
      checkNicknameStatus !== Status.OK ||
      passwordValid !== ' ' ||
      confirmValid !== ' '
    ) {
      if (
        passwordValid === ' ' &&
        confirmValid === ' ' &&
        emailValid === ' ' &&
        checkEmailStatus === Status.NOT_CHECKED_YET
      ) {
        setCreateValid('이메일 확인 버튼으로 중복을 확인해주세요. ');
      } else if (
        passwordValid === ' ' &&
        confirmValid === ' ' &&
        nicknameValid === ' ' &&
        checkNicknameStatus === Status.NOT_CHECKED_YET
      ) {
        setCreateValid('닉네임 확인 버튼으로 중복을 확인해주세요. ');
      } else {
        setCreateValid('입력한 정보를 다시 확인해주세요.');
      }

      setCheckSignUpStatus(Status.NOT_CHECKED_YET);
      return;
    }

    // 문제 없는 경우
    setCreateValid('');

    try {
      await signUp({email, password, nickname});
      console.log('회원가입, 로그인 완료');

      SnackBar.show({
        text: '계정 생성이 완료되었습니다. ',
        duration: SnackBar.LENGTH_SHORT,
      });
    } catch (err) {
      setCheckSignUpStatus(Status.NOT_CHECKED_YET);

      console.log(err.message);
      SnackBar.show({
        text: `계정 생성을 실패했습니다. : ${err.message}`,
        duration: SnackBar.LENGTH_SHORT,
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1} alignItems="center">
        <VStack>
          <Box w="300px" alignItems="center">
            <VStack>
              <Text mb="8" fontSize="3xl" fontWeight="700">
                회원가입
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
                onChangeText={checkEmail}
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
                isLoading={checkEmailStatus === Status.NOW_CHECKING}
                onPress={onPressCheckEmail}>
                확인
              </Button>
            </HStack>
            <Text
              my="1"
              fontSize="xs"
              color={
                checkEmailStatus !== Status.OK ? '#DD0000' : 'primary.600'
              }>
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
              <Input
                onChangeText={checkNickname}
                value={nickname}
                w="200px"
                h="45px"
                size="md"
                mr="3"
                placeholder="닉네임"
              />
              <Button
                w="80px"
                bg="#0891b220"
                _text={{color: 'primary.600'}}
                isLoading={checkNicknameStatus === Status.NOW_CHECKING}
                onPress={onPressCheckNickname}>
                확인
              </Button>
            </HStack>
            <Text
              my="1"
              fontSize="xs"
              color={
                checkNicknameStatus !== Status.OK ? '#DD0000' : 'primary.600'
              }>
              {nicknameValid}
            </Text>
          </Box>
          <Box>
            <Pressable onPress={() => navigation.pop()}>
              <Text textAlign="right" mb="2">
                로그인하기
              </Text>
            </Pressable>
            <Button
              mb="2"
              w="300px"
              onPress={onPressSignUp}
              isLoading={checkSignUpStatus === Status.NOW_CHECKING}>
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
