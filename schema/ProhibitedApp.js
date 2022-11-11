import {ObjectId} from 'bson';

class ProhibitedApp {
  constructor({id = new ObjectId(), owner_id, packageName, name = '', icon}) {
    this._id = id;
    this.owner_id = owner_id;
    this.packageName = packageName;
    this.name = name;
    this.icon = icon;
  }

  static schema = {
    name: 'ProhibitedApp',
    properties: {
      _id: 'objectId',
      owner_id: 'string',
      packageName: {type: 'string'},
      name: {type: 'string', default: ''},
      icon: {type: 'string'},
    },
    primaryKey: '_id',
  };
}

export {ProhibitedApp};
