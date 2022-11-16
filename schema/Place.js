import {ObjectId} from 'bson';

class Place {
  constructor({id = new ObjectId(), owner_id, name, lat, lng}) {
    this._id = id;
    this.owner_id = owner_id;
    this.name = name;
    this.lat = lat;
    this.lng = lng;
  }

  static schema = {
    name: 'Place',
    properties: {
      _id: 'objectId',
      lat: 'float',
      lng: 'float',
      name: 'string',
      owner_id: 'string',
    },
    primaryKey: '_id',
  };
}

export {Place};
