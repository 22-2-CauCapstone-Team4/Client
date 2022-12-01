import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import todayMissionReducer from './todayMissionReducer';
import friendReducer from './friendReducer';
import placeReducer from './placeReducer';
import appReducer from './appReducer';
import blockedAppReducer from './blockedAppReducer';

const rootReducer = combineReducers({
  missionReducer,
  todayMissionReducer,
  categoryReducer,
  friendReducer,
  placeReducer,
  appReducer,
  blockedAppReducer,
});

export default rootReducer;
