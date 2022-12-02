import {todayDate} from '../../functions/time';
const INITIAL_STATE = {
  todayMissionData: [],
};

const todayMissionReducer = (state = INITIAL_STATE, action) => {
  // console.log('반영된 데이터');
  // console.log(action.payload);
  switch (action.type) {
    case 'INIT_TODAY_MISSION':
      return {...state, todayMissionData: action.payload};
    case 'ADD_TODAY_MISSION':
      return {
        ...state,
        todayMissionData: [...state.todayMissionData, action.payload],
      };
    case 'DELETE_TODAY_MISSION':
      return {...state, todayMissionData: action.payload};
    case 'UPDATE_TODAY_MISSION':
      const oldMissionData = state.todayMissionData.filter(
        item => item.id != action.payload.id,
      );
      return {...state, todayMissionData: [...oldMissionData, action.payload]};
    case 'SELECT_TODAY_MISSION':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default todayMissionReducer;
