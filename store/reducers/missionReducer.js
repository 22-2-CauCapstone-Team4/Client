// 미션
const INITIAL_STATE = {
  missionData: [
    {
      id: '플러터',
      category: '✏️공부',
      name: '플러터',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '캡스톤',
      category: '💻과제',
      name: '캡스톤',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '조깅',
      category: '💪운동',
      name: '조깅',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '모바일 앱',
      category: '🏫수업',
      name: '모바일 앱',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '리액트',
      category: '✏️공부',
      name: '리액트',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '인공지능',
      category: '💻과제',
      name: '인공지능',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
    {
      id: '헬스',
      category: '💪운동',
      name: '헬스',
      date: {},
      type: 'time',
      time: {},
      space: {},
      state: 'none',
    },
  ],
};

const missionReducer = (state = INITIAL_STATE, action) => {
  // console.log('반영된 데이터');
  // console.log(action.payload);
  switch (action.type) {
    case 'ADD_MISSION':
      return {...state, missionData: [...state.data, action.payload]};
    case 'DELETE_MISSION':
      return {...state, missionData: action.payload};
    case 'SELECT_MISSION':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default missionReducer;
