import {ObjectId} from 'bson';

class PhoneUsageRecord {
  constructor({id = new ObjectId(), owner_id, date, usageSec}) {
    this._id = id;
    this.owner_id = owner_id;
    this.date = date;
    this.usageSec = usageSec;
  }

  static schema = {
    name: 'PhoneUsageRecord',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      date: 'date',
      usageSec: 'int',
    },
    primaryKey: '_id',
  };
}

export {PhoneUsageRecord};
