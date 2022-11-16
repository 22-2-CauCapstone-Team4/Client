// 장소
const INITIAL_STATE = {
  data: [],
};

const placeReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_PLACE':
      return {...state, data: action.payload};
    case 'ADD_PLACE':
      return {...state, data: [...state.data, action.payload]};
    case 'DELETE_PLACE':
      return {...state, data: action.payload};
    case 'SELECT_PLACE':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default placeReducer;
