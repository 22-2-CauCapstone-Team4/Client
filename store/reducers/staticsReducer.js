const INITIAL_STATE = {
  data: '',
};

const staticsReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_STATICS':
      return {...state, data: action.payload};
    default:
      return state;
  }
};

export default staticsReducer;
