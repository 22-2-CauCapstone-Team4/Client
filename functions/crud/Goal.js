/* eslint-disable curly */

const readGoals = async (user, realm, getRealmObj = false) => {
  console.log('read my goals');
  let result = null;

  try {
    const list = realm.objects('Goal').filtered(`owner_id == "${user.id}"`);

    if (!getRealmObj)
      result = list.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
    else result = list;
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const createGoal = async (user, realm, goal) => {
  console.log('create goal');
  let result = null;

  try {
    console.log('쓰기 시작');

    realm.write(() => {
      const newGoal = realm.create('Goal', goal);
      result = JSON.parse(JSON.stringify(newGoal));
    });

    console.log('생성 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const updateGoal = async (user, realm, goal) => {
  console.log('update goal');
  let result = null;

  try {
    console.log('쓰기 시작');
    realm.write(() => {
      const oldGoal = realm
        .objects('Goal')
        .filtered(`owner_id == "${user.id}" && _id == oid(${goal._id})`);
      oldGoal.name = goal.name;
      result = JSON.parse(JSON.stringify(oldGoal));
    });

    console.log('업데이트 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const deleteGoal = async (user, realm, goal) => {
  console.log('delete goal');

  try {
    const deletedGoal = realm
      .objects('Goal')
      .filtered(`owner_id == "${user.id}" && _id == oid(${goal._id})`);

    console.log('읽기 결과', JSON.parse(JSON.stringify(deletedGoal)));

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      realm.delete(deletedGoal);
    });

    console.log('삭제 완료');
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {readGoals, createGoal, updateGoal, deleteGoal};
