const INITIAL_STATE = {
  data: [],
};

const blockedAppReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_BLOCKED_APPS':
      return {...state, data: action.payload};
    default:
      return state;
  }
};

export default blockedAppReducer;
