import React, {useContext, useState, useEffect} from 'react';
import Realm from 'realm';
import {getRealmApp} from '../getRealmApp';

const app = getRealmApp();
const AuthContext = React.createContext(null);

const AuthProvider = ({children}) => {
  const [user, setUser] = useState(app.currentUser);

  useEffect(() => {
    if (!user) {
      return;
    }
  }, [user]);

  // 임시 로그인
  const tempSignIn = async () => {
    if (user !== null) {
      return user;
    }

    const creds = Realm.Credentials.anonymous();
    const newUser = await app.logIn(creds);
    setUser(newUser);

    return newUser;
  };

  // 로그인
  const signIn = async (email, password) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds); // 자격 증명 완료
    setUser(newUser);

    return newUser;
  };

  // 회원가입
  const signUp = async (email, password, nickname) => {
    await app.emailPasswordAuth.registerUser({email, password});
    const creds = Realm.Credentials.emailPassword(email, password);

    if (user !== null && user.providerType === 'anon-userpass') {
      // 임시 유저 -> 새 유저
      // user id 이미 알고 있음
      await Promise.all([
        // ** 혹시 이 함수가 유저 정보 리턴 안 하는지 잘 살펴보기
        user.linkCredentials(creds),
        // 부가 유저 정보는 서버쪽에 생성한 함수 호출하도록 수정
        user.callFunction('user/createUserInfo', {
          id: user.id,
          email,
          nickname,
        }),
      ]);
    } else {
      // 가능성은 거의 없겠지만, 혹시 몰라 추가
      const newUser = await app.logIn(creds);
      await newUser.callFunction('user/createUserInfo', {
        id: newUser.id,
        email,
        nickname,
      });
    }

    setUser(app.currentUser);
    return user;
  };

  // 로그아웃
  const signOut = async () => {
    if (user == null) {
      console.log("not logged in, can't log out. ");
      return;
    }
    user.logOut();
    setUser(null);
  };

  // 탈퇴
  const deleteUser = async userToBeDeleted => {
    if (userToBeDeleted === null) {
      return;
    }

    await app.deleteUser(userToBeDeleted);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        tempSignIn,
        signUp,
        signIn,
        signOut,
        deleteUser,
        user,
      }}>
      {children}
    </AuthContext.Provider>
  );
};

const useAuth = () => {
  const auth = useContext(AuthContext);
  if (auth == null) {
    throw new Error('useAuth() called outside of a AuthProvider. ');
  }
  return auth;
};

export {AuthProvider, useAuth};
