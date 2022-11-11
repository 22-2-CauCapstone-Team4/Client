import {ObjectId} from 'bson';

class CurState {
  constructor({
    id = new ObjectId(),
    owner_id,
    isNowUsingProhibitedApp = false,
    appPackageName = '',
    startTime,
    endTime,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.isNowUsingProhibitedApp = isNowUsingProhibitedApp;
    this.appPackageName = appPackageName;
    if (startTime) this.startTime = startTime;
    if (endTime) this.endTime = endTime;
  }

  static schema = {
    name: 'CurState',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      isNowUsingProhibitedApp: {type: 'bool', default: false},
      appPackageName: {type: 'string', default: ''},
      startTime: {type: 'date?'},
      endTime: {type: 'date?'},
    },
    primaryKey: '_id',
  };
}

export {CurState};
