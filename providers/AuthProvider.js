import React, {useContext, useState, useEffect} from 'react';
import Realm from 'realm';
import {CurState} from '../schema';
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

    console.log('임시 유저 생성');
    const creds = Realm.Credentials.anonymous();
    const newUser = await app.logIn(creds);
    setUser(newUser);

    return newUser;
  };

  // 로그인
  const signIn = async ({email, password}) => {
    const creds = Realm.Credentials.emailPassword(email, password);
    const newUser = await app.logIn(creds); // 자격 증명 완료

    setUser(newUser);
    return newUser;
  };

  // 회원가입
  const signUp = async ({email, password, nickname}) => {
    // 유저 생성
    await app.emailPasswordAuth.registerUser({email, password});
    const creds = Realm.Credentials.emailPassword(email, password);

    if (user !== null && user.providerType === 'anon-user') {
      // 임시 유저 -> 새 유저
      // user id 이미 알고 있음
      console.log('임시 유저 삭제');
      await app.deleteUser(user);
    }

    // 가능성은 거의 없겠지만, 혹시 몰라 추가
    console.log('새 유저 로그인');
    const newUser = await app.logIn(creds);

    // 렐름 컨피그 설정
    const openRealmBehaviorConfig = {
      type: 'openImmediately',
    };
    const config = {
      schema: [CurState.schema],
      sync: {
        user: app.currentUser,
        flexible: true,
        newRealmFileBehavior: openRealmBehaviorConfig,
        // existingRealmFileBehavior: openRealmBehaviorConfig,
        initialSubscriptions: {
          update: (subs, realm) => {
            subs.add(realm.objects('CurState'));
          },
        },
      },
    };

    console.log('렐름 열기');
    // 렐름 열면서 유저 데이터 추가
    const [realm] = await Promise.all([
      Realm.open(config),
      newUser.callFunction('user/createUserInfo', {
        owner_id: newUser.id,
        email,
        nickname,
      }),
    ]);

    // const syncSession = realm.syncSession;
    // syncSession.addProgressNotification(
    //   'upload',
    //   'reportIndefinitely',
    //   (transferred, transferable) => {
    //     console.log(`${transferred} bytes has been transferred`);
    //     console.log(
    //       `There are ${transferable} total transferable bytes, including the ones that have already been transferred`,
    //     );
    //   },
    // );

    console.log('쓰기 시작');
    realm.write(() => {
      realm.create('CurState', new CurState({owner_id: newUser.id}));
    });

    // remember to unregister the progress notifications
    // syncSession.removeProgressNotification((transferred, transferable) => {
    //   console.log(`There was ${transferable} total transferable bytes`);
    //   console.log(`${transferred} bytes were transferred`);
    // });

    console.log('닫기');
    realm.close();

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
