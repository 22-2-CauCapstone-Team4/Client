// 장소
const INITIAL_STATE = {
  data: [
    {
      num: 1,
      id: '리액트', // 미션 이름
      category: '공부', // 카테고리
      name: '리액트', // 미션 이름
      type: 'time', // 시간 or 공간
      date: '2022-11-10',
      time: {startTime: '16:50', endTime: '22:00'}, // 시작시간, 종료시간
      space: {}, // 공간
      isGiveUp: true, // 포기 여부
      LockTime: {useTime: '1h 55m'}, // 잠금 시간
      useTimeLockApp: {useTime: '55m'}, // 잠금 앱 사용시간
      isFinished: true, // 미션 끝났는지 여부
      inputText: '',
    },
    {
      num: 2,
      id: '하체', // 미션 이름
      category: '운동', // 카테고리
      name: '하체', // 미션 이름
      type: 'time', // 시간 or 공간
      time: {startTime: '12:31', endTime: '14:00'}, // 시작시간, 종료시간
      date: '2022-11-10',
      space: {}, // 공간
      isGiveUp: false, // 포기 여부
      LockTime: {useTime: '2h 52m'},
      useTimeLockApp: {useTime: '1h 20m'},
      isFinished: true,
      inputText: '',
    },
    {
      num: 3,
      id: '인공지능', // 미션 이름
      category: '과제', // 카테고리
      name: '인공지능', // 미션 이름
      type: 'time', // 시간 or 공간
      date: '2022-11-25',
      time: {startTime: '07:30', endTime: '09:00'}, // 시작시간, 종료시간
      space: {}, // 공간
      isGiveUp: true, // 포기 여부
      LockTime: {useTime: '3h 31m'},
      useTimeLockApp: {useTime: '2h 21m'},
      isFinished: true,
      inputText: '',
    },
    {
      num: 4,
      id: '해리포터', // 미션 이름
      category: '독서', // 카테고리
      name: '해리포터', // 미션 이름
      type: 'time', // 시간 or 공간
      date: '2022-11-30',
      time: {startTime: '12:45', endTime: '14:20'}, // 시작시간, 종료시간
      space: {}, // 공간
      isGiveUp: false, // 포기 여부
      LockTime: {useTime: '20m'},
      useTimeLockApp: {useTime: '15m'},
      isFinished: true,
      inputText: '',
    },
    {
      num: 5,
      id: 'qwer1234', // 미션 이름
      category: '수업', // 카테고리
      name: '캡스톤', // 미션 이름
      type: 'time', // 시간 or 공간
      date: '2022-11-27',
      time: {startTime: '07:30', endTime: '09:00'}, // 시작시간, 종료시간
      space: {}, // 공간
      isGiveUp: false, // 포기 여부
      LockTime: {useTime: '3h 31m'},
      useTimeLockApp: {useTime: '2h 21m'},
      isFinished: true,
      inputText: '',
    },
  ],
};

const recordReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'UPDATE_COMMENT':
      const oldComment = state.data.filter(
        item => item.id != action.payload.id,
      );
      return {...state, data: [...oldComment, action.payload]};
    default:
      return state;
  }
};

export default recordReducer;
