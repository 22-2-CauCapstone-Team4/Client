/* eslint-disable curly */
import {Mission} from '../../schema/Mission';

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

// time: {
//       // 시작시간, 종료시간
//       startTime: `${mission.startTime / 60}:${mission.startTime % 60}`,
//       endTime: `${mission.endTime / 60}:${mission.endTime % 60}`,
//     },

const mkMissionRealmObjToObj = mission => {
  const date = new Date(mission.date);

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
      startTime: `${mission.startTime / 60}:${mission.startTime % 60}`,
      endTime: `${mission.endTime / 60}:${mission.endTime % 60}`,
    },
    dayOfWeek: dayOfWeekArr, // ＠ 요일 데이터,
  };

  if (mission.place) tempObj.space = mission.place.name;
  if (mission.isRepeated) {
    tempObj.dayOfWeek = dayOfWeekArr;
    tempObj.date = dayOfWeekStr;
  } else {
    tempObj.date = `${date.getFullYear()}-${
      date.getMonth() + 1
    }-${date.getDate()}`; // 년, 월, 일
  }

  return tempObj;
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

const createMission = async (user, realm, mission) => {
  console.log('create mission');
  let result = null;

  try {
    console.log('목표, 장소 객체 읽어오기');
    let goal,
      place = false;

    goal = realm.objects('Goal').filtered(`_id == oid(${mission.goal._id})`);
    goal = goal[0];

    console.log(mission.type);
    if (mission.type !== Mission.TYPE.TIME) {
      place = realm
        .objects('Place')
        .filtered(`_id == oid(${mission.place._id})`);
      place = place[0];
    }

    console.log('쓰기 시작');

    realm.write(() => {
      if (mission.type !== Mission.TYPE.TIME) mission.place = place;
      const newMission = realm.create('Mission', {
        ...mission,
        goal,
      });
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

const updateMission = async (user, realm, mission) => {
  console.log('update mission');
  let result = null;

  try {
    console.log('쓰기 시작');
    realm.write(() => {
      let oldMission = realm
        .objects('Mission')
        .filtered(`_id == oid(${mission._id})`);
      oldMission = JSON.parse(JSON.stringify(oldMission));

      let newMission;
      realm.create(
        () => (newMission = new Mission({...oldMission, ...mission})),
      );
      realm.delete(oldMission);

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
  console.log('delete goal');

  try {
    const deletedMission = realm
      .objects('Mission')
      .filtered(`_id == oid(${missionId})`);

    console.log('읽기 결과', JSON.parse(JSON.stringify(deletedMission)));

    console.log('쓰기 시작');
    realm.write(() => {
      // 이번에 삭제된 값 삭제
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
  updateMission,
  deleteMission,
  mkMissionObjToRealmObj,
  mkMissionRealmObjToObj,
};
