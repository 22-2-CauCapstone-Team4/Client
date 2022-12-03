import * as React from 'react';
import {useAuth} from '../../providers/AuthProvider';
import {
  Text,
  Box,
  NativeBaseProvider,
  Center,
  Button,
  Input,
  Pressable,
} from 'native-base';
import SnackBar from 'react-native-snackbar';
// import {CurAppModule} from '../../wrap_module';

function LogInScreen({navigation}) {
  const Status = {
    NOT_CHECKED_YET: 0,
    NOW_CHECKING: 1,
    ERROR: 2,
    OK: 3,
  };
  Object.freeze(Status);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginValid, setLoginValid] = React.useState('');
  const [checkSignInStatus, setCheckSignInStatus] = React.useState(
    Status.NOT_CHECKED_YET,
  );

  const {user, signIn} = useAuth();

  React.useEffect(() => {
    if (
      user !== null &&
      user.providerType === 'local-userpass' &&
      user.isLoggedIn
    ) {
      navigation.replace('Menu');
    }
  }, [navigation, user]);

  const onPressSignIn = async () => {
    try {
      setCheckSignInStatus(Status.NOW_CHECKING);

      await signIn({email, password});
      setLoginValid(' ');
      navigation.replace('Menu');

      SnackBar.show({
        text: '로그인이 완료되었습니다. ',
        duration: SnackBar.LENGTH_SHORT,
      });
    } catch (err) {
      setCheckSignInStatus(Status.NOT_CHECKED_YET);

      console.log(err.message);
      setLoginValid('이메일 또는 비밀번호를 다시 확인해주세요. ');
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Text alignSelf="center" fontSize="3xl" fontWeight="700" mb="8">
          로그인
        </Text>
        <Box>
          <Input
            onChangeText={setEmail}
            value={email}
            w="300px"
            m="1"
            size="md"
            placeholder="이메일"
          />
          <Input
            onChangeText={setPassword}
            value={password}
            secureTextEntry={true} // 입력하면, 입력 이메일 안 보이게 수정하기
            w="300px"
            m="1"
            mb="6"
            size="md"
            placeholder="비밀번호"
          />
          <Pressable
            w="300px"
            onPress={() => navigation.replace('CreateAccount')}>
            <Text textAlign="right">가입하기</Text>
          </Pressable>
        </Box>

        <Button
          w="300px"
          mt="2"
          mb="2"
          isLoading={checkSignInStatus === Status.NOW_CHECKING}
          onPress={onPressSignIn}>
          로그인
        </Button>
        <Text fontSize="sm" color="#DD0000" alignSelf="center">
          {loginValid}
        </Text>
      </Center>
    </NativeBaseProvider>
  );
}

export default LogInScreen;
