const INITIAL_STATE = {
  data: [],
};

const appReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_APPS':
      return {...state, data: action.payload};
    default:
      return state;
  }
};

export default appReducer;
