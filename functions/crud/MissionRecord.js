import {mkMissionRealmObjToObj} from './Mission';
import moment from 'moment';

const readMissionRecords = async (user, realm) => {
  console.log('read my mission records');
  let result = null;

  try {
    let list = realm.objects('MissionRecord').sorted('startTime', true);
    list = list.filter(el => el.endTime);
    // tempRecords = JSON.parse(JSON.stringify(tempRecords));
    list = list.map(el => {
      const startTime = `${
        el.startTime.getMinutes() < 10
          ? '0' + el.startTime.getMinutes()
          : el.startTime.getMinutes()
      }:${
        el.startTime.getSeconds() < 10
          ? '0' + el.startTime.getSeconds()
          : el.startTime.getSeconds()
      }`;

      let endTime = moment(el.startTime).add(el.endTime, 's');
      endTime = `${
        endTime.minutes() < 10 ? '0' + endTime.minutes() : endTime.minutes()
      }:${
        endTime.seconds() < 10 ? '0' + endTime.seconds() : endTime.seconds()
      }`;

      const mission = mkMissionRealmObjToObj(el.mission);

      return {
        ...JSON.parse(JSON.stringify(el)),
        startTime,
        endTime,
        mission,
        comment: el.comment ? el.comment : '',
      };
    });

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

const updateComment = async (user, realm, missionRecordObj) => {
  console.log("read my mission record's comment");
  let result = null;

  try {
    let missionRecord;
    realm.write(() => {
      missionRecord = realm
        .objects('MissionRecord')
        .filtered(`_id == oid(${missionRecordObj._id})`)[0];

      missionRecord.comment = missionRecordObj.comment;
    });

    const result = JSON.parse(JSON.stringify(missionRecord));

    console.log('업데이트 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

export {readMissionRecords, updateComment};
