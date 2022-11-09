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
    const tempUser = app.currentUser;
    const newUser = await signIn(email, password);

    // 부가 유저 정보는 서버쪽에 생성한 함수 호출하도록 수정
    const promise =
      tempUser !== null
        ? Promise.all([
            newUser.callFunction('user/createUserInfo', {
              id: newUser.id,
              email,
              nickname,
            }),
            deleteUser(tempUser),
          ])
        : Promise.all(
            newUser.callFunction('user/createUserInfo', {
              id: newUser.id,
              email,
              nickname,
            }),
          );

    await promise;
  };

  // 로그아웃
  const signOut = async () => {
    if (user == null) {
      console.warn("not logged in, can't log out. ");
      return;
    }
    user.logOut();
    setUser(null);
  };

  // 탈퇴
  const deleteUser = async userToBeDeleted => {
    if (userToBeDeleted === null || typeof userToBeDeleted === 'undefined') {
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
