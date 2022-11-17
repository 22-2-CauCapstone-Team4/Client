import {ObjectId} from 'bson';

class AppUsageRecord {
  constructor({
    id = new ObjectId(),
    owner_id,
    appPackageName,
    appName,
    date,
    hour,
    usageSec,
    clickCnt,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.appPackageName = appPackageName;
    this.appName = appName;
    this.date = date;
    this.hour = hour;
    this.usageSec = usageSec;
    this.clickCnt = clickCnt;
  }

  static schema = {
    name: 'AppUsageRecord',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      appPackageName: {type: 'string', indexed: true},
      appName: {type: 'string'},
      date: {type: 'date', indexed: true},
      hour: 'int',
      usageSec: {type: 'int', default: 0},
      clickCnt: {type: 'int', default: 0},
    },
    primaryKey: '_id',
  };
}

export {AppUsageRecord};
