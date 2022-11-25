import {ObjectId} from 'bson';

class Goal {
  constructor({
    id = new ObjectId(),
    missionCnt = 0,
    placeCnt = 0,
    name,
    nowDoingMissionCnt = 0,
    nowGivingUpCnt = 0,
    userCnt = 1,
    owner_id,
  }) {
    this._id = id;
    this.missionCnt = missionCnt;
    this.placeCnt = placeCnt;
    this.name = name;
    this.nowDoingMissionCnt = nowDoingMissionCnt;
    this.nowGivingUpCnt = nowGivingUpCnt;
    this.userCnt = userCnt;
    this.owner_id = owner_id;
  }

  static schema = {
    name: 'Goal',
    properties: {
      _id: 'objectId',
      missionCnt: {type: 'int', default: 0},
      placeCnt: {type: 'int', default: 0},
      name: 'string',
      nowDoingMissionCnt: {type: 'int', default: 0},
      nowGivingUpCnt: {type: 'int', default: 0},
      owner_id: 'string',
      userCnt: {type: 'int', default: 1},
    },
    primaryKey: '_id',
  };
}

export {Goal};
