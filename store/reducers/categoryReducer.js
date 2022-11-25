// 카테고리
// ✏️공부
const INITIAL_STATE = {
  data: [],
  filter: '⭐ 전체 목표',
};

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_CATEGORY':
      return {...state, data: action.payload};
    case 'ADD_CATEGORY':
      return {...state, data: [...state.data, action.payload]};
    case 'DELETE_CATEGORY':
      return {...state, data: action.payload};
    case 'SELECT_CATEGORY':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default categoryReducer;
