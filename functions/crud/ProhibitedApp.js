/* eslint-disable curly */
import Realm from 'realm';
import {ProhibitedApp} from '../../schema';

const readProhibitedApps = async user => {
  console.log('read my prohibited apps');
  let result = null,
    realm = null;

  try {
    // 렐름 컨피그 설정
    const openRealmBehaviorConfig = {
      type: 'openImmediately',
    };
    const config = {
      schema: [ProhibitedApp.schema],
      sync: {
        user,
        flexible: true,
        // newRealmFileBehavior: openRealmBehaviorConfig,
        existingRealmFileBehavior: openRealmBehaviorConfig,
      },
    };

    console.log('렐름 열기');
    realm = await Realm.open(config);

    const list = realm
      .objects('ProhibitedApp')
      .filtered(`owner_id == "${user.id}"`);

    console.log('읽기 결과', list);

    console.log('닫기');
    realm.close();

    result = list;
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
    const openRealmBehaviorConfig = {
      type: 'openImmediately',
    };
    const config = {
      schema: [ProhibitedApp.schema],
      sync: {
        user,
        flexible: true,
        newRealmFileBehavior: openRealmBehaviorConfig,
        existingRealmFileBehavior: openRealmBehaviorConfig,
      },
    };

    console.log('렐름 열기');
    realm = await Realm.open(config);

    const list = realm
      .objects('ProhibitedApp')
      .filtered(`owner_id == "${user.id}"`);

    await realm.subscriptions.update(mutableSubs => {
      mutableSubs.add(list, {
        name: 'myProhibitedApp',
      });
    });

    console.log('읽기 결과', list);
    const oldPackageNameList = list.map(app => app.packageName),
      newPackageNameList = newList.map(app => app.packageName);

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      list.forEach(app => {
        if (!newPackageNameList.includes(app.packageName)) {
          console.log(app.packageName, newPackageNameList);
          console.log('삭제', app);
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
          console.log('추가', temp);
        }
      });
    });

    console.log('닫기');
    realm.close();

    result = list;
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

export {readProhibitedApps, updateProhibitedApps};
