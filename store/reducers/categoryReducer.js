// 카테고리
const INITIAL_STATE = {
  data: [
    {id: '✏️공부', name: '✏️공부'},
    {id: '💻과제', name: '💻과제'},
    {id: '💪운동', name: '💪운동'},
    {id: '🏫수업', name: '🏫수업'},
  ],
  filter: '⭐전체목표',
};

const categoryReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
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
