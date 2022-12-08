const INITIAL_STATE = {
  data: [
    {
      _id: '1',
      owner_id: '한신',
      mission: {
        category: '공부',
        name: '플러터',
        date: '2022-12-06',
      },
      startTime: '14:30',
      endTime: '17:00',
      //prohibitedAppCnts: [],
      prohibitedAppUsages: [{name: 'btd6', startTime: 12000, endTime: 12500}],
      totalProhibitedAppUsageSec: 1100,
      // breakTimes, giveUpTime은 int 형으로 해주었다.
      breakTimes: [53200, 55000],
      giveUpTime: 55500,
      giveUpApp: {name: 'btd6', icon: ''},
      comment: '',
      // heartNum: 60,
      // heartIds:['?'],
    },
    {
      _id: '2',
      owner_id: '한신',
      mission: {
        category: '공부',
        name: '리액트',
        date: '2022-12-07',
      },
      startTime: '13:50',
      endTime: '17:00',
      //prohibitedAppCnts: [],
      prohibitedAppUsages: [{name: 'btd6', startTime: 12000, endTime: 12500}],
      totalProhibitedAppUsageSec: 600,
      // breakTimes: [52200],
      giveUpTime: null,
      giveUpApp: {name: 'btd6', icon: ''},
      comment: '',
      // heartNum: 60,
      // heartIds:['?'],
    },
    {
      _id: '3',
      owner_id: '한신',
      mission: {
        category: '공부',
        name: '리눅스',
        date: '2022-12-05',
      },
      startTime: '18:50',
      endTime: '21:00',
      //prohibitedAppCnts: [],
      prohibitedAppUsages: [{name: 'btd6', startTime: 12000, endTime: 12500}],
      totalProhibitedAppUsageSec: 1800,
      breakTimes: [70800, 73000, 75000],
      giveUpTime: null,
      giveUpApp: {name: 'btd6', icon: ''},
      comment: '',
      // heartNum: 60,
      // heartIds:['?'],
    },
    {
      _id: '4',
      owner_id: '한신',
      mission: {
        category: '운동',
        name: '홈트',
        date: '2022-12-07',
      },
      startTime: '16:50',
      endTime: '22:00',
      //prohibitedAppCnts: [],
      prohibitedAppUsages: [{name: 'btd6', startTime: 12000, endTime: 12500}],
      totalProhibitedAppUsageSec: 1800,
      breakTimes: [65600, 70000, 74000],
      giveUpTime: 78000,
      giveUpApp: {name: 'btd6', icon: ''},
      comment: '',
      // heartNum: 60,
      // heartIds:['?'],
    },
    // {
    //   _id: '5',
    //   owner_id: '한신',
    //   mission: {
    //     category: '수업',
    //     name: '모바일',
    //     date: '2022-11-10',
    //   },
    //   startTime: '10:00',
    //   endTime: '11:00',
    //   //prohibitedAppCnts: [],
    //   prohibitedAppUsages: [{name: 'btd6', startTime: 12000, endTime: 12500}],
    //   totalProhibitedAppUsageSec: 400,
    //   breakTimes: [],
    //   giveUpTime: 39500,
    //   giveUpApp: {name: 'btd6', icon: ''},
    //   comment: '',
    //   // heartNum: 60,
    //   // heartIds:['?'],
    // },
  ],
};

const recordReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case 'INIT_RECORD':
      return {...state, data: action.payload};
    case 'UPDATE_COMMENT':
      const oldComment = state.data.filter(
        item => item._id != action.payload._id,
      );
      return {...state, data: [...oldComment, action.payload]};
    default:
      return state;
  }
};

export default recordReducer;
