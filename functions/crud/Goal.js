/* eslint-disable curly */
import Realm from 'realm';
import {Goal} from '../../schema';
import {mkConfig} from '../mkConfig';

const readGoals = async user => {
  console.log('read my goals');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Goal.schema]));

    const list = realm.objects('Goal').filtered(`owner_id == "${user.id}"`);

    result = list.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
    console.log('읽기 결과', result);

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

const createGoal = async (user, name) => {
  console.log('create goal');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Goal.schema]));

    console.log('쓰기 시작');

    realm.write(() => {
      const newGoal = realm.create('Goal', new Goal({owner_id: user.id, name}));
      result = JSON.parse(JSON.stringify(newGoal));
    });

    console.log('업데이트 결과', result);

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

const updateGoal = async (user, goal) => {
  console.log('update goal');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Goal.schema]));

    console.log('쓰기 시작');
    realm.write(() => {
      const oldGoal = realm
        .objects('Goal')
        .filtered(`owner_id == "${user.id}" && _id == "${goal._id}"`);
      oldGoal.name = goal.name;
      result = JSON.parse(JSON.stringify(oldGoal));
    });

    console.log('생성 결과', result);

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

const deleteGoal = async (user, goal) => {
  console.log('delete goal');
  let realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Goal.schema]));

    const deletedGoal = realm
      .objects('Goal')
      .filtered(`owner_id == "${user.id}" && _id == "${goal._id}"`);

    console.log('읽기 결과', JSON.parse(JSON.stringify(deletedGoal)));

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      realm.delete(deletedGoal);
    });

    console.log('닫기');
    realm.close();
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {readGoals, createGoal, updateGoal, deleteGoal};
