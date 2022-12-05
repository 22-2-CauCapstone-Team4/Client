import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import todayMissionReducer from './todayMissionReducer';
import friendReducer from './friendReducer';
import placeReducer from './placeReducer';
import appReducer from './appReducer';
import blockedAppReducer from './blockedAppReducer';
import recordReducer from './recordReducer';
import userReducer from './userReducer';
const rootReducer = combineReducers({
  missionReducer,
  todayMissionReducer,
  categoryReducer,
  friendReducer,
  placeReducer,
  appReducer,
  blockedAppReducer,
  recordReducer,
  userReducer,
});

export default rootReducer;
