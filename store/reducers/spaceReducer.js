// 장소
const INITIAL_STATE = {
  data: [
    {id: '학교', lat: 37.503637, lng: 126.956025, name: '학교'},
    {
      id: '도서관',
      lat: 37.5047,
      lng: 126.958043,
      name: '도서관',
    },
    {
      id: '집',
      lat: 37.509172,
      lng: 126.962362,
      name: '집',
    },
  ],
};

const spaceReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'ADD_SPACE':
      return {...state, data: [...state.data, action.payload]};
    case 'DELETE_SPACE':
      return {...state, data: action.payload};
    case 'SELECT_SPACE':
      return {...state, filter: action.payload};
    default:
      return state;
  }
};

export default spaceReducer;
