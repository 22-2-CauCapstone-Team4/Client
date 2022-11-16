/* eslint-disable curly */
import Realm from 'realm';
import {ProhibitedApp} from '../../schema';
import {mkConfig} from '../mkConfig';

const readProhibitedApps = async user => {
  console.log('read my prohibited apps');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [ProhibitedApp.schema]));

    const list = realm
      .objects('ProhibitedApp')
      .filtered(`owner_id == "${user.id}"`);

    result = list.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
    console.log(
      '읽기 결과',
      result.map(app => app.packageName),
    );

    console.log('닫기');
    realm.close();
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const updateProhibitedApps = async (user, newList) => {
  console.log('update my prohibited apps');
  let result = null,
    realm = null;

  try {
    // 렐름 컨피그 설정
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [ProhibitedApp.schema]));

    const list = realm
      .objects('ProhibitedApp')
      .filtered(`owner_id == "${user.id}"`);

    // await realm.subscriptions.update(mutableSubs => {
    //   mutableSubs.add(list, {
    //     name: 'myProhibitedApp',
    //   });
    // });

    console.log(
      '읽기 결과',
      list.map(app => app.packageName),
    );
    const oldPackageNameList = list.map(app => app.packageName),
      newPackageNameList = newList.map(app => app.packageName);

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      list.forEach(app => {
        if (!newPackageNameList.includes(app.packageName)) {
          console.log(app.packageName, newPackageNameList);
          console.log('삭제', app.packageName);
          realm.delete(app);
        }
      });

      // 기존에 없던 값 새로 저장
      newList.forEach(app => {
        if (!oldPackageNameList.includes(app.packageName)) {
          const temp = realm.create(
            'ProhibitedApp',
            new ProhibitedApp({owner_id: user.id, ...app}),
          );
          console.log('추가', temp.packageName);
        }
      });
    });

    result = list.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
    console.log(
      '업데이트 결과',
      result.map(app => app.packageName),
    );

    console.log('닫기');
    realm.close();
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

export {readProhibitedApps, updateProhibitedApps};
