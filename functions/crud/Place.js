/* eslint-disable curly */
import Realm from 'realm';
import {Place} from '../../schema';
import {mkConfig} from '../mkConfig';

const readPlaces = async user => {
  console.log('read my places');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Place.schema]));

    const list = realm.objects('Place').filtered(`owner_id == "${user.id}"`);

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

const createPlace = async (user, place) => {
  console.log('create place');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Place.schema]));

    console.log('쓰기 시작', place);
    realm.write(() => {
      const newPlace = realm.create('Place', place);
      result = JSON.parse(JSON.stringify(newPlace));
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

const updatePlace = async (user, place) => {
  console.log('update place');
  let result = null,
    realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Place.schema]));

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

const deletePlace = async (user, place) => {
  console.log('delete goal');
  let realm = null;

  try {
    console.log('렐름 열기');
    realm = await Realm.open(mkConfig(user, [Place.schema]));

    const deletedGoal = realm
      .objects('Place')
      .filtered(`owner_id == "${user.id}" && _id == oid(${place._id})`);

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

export {readPlaces, createPlace, updatePlace, deletePlace};
