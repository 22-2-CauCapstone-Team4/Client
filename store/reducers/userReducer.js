// 전체 유저 정보 상태관리 -> 친구 추가 구현에서 사용
// friendReducer와 연관있음
// 친구 추가 모달에서 닉네임 검색 -> userReducer에 있던 정보 중에 해당되는 닉네님 표시
// 그 유저를 친구 추가해두면 friendReducer에 추가됨
// DB 연동된다면 userReducer 삭제하고 DB에 요청해서 전체 유저 닉네임을 가져올 수 있도록 해야하나?
const INITIAL_STATE = {
  data: [
    {
      _id: '1',
      email: 'bob@bob.bob',
      nickname: '밥버거',
      curState: 'lock',
    },
    {
      _id: '2',
      email: 'apeach@cau.kr',
      nickname: '복숭아',
      curState: 'lock',
    },
    {
      _id: '3',
      email: 'smile@gmail.com',
      nickname: ':)',
      curState: 'lock',
    },
    {
      _id: '4',
      email: 'a@a.a',
      nickname: '클로버',
      curState: 'unlock',
    },
    {
      _id: '5',
      email: 'k@g.h',
      nickname: '김가현',
      curState: 'lock',
    },
    {
      _id: '6',
      email: 'a@j.h',
      nickname: '안재훈',
      curState: 'unlock',
    },
    {
      _id: '7',
      email: 's@i.n',
      nickname: '한신',
      curState: 'quit',
    },
  ],
};

const userReducer = (state = INITIAL_STATE, action) => {
  // console.log('반영된 데이터');
  // console.log(action.payload);
  switch (action.type) {
    default:
      return state;
  }
};

export default userReducer;
