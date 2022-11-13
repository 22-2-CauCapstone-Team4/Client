import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';
import friendReducer from './friendReducer';

const rootReducer = combineReducers({
  missionReducer,
  categoryReducer,
  friendReducer,
});

export default rootReducer;
