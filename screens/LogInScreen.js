import * as React from 'react';
import {useAuth} from '../providers/AuthProvider';
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
import SnackBar from 'react-native-snackbar';

function LogInScreen({navigation}) {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const {signIn} = useAuth();

  const onPressSignIn = async () => {
    try {
      await signIn(email, password);
      navigation.navigate('Detail');

      SnackBar.show({
        text: '로그인이 완료되었습니다. ',
        duration: SnackBar.LENGTH_SHORT,
      });
    } catch (err) {
      console.error(err.message);
      SnackBar.show({
        text: `로그인에 실패했습니다. : ${err.message}`,
        duration: SnackBar.LENGTH_SHORT,
      });
    }
  };

  return (
    <NativeBaseProvider>
      <Center flex={1}>
        <Circle size="100px" bg="secondary.400" mb="10" />
        <Box>
          <Input
            onChangeText={setEmail}
            value={email}
            w="200px"
            m="1"
            size="md"
            placeholder="이메일"
          />
          <Input
            onChangeText={text => setPassword(text)}
            value={password}
            secureTextEntry={true} // 입력하면, 입력 이메일 안 보이게 수정하기
            w="200px"
            m="1"
            mb="4"
            size="md"
            placeholder="비밀번호"
          />
          <Pressable
            alignSelf="flex-end"
            onPress={() => navigation.navigate('계정 만들기')}>
            <Text>가입하기</Text>
          </Pressable>
        </Box>

        {/*로그인 성공 시 Detail(가명) 네비로 이동 */}
        <Button m="10" onPress={onPressSignIn}>
          로그인
        </Button>
      </Center>
    </NativeBaseProvider>
  );
}

export default LogInScreen;
