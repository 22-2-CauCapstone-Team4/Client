import {ObjectId} from 'bson';

class UserInfo {
  static schema = {
    name: 'UserInfo',
    properties: {
      _id: 'objectId',
      email: 'string',
      nickname: 'string',
      owner_id: 'string',
    },
    primaryKey: '_id',
  };
}

export {UserInfo};
