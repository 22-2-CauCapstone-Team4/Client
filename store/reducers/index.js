import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import friendReducer from './friendReducer';
import spaceReducer from './spaceReducer';

const rootReducer = combineReducers({
  missionReducer,
  categoryReducer,
  friendReducer,
  spaceReducer,
});

export default rootReducer;
