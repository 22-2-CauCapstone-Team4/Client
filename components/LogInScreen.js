import * as React from 'react';
import {useAuth} from '../providers/AuthProvider';
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
// import {CurAppModule, LockAppModule} from '../wrap_module';

function LogInScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginValid, setLoginValid] = React.useState(' ');

  const {user, signIn} = useAuth();

  React.useEffect(() => {
    if (user != null) {
      navigation.navigate('Detail');
    }
  }, [navigation, user]);

  const onPressSignIn = async () => {
    try {
      await signIn(email, password);
      setLoginValid(' ');
      navigation.navigate('Detail');

      // 서비스 실행
      // ** TODO : 금지 앱 CRUD 이후 아래 코드 추가하기
      // ** TODO : 모달창 띄워서 권한 허락받기
      // try {
      //   let isAlreadyAllowed;
      //   do {
      //     ({isAlreadyAllowed} = await CurAppModule.allowPermission());
      //   } while (isAlreadyAllowed);
      //   do {
      //     ({isAlreadyAllowed} = await LockAppModule.allowPermission());
      //   } while (isAlreadyAllowed);

      //   await CurAppModule.startService([
      //     // 서비스 실행 시점
      //     // ** TODO: 1. 금지 앱 리스트 바뀔 때 (기존 것 삭제 + 실행)
      //     // ** TODO : 2. 부팅 시 (이때 앱에서 금지 앱 리스트 읽어올 수 있도록 코드 수정해야 할 듯)
      //     'com.github.android',
      //     'com.android.chrome',
      //   ]);
      // } catch (err) {
      //   console.error(err.message);
      // }

      SnackBar.show({
        text: '로그인이 완료되었습니다. ',
        duration: SnackBar.LENGTH_SHORT,
      });
    } catch (err) {
      console.error(err.message);
      setLoginValid('이메일 또는 비밀번호를 다시 확인해주세요.');
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
            onChangeText={text => setPassword(text)}
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
            onPress={() => navigation.navigate('계정 만들기')}>
            <Text textAlign="right">가입하기</Text>
          </Pressable>
        </Box>

        <Button w="300px" mt="2" mb="2" onPress={onPressSignIn}>
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
