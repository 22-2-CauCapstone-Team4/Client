import {ObjectId} from 'bson';

class MissionRecord {
  constructor({id = new ObjectId(), mission, owner_id, startTime}) {
    this._id = id;
    this.mission = mission;
    this.owner_id = owner_id;
    this.startTime = startTime;
  }

  static schema = {
    name: 'MissionRecord',
    properties: {
      _id: 'objectId',
      breakTimes: 'date[]',
      comment: 'string?',
      endTime: 'int?',
      giveUpApp: 'GiveUpAppEmbedded',
      giveUpTime: 'int?',
      heartIds: 'UserInfo[]',
      heartNum: {type: 'int', default: 0},
      mission: 'Mission',
      owner_id: 'string',
      prohibitedAppUsages: 'AppUsageEmbedded[]',
      startTime: 'date',
      totalProhibitedAppUsageSec: {type: 'int', default: 0},
    },
    primaryKey: '_id',
  };
}

class GiveUpAppEmbedded {
  constructor({name, icon}) {
    this.name = name;
    this.icon = icon;
  }

  static schema = {
    name: 'GiveUpAppEmbedded',
    embedded: true,
    properties: {
      icon: 'string',
      name: 'string',
    },
  };
}

class AppUsageEmbedded {
  constructor({name, startTime}) {
    this.name = name;
    this.startTime = startTime;
  }

  static schema = {
    name: 'AppUsageEmbedded',
    embedded: true,
    properties: {
      endTime: 'int?',
      name: 'string',
      startTime: 'int',
    },
  };
}

export {MissionRecord, GiveUpAppEmbedded, AppUsageEmbedded};
