import {todayDate} from '../../functions/time';
const INITIAL_STATE = {
  missionData: [],
};

const missionReducer = (state = INITIAL_STATE, action) => {
  // console.log('반영된 데이터');
  // console.log(action.payload);
  switch (action.type) {
    case 'INIT_MISSION':
      return {...state, missionData: action.payload};
    case 'ADD_MISSION':
      return {...state, missionData: [...state.missionData, action.payload]};
    case 'DELETE_MISSION':
      return {...state, missionData: action.payload};
    case 'UPDATE_MISSION':
      const oldMissionData = state.missionData.filter(
        item => item.id != action.payload.id,
      );
      return {...state, missionData: [...oldMissionData, action.payload]};
    case 'SELECT_MISSION':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default missionReducer;
