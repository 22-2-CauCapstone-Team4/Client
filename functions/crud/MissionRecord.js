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
      // console.log('????????????????', el.startTime, el.endTime);
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

      const date = `${el.startTime.getFullYear()}-${
        el.startTime.getMonth() + 1 < 10
          ? '0' + el.startTime.getMonth() + 1
          : el.startTime.getMonth() + 1
      }-${
        el.startTime.getDate() < 10
          ? '0' + el.startTime.getDate()
          : el.startTime.getDate()
      }`;

      // console.log('????????????????', startTime, el.endTime);
      const mission = mkMissionRealmObjToObj(el.mission);
      const prohibitedAppUsages = JSON.parse(
        JSON.stringify(el.prohibitedAppUsages),
      );
      // console.log(prohibitedAppUsages);

      return {
        ...JSON.parse(JSON.stringify(el)),
        date,
        startTime,
        endTimeStr,
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

const nowRecord = async (user, realm) => {
  console.log('read my now record');
  let result = null;

  try {
    let obj = realm.objects('MissionRecord').sorted('startTime', true);
    obj = obj.filter(el => !el.endTime)[0];
    // tempRecords = JSON.parse(JSON.stringify(tempRecords));
    // console.log(obj);
    // console.log('????????????????', el.startTime, el.endTime);
    const startTime = `${
      obj.startTime.getHours() < 10
        ? '0' + obj.startTime.getHours()
        : obj.startTime.getHours()
    }:${
      obj.startTime.getMinutes() < 10
        ? '0' + obj.startTime.getMinutes()
        : obj.startTime.getMinutes()
    }`;
    // console.log(startTime);
    let endTimeStr = moment(obj.startTime).add(obj.endTime, 's');
    endTimeStr = `${
      endTimeStr.hours() < 10 ? '0' + endTimeStr.hours() : endTimeStr.hours()
    }:${
      endTimeStr.minutes() < 10
        ? '0' + endTimeStr.minutes()
        : endTimeStr.minutes()
    }`;

    const date = `${obj.startTime.getFullYear()}-${
      obj.startTime.getMonth() + 1 < 10
        ? '0' + obj.startTime.getMonth() + 1
        : obj.startTime.getMonth() + 1
    }-${
      obj.startTime.getDate() < 10
        ? '0' + obj.startTime.getDate()
        : obj.startTime.getDate()
    }`;

    // const mission = mkMissionRealmObjToObj(obj.mission);
    // const prohibitedAppUsages = JSON.parse(
    //   JSON.stringify(obj.prohibitedAppUsages),
    // );
    // // console.log(prohibitedAppUsages);

    result = {
      ...JSON.parse(JSON.stringify(obj)),
      date,
      startTime,
      endTimeStr,
      // mission,
      // prohibitedAppUsages,
      // comment: obj.comment ? obj.comment : '',
    };

    // result = obj.map(realmObj => JSON.parse(JSON.stringify(realmObj)));
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

export {readMissionRecords, nowRecord, updateComment};
