import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import friendReducer from './friendReducer';
import spaceReducer from './spaceReducer';
import appReducer from './appReducer';
import blockedAppReducer from './blockedAppReducer';

const rootReducer = combineReducers({
  missionReducer,
  categoryReducer,
  friendReducer,
  spaceReducer,
  appReducer,
  blockedAppReducer,
});

export default rootReducer;
