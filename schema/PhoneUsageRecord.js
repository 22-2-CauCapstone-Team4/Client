import {ObjectId} from 'bson';

class PhoneUsageRecord {
  constructor({
    id = new ObjectId(),
    owner_id,
    date,
    type = PhoneUsageRecord.TYPE.DEFAULT,
    usageSec,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.date = date;
    this.type = type;
    this.usageSec = usageSec;
  }

  static TYPE = {
    DEFAULT: 'DEFAULT',
    MISSION: 'MISSION',
    GIVE_UP: 'GIVE_UP',
  };

  static schema = {
    name: 'PhoneUsageRecord',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      date: 'date',
      type: {type: 'string?'},
      usageSec: 'int',
    },
    primaryKey: '_id',
  };
}

export {PhoneUsageRecord};
