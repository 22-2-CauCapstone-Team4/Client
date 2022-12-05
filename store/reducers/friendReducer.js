// 카테고리
const INITIAL_STATE = {
  data: [
    {_id: '김가현', nickname: '김가현', state: 'lock'},
    {_id: '안재훈', nickname: '안재훈', state: 'unlock'},
    {_id: '한신', nickname: '한신', state: 'quit'},
  ],
  candidate: [{_id: '2', nickname: '복숭아', state: 'lock'}],
};

const friendReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_FRIEND':
      const newCandidates = state.candidate.filter(
        item => item._id !== action.payload._id,
      );
      return {
        ...state,
        data: [...state.data, action.payload],
        candidate: newCandidates,
      };
    case 'DELETE_FRIEND':
      return {...state, data: action.payload};
    case 'SELECT_FRIEND':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default friendReducer;
