import React, {useContext, useState, useEffect} from 'react';
import {AppRegistry} from 'react-native';
import Realm from 'realm';
import {CurState} from '../schema';
import {} from '../functions';
import {
  mkConfigWithSubscriptions,
  appCheckHeadlessTask,
  everyMidnightTask,
  acceptMissionTriggerTask,
} from '../functions';
import {app} from '../index';
import {ForegroundServiceModule} from '../wrap_module';
import {Goal} from '../schema/Goal';

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

    // 새 구독 추가
    console.log('렐름 열어 구독 추가');
    const realm = await Realm.open(mkConfigWithSubscriptions(newUser));
    realm.close();

    AppRegistry.registerHeadlessTask('CheckApp', () =>
      appCheckHeadlessTask.bind(null, newUser),
    );
    AppRegistry.registerHeadlessTask('Midnight', () =>
      everyMidnightTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('MissionTrigger', () =>
      acceptMissionTriggerTask.bind(null, user),
    );

    setUser(newUser);
    return newUser;
  };

  // 회원가입
  const signUp = async ({email, password, nickname}) => {
    // 트랜섹션 처리 안 함... 나중에 시간이 난다면 하는 게 좋을 듯 (가입 중간에 끊길 수 있으니 ㅠㅠ)
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

    // 렐름 열면서 유저 데이터 추가, 함수로 기본 목표 정보 받아오기
    console.log('렐름 열기');
    const [realm] = await Promise.all([
      Realm.open(mkConfigWithSubscriptions(newUser)),
      newUser.callFunction('user/createUserInfo', {
        owner_id: newUser.id,
        email,
        nickname,
      }),
    ]);

    // // 커스텀 데이터 동기화
    await newUser.refreshCustomData();

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
      // 기본 목표 추가
      const defalutName = ['💪 운동', '🏫 과제', '✏️ 공부'];
      defalutName.forEach(name =>
        realm.create('Goal', new Goal({owner_id: newUser.id, name: name})),
      );
    });

    console.log('닫기');
    realm.close();

    // remember to unregister the progress notifications
    // syncSession.removeProgressNotification((transferred, transferable) => {
    //   console.log(`There was ${transferable} total transferable bytes`);
    //   console.log(`${transferred} bytes were transferred`);
    // });

    AppRegistry.registerHeadlessTask('CheckApp', () =>
      appCheckHeadlessTask.bind(null, newUser),
    );
    AppRegistry.registerHeadlessTask('Midnight', () =>
      everyMidnightTask.bind(null, user),
    );
    AppRegistry.registerHeadlessTask('MissionTrigger', () =>
      acceptMissionTriggerTask.bind(null, user),
    );

    setUser(newUser);
    return newUser;
  };

  // 로그아웃
  const signOut = async () => {
    if (user == null) {
      console.log("not logged in, can't log out. ");
      return;
    }

    await ForegroundServiceModule.stopService();

    user.logOut();
    setUser(null);
  };

  // 탈퇴
  const deleteUser = async () => {
    if (user === null) {
      return;
    }

    // 다른 유저 데이터도 함께 삭제해야 함
    // 서비스 종료
    await Promise.all([
      app.deleteUser(user),
      ForegroundServiceModule.stopService(),
    ]);

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
