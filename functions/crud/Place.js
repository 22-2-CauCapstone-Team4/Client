/* eslint-disable curly */

const readPlaces = async (user, realm) => {
  console.log('read my places');
  let result = null;

  try {
    const list = realm.objects('Place').filtered(`owner_id == "${user.id}"`);

    result = list.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const createPlace = async (user, realm, place) => {
  console.log('create place');
  let result = null;

  try {
    console.log('쓰기 시작', place);
    realm.write(() => {
      const newPlace = realm.create('Place', place);
      result = JSON.parse(JSON.stringify(newPlace));
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

const updatePlace = async (user, realm, place) => {
  console.log('update place');
  let result = null;

  try {
    console.log('쓰기 시작');
    realm.write(() => {
      const oldPlace = realm
        .objects('Place')
        .filtered(`owner_id == "${user.id}" && _id == oid(${place._id})`);
      oldPlace.name = place.name;
      oldPlace.lat = place.lat;
      oldPlace.lng = place.lng;
      result = JSON.parse(JSON.stringify(oldPlace));
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

const deletePlace = async (user, realm, place) => {
  console.log('delete goal');

  try {
    const deletedPlace = realm
      .objects('Place')
      .filtered(`owner_id == "${user.id}" && _id == oid(${place._id})`);

    console.log('읽기 결과', JSON.parse(JSON.stringify(deletedPlace)));

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      // 미션도 함께 삭제해야 함
      const deletedMissions = realm
        .objects('Mission')
        .filtered(`place._id == oid(${place._id})`);
      deletedMissions.forEach(ele => {
        const tempToday = realm
          .objects('TodayMission')
          .filtered(`mission._id == oid(${ele._id})`)[0];
        realm.delete(tempToday);
      });

      realm.delete(deletedPlace);
      realm.delete(deletedMissions);
    });

    console.log('삭제 완료');
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {readPlaces, createPlace, updatePlace, deletePlace};
