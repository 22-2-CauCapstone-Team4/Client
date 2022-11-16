import {ObjectId} from 'bson';

class CurState {
  constructor({
    id = new ObjectId(),
    isNowUsingProhibitedApp,
    appPackageName,
    startTime,
    endTime,
  }) {
    this._id = id;
    this.isNowUsingProhibitedApp = isNowUsingProhibitedApp;
    this.appPackageName = appPackageName;
    this.startTime = startTime;
    this.endTime = endTime;
  }

  static schema = {
    name: 'CurState',
    properties: {
      _id: 'objectId',
      isNowUsingProhibitedApp: {type: 'bool', default: false},
      appPackageName: {type: 'string', default: ''},
      startTime: {type: 'date?'},
      endTime: {type: 'date?'},
    },
    primaryKey: '_id',
  };
}

export {CurState};
