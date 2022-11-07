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

function LogInScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loginValid, setLoginValid] = React.useState(' ');

  const {user, signIn} = useAuth();

  React.useEffect(() => {
    if (user != null) {
      navigation.navigate('Menu');
    }
  }, [navigation, user]);

  const onPressSignIn = async () => {
    try {
      await signIn(email, password);
      setLoginValid(' ');
      navigation.navigate('Menu');
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
            onPress={() => navigation.navigate('CreateAccount')}>
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
