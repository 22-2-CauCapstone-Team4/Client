import {ObjectId} from 'bson';

class CurState {
  constructor({
    id = new ObjectId(),
    owner_id,
    isNowUsingProhibitedApp = false,
    appPackageName = '',
    appName = '',
    startAppTime,
    endAppTime,
    startPhoneTime,
    endPhoneTime,
    isNowDoingMission,
    missionStartTime,
    isNowGivingUp,
    lastBreakTime,
    mission,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.isNowUsingProhibitedApp = isNowUsingProhibitedApp;
    this.appPackageName = appPackageName;
    this.appName = appName;
    if (startAppTime) this.startTime = startAppTime;
    if (endAppTime) this.endTime = endAppTime;
    if (startPhoneTime) this.startTime = startPhoneTime;
    if (endPhoneTime) this.endTime = endPhoneTime;
    if (isNowDoingMission) this.isNowDoingMission = isNowDoingMission;
    if (missionStartTime) this.missionStartTime = missionStartTime;
    if (isNowGivingUp) this.isNowGivingUp = isNowGivingUp;
    if (lastBreakTime) this.lastBreakTime = lastBreakTime;
    if (mission) this.mission = mission;
  }

  static schema = {
    name: 'CurState',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      isNowUsingProhibitedApp: {type: 'bool', default: false},
      appPackageName: {type: 'string', default: ''},
      appName: {type: 'string', default: ''},
      startAppTime: {type: 'date?'},
      endAppTime: {type: 'date?'},
      startPhoneTime: {type: 'date?'},
      endPhoneTime: {type: 'date?'},
      isNowDoingMission: {type: 'bool', default: false},
      missionStartTime: {type: 'date?'},
      isNowGivingUp: {type: 'bool', default: false},
      lastBreakTime: 'date?',
      mission: 'Mission?',
    },
    primaryKey: '_id',
  };
}

export {CurState};
