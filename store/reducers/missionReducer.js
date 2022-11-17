import {todayDate} from '../../functions/time';
const INITIAL_STATE = {
  missionData: [
    {
      id: '플러터',
      category: '✏️ 공부',
      name: '플러터',
      date: todayDate,
      dayOfWeek: {},
      type: 'time',
      time: {startTime: '16:50', endTime: '22:00'},
      space: {},
      state: 'none',
    },
    {
      id: '캡스톤',
      category: '🏫 과제',
      name: '캡스톤',
      date: todayDate,
      dayOfWeek: {},
      type: 'time',
      time: {startTime: '10:00', endTime: '13:00'},
      space: {},
      state: 'none',
    },
    {
      id: '조깅',
      category: '💪 운동',
      name: '조깅',
      date: todayDate,
      dayOfWeek: {},
      type: 'space',
      time: {},
      space: {type: 'outside', place: '집'},
      state: 'none',
    },
    {
      id: '모바일 앱',
      category: '🏫 과제',
      name: '모바일 앱',
      date: '2022-11-17',
      dayOfWeek: {},
      type: 'time',
      time: {startTime: '18:30', endTime: '21:00'},
      space: {},
      state: 'none',
    },
    {
      id: '리액트',
      category: '✏️ 공부',
      name: '리액트',
      date: '2022-11-17',
      dayOfWeek: {},
      type: 'time',
      time: {startTime: '21:00', endTime: '23:00'},
      space: {},
      state: 'none',
    },
    {
      id: '인공지능',
      category: '🏫 과제',
      name: '인공지능',
      date: '2022-11-19',
      dayOfWeek: {},
      type: 'time',
      time: {startTime: '12:30', endTime: '14:00'},
      space: {},
      state: 'none',
    },
    {
      id: '헬스',
      category: '💪 운동',
      name: '헬스',
      date: '2022-11-17',
      dayOfWeek: {},
      type: 'space',
      time: {},
      space: {type: 'inside', place: '집'},
      state: 'none',
    },
  ],
};

const missionReducer = (state = INITIAL_STATE, action) => {
  // console.log('반영된 데이터');
  // console.log(action.payload);
  switch (action.type) {
    case 'ADD_MISSION':
      return {...state, missionData: [...state.missionData, action.payload]};
    case 'DELETE_MISSION':
      return {...state, missionData: action.payload};
    case 'SELECT_MISSION':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default missionReducer;
