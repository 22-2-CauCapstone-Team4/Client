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
      console.log('????????????????', el.startTime, el.endTime);
      const startTime = `${
        el.startTime.getHours() < 10
          ? '0' + el.startTime.getHours()
          : el.startTime.getHours()
      }:${
        el.startTime.getMinutes() < 10
          ? '0' + el.startTime.getMinutes()
          : el.startTime.getMinutes()
      }`;

      let endTimeStr = moment(el.startTime).add(el.endTime, 's');
      endTimeStr = `${
        endTimeStr.hours() < 10 ? '0' + endTimeStr.hours() : endTimeStr.hours()
      }:${
        endTimeStr.minutes() < 10
          ? '0' + endTimeStr.minutes()
          : endTimeStr.minutes()
      }`;

      console.log('????????????????', startTime, el.endTime);
      const mission = mkMissionRealmObjToObj(el.mission);
      const prohibitedAppUsages = JSON.parse(
        JSON.stringify(el.prohibitedAppUsages),
      );
      console.log(prohibitedAppUsages);

      return {
        ...JSON.parse(JSON.stringify(el)),
        startTime,
        endTimeStr,
        mission,
        prohibitedAppUsages,
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
