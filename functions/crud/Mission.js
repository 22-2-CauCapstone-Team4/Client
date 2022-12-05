/* eslint-disable curly */
import {Mission, TodayMission} from '../../schema';
import moment from 'moment';

// db 저장용 객체 생성
const mkMissionObjToRealmObj = ({
  user,
  missionName,
  selectCategory,
  startTime,
  endTime,
  lockingType,
  dayOfWeek,
  space,
  spaceIn,
  moveSpace,
}) => {
  // date 설정
  const date = new Date(startTime);
  date.setHours(0, 0, 0, 0);

  // 반복
  let isRepeated = false,
    dayOfWeekBitmask = 0;
  if (Array.isArray(dayOfWeek) && dayOfWeek.length !== 0) {
    // 빈 배열 아닌 경우, 반복 true
    isRepeated = true;

    dayOfWeek.forEach(dayInt => {
      dayOfWeekBitmask = dayOfWeekBitmask | (1 << dayInt);
    });

    console.log('요일 정보 존재, bitmask =', dayOfWeekBitmask);
  }

  const tempObj = {
    owner_id: user.id,
    name: missionName,
    goal: selectCategory,
    type: !lockingType
      ? Mission.TYPE.TIME
      : spaceIn && !moveSpace
      ? Mission.TYPE.IN_PLACE
      : !spaceIn && moveSpace
      ? Mission.TYPE.MOVE_PLACE
      : Mission.TYPE.BOTH_PLACE,
    isRepeated,
    state: 'none',
  };

  if (startTime)
    tempObj.startTime = startTime.getHours() * 60 + startTime.getMinutes();
  if (endTime) tempObj.endTime = endTime.getHours() * 60 + endTime.getMinutes();
  if (isRepeated) tempObj.dayOfTheWeek = dayOfWeekBitmask;
  else tempObj.date = date;
  if (tempObj.type !== Mission.TYPE.TIME) tempObj.place = space;

  const mission = new Mission(tempObj);

  return mission;
};

const mkTodayMissionRealmObjToObj = todayMission => {
  const mission = mkMissionRealmObjToObj(todayMission.mission);
  delete todayMission.mission;
  // console.log({...todayMission, ...mission});
  return {...todayMission, ...mission};
};

const isTodayMission = mission => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    (!mission.isRepeated &&
      mission.date &&
      moment(today).isSame(mission.date)) ||
    (mission.isRepeated &&
      mission.dayOfTheWeek &&
      mission.dayOfTheWeek & (1 << today.getDay()))
  );
};

const mkMissionRealmObjToObj = mission => {
  let dayOfWeekArr = [];
  for (let i = 0; i < 7; i++) {
    if (mission.dayOfTheWeek & (1 << i)) {
      dayOfWeekArr.push(i);
    }
  }

  // 반복 요일 정보 문자열 설정
  const dayOfWeekStr =
    dayOfWeekArr.length === 7
      ? '매일 반복'
      : dayOfWeekArr.length === 5 &&
        !dayOfWeekArr.includes(0) &&
        !dayOfWeekArr.includes(6)
      ? '주중 반복'
      : dayOfWeekArr.length === 2 &&
        dayOfWeekArr.includes(0) &&
        dayOfWeekArr.includes(6)
      ? '주말 반복'
      : `매주 ${['일', '월', '화', '수', '목', '금', '토']
          .filter((ele, ind) => dayOfWeekArr.includes(ind))
          .join(', ')} 반복`;

  const tempObj = {
    id: mission._id, // 미션 id
    category: mission.goal.name, // 카테고리 이름
    name: mission.name, // 미션 이름
    type: mission.type, // false: 시간 잠금, true: 공간 잠금
    time: {
      // 시작시간, 종료시간
      startTime: `${parseInt(mission.startTime / 60)}:${
        mission.startTime % 60
      }`,
      endTime: `${parseInt(mission.endTime / 60)}:${mission.endTime % 60}`,
    },
    dayOfWeek: dayOfWeekArr, // ＠ 요일 데이터,
    isActive: mission.isActive,
  };

  if (mission.place) tempObj.space = mission.place.name;
  if (mission.isRepeated) {
    tempObj.dayOfWeek = dayOfWeekArr;
    tempObj.date = dayOfWeekStr;
  } else {
    const date = new Date(mission.date);
    tempObj.date = `${date.getFullYear()}-${
      date.getMonth() + 1 < 10
        ? '0' + (date.getMonth() + 1).toString()
        : date.getMonth() + 1
    }-${
      date.getDate() + 1 < 10
        ? '0' + (date.getDate() + 1).toString()
        : date.getDate() + 1
    }`; // 년, 월, 일
  }

  return tempObj;
};

const mkTodayMissions = async (user, realm) => {
  console.log('mk today missions');
  let result = null;

  try {
    // 0. 그전에 기록한 오늘의 미션 전부 삭제
    realm.write(() => {
      realm.delete(realm.objects('TodayMission'));
    });

    // 1. 모든 미션 읽어오기
    const allMissions = realm.objects('Mission');

    // 2. 오늘의 미션만 가져오기
    const todayMissions = allMissions.filter(mission =>
      isTodayMission(mission),
    );
    // console.log(todayMissions);

    // 저장
    result = [];
    realm.write(() => {
      todayMissions.forEach(mission => {
        const temp = new TodayMission({
          owner_id: user.id,
          state: TodayMission.STATE.NONE,
          mission,
        });
        // console.log(temp);

        realm.create('TodayMission', temp);
        result.push(temp);
      });
    });
  } catch (err) {
    console.log(err);

    if (realm !== null) {
      realm.close();
    }
  }

  console.log('오늘의 미션 생성 결과', result);
  return result;
};

const readTodayMissions = async (user, realm) => {
  console.log('read my today missions');
  let result = null;

  try {
    const list = realm.objects('TodayMission');

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

const readMissions = async (user, realm) => {
  console.log('read my missions');
  let result = null;

  try {
    const list = realm.objects('Mission').filtered(`owner_id == "${user.id}"`);

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

const getTodayMission = async (user, realm, missionId) => {
  console.log('read a specific today mission');
  let result = null;

  try {
    result = realm
      .objects('TodayMission')
      .filtered(`mission._id == oid(${missionId})`);

    // console.log(result);
    result = JSON.parse(JSON.stringify(result[0]));
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const createMission = async (user, realm, mission) => {
  console.log('create mission');
  let result = null;

  try {
    console.log('목표, 장소 객체 읽어오기');
    let goal,
      place = false;

    goal = realm.objects('Goal').filtered(`_id == oid(${mission.goal._id})`);
    goal = goal[0];

    // console.log(mission.type);
    if (mission.type !== Mission.TYPE.TIME) {
      place = realm
        .objects('Place')
        .filtered(`_id == oid(${mission.place._id})`);
      place = place[0];
    }

    if (mission.type !== Mission.TYPE.TIME) mission.place = place;
    const missionObj = {
      ...mission,
      goal,
    };

    console.log('쓰기 시작');
    realm.write(() => {
      const newMission = realm.create('Mission', missionObj);
      if (isTodayMission(newMission)) {
        // 오늘의 미션인 경우, TodayMission에도 추가 필요
        // 렐름 obj로 넣어주지 않으면, 새로 생성하는 것으로 취급하게 되는듯 -> id 중복 오류 뜨게 됨
        realm.create(
          'TodayMission',
          new TodayMission({
            owner_id: user.id,
            state: TodayMission.STATE.NONE,
            mission: newMission,
          }),
        );
      }
      result = JSON.parse(JSON.stringify(newMission));
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

const toggleMissionActive = async (user, realm, missionId) => {
  console.log('update mission');
  let result = null;

  try {
    console.log('쓰기 시작');
    realm.write(() => {
      const newMission = realm
        .objects('Mission')
        .filtered(`_id == oid(${missionId})`)[0];

      newMission.isActive = !newMission.isActive;

      if (isTodayMission(newMission)) {
        const newTodayMission = realm
          .objects('TodayMission')
          .filtered(`mission._id == oid(${missionId})`)[0];

        newTodayMission.mission = newMission;
      }

      result = JSON.parse(JSON.stringify(newMission));
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

const deleteMission = async (user, realm, missionId) => {
  console.log('delete mission');

  try {
    const deletedMission = realm
      .objects('Mission')
      .filtered(`_id == oid(${missionId})`)[0];

    console.log('읽기 결과', JSON.parse(JSON.stringify(deletedMission)));

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
      if (isTodayMission(deletedMission)) {
        console.log('오늘 미션 함께 삭제');
        const todayMission = realm
          .objects('TodayMission')
          .filtered(`mission._id == oid(${missionId})`)[0];
        realm.delete(todayMission);
      }

      realm.delete(deletedMission);
    });

    console.log('삭제 완료');
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {
  readMissions,
  createMission,
  toggleMissionActive,
  deleteMission,
  mkMissionObjToRealmObj,
  mkMissionRealmObjToObj,
  mkTodayMissionRealmObjToObj,
  mkTodayMissions,
  isTodayMission,
  getTodayMission,
  readTodayMissions,
};
