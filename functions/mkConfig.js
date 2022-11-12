import {CurState, ProhibitedApp} from '../schema';

const openRealmBehaviorConfig = {
  type: 'openImmediately',
};

const mkConfig = (user, schema) => {
  console.log('config 생성');
  return {
    schema,
    sync: {
      user,
      newRealmFileBehavior: openRealmBehaviorConfig,
      existingRealmFileBehavior: openRealmBehaviorConfig,
    },
  };
};

const mkConfigWithSubscriptions = user => {
  console.log('config 생성');
  return {
    schema: [CurState.schema, ProhibitedApp.schema],
    sync: {
      user,
      flexible: true,
      newRealmFileBehavior: openRealmBehaviorConfig,
      existingRealmFileBehavior: openRealmBehaviorConfig,
      initialSubscriptions: {
        update: (subs, realm) => {
          // 스키마 추가할 때마다 여기 추가해주기
          subs.add(
            realm.objects('CurState').filtered(`owner_id == "${user.id}"`),
          );
          subs.add(
            realm.objects('ProhibitedApp').filtered(`owner_id == "${user.id}"`),
          );
        },
      },
    },
  };
};

export {mkConfig, mkConfigWithSubscriptions};