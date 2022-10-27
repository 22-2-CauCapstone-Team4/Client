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

  // 로그인
  const signIn = async (email, password) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds); // 자격 증명 완료
    setUser(newUser);
  };

  // 회원가입
  const signUp = async (email, password) => {
    await app.emailPasswordAuth.registerUser({email, password});
  };

  // 로그아웃
  const signOut = () => {
    if (user == null) {
      console.warn("not logged in, can't log out. ");
      return;
    }
    user.logOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        signUp,
        signIn,
        signOut,
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
