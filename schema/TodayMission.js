import {ObjectId} from 'bson';

class TodayMission {
  constructor({id = new ObjectId(), owner_id, state, mission}) {
    this._id = id;
    this.owner_id = owner_id;
    this.state = state;
    this.mission = mission;
  }

  static STATE = {
    NONE: 'none',
    START: 'start',
    OVER: 'over',
    QUIT: 'quit',
  };

  static schema = {
    name: 'TodayMission',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      mission: 'Mission',
      state: 'string',
      extraState: 'string?',
    },
    primaryKey: '_id',
  };
}

export {TodayMission};
