// 카테고리
const INITIAL_STATE = {
  data: [
    //   {_id: '김가현', nickname: '김가현', state: 'lock'},
    //   {_id: '안재훈', nickname: '안재훈', state: 'unlock'},
    //   {_id: '한신', nickname: '한신', state: 'quit'},
  ],
  candidate: [],
  // [{_id: '2', nickname: '복숭아', state: 'lock'}],
};

const friendReducer = (state = INITIAL_STATE, action) => {
  let temp;
  switch (action.type) {
    case 'INIT_FRIEND':
      temp = state;
      if (action.payload.data) {
        temp = {...temp, data: action.payload.data};
      }
      if (action.payload.candidate) {
        temp = {
          ...temp,
          candidate: action.payload.candidate,
        };
      }
      return temp;
    case 'ADD_FRIEND':
      // const newCandidates = state.candidate.filter(
      //   item => item._id !== action.payload._id,
      // );
      temp = state;
      if (action.payload.data) {
        temp = {...temp, data: [...state.data, action.payload.data]};
      }
      if (action.payload.candidate) {
        temp = {
          ...temp,
          candidate: [...state.candidate, action.payload.candidate],
        };
      }
      return temp;
    case 'DELETE_FRIEND':
      temp = state;
      if (action.payload.data) {
        temp = {...temp, data: action.payload.data};
      }
      if (action.payload.candidate) {
        temp = {
          ...temp,
          candidate: action.payload.candidate,
        };
      }
      return temp;
    case 'SELECT_FRIEND':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default friendReducer;
