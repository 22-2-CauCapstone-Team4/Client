import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import friendReducer from './friendReducer';
import placeReducer from './placeReducer';
import appReducer from './appReducer';
import blockedAppReducer from './blockedAppReducer';
import recordReducer from './recordReducer';
const rootReducer = combineReducers({
  missionReducer,
  categoryReducer,
  friendReducer,
  placeReducer,
  appReducer,
  blockedAppReducer,
  recordReducer,
});

export default rootReducer;
