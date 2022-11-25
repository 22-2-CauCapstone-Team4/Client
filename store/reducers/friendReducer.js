// 카테고리
const INITIAL_STATE = {
  data: [
    {id: '김가현', name: '김가현', state: 'lock'},
    {id: '안재훈', name: '안재훈', state: 'unlock'},
    {id: '한신', name: '한신', state: 'quit'},
  ],
};

const friendReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_FRIEND':
      return {...state, data: [...state.data, action.payload]};
    case 'DELETE_FRIEND':
      return {...state, data: action.payload};
    case 'SELECT_FRIEND':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default friendReducer;
