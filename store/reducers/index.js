import {combineReducers} from 'redux';
import categoryReducer from './categoryReducer';
import missionReducer from './missionReducer';

const rootReducer = combineReducers({missionReducer, categoryReducer});

export default rootReducer;
