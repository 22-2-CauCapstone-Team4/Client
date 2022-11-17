import {ObjectId} from 'bson';

class CurState {
  constructor({
    id = new ObjectId(),
    owner_id,
    isNowUsingProhibitedApp = false,
    appPackageName = '',
    startAppTime,
    endAppTime,
    startPhoneTime,
    endPhoneTime,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.isNowUsingProhibitedApp = isNowUsingProhibitedApp;
    this.appPackageName = appPackageName;
    if (startAppTime) this.startTime = startAppTime;
    if (endAppTime) this.endTime = endAppTime;
    if (startPhoneTime) this.startTime = startPhoneTime;
    if (endPhoneTime) this.endTime = endPhoneTime;
  }

  static schema = {
    name: 'CurState',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      isNowUsingProhibitedApp: {type: 'bool', default: false},
      appPackageName: {type: 'string', default: ''},
      startAppTime: {type: 'date?'},
      endAppTime: {type: 'date?'},
      startPhoneTime: {type: 'date?'},
      endPhoneTime: {type: 'date?'},
    },
    primaryKey: '_id',
  };
}

export {CurState};
