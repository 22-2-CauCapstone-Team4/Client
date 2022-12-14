import {ObjectId} from 'bson';

class Mission {
  constructor({
    id = new ObjectId(),
    owner_id,
    date,
    dayOfTheWeek = 0,
    startTime,
    endTime,
    name,
    goal,
    isActive = true,
    isRepeated = dayOfTheWeek ? true : false,
    type,
    place,
  }) {
    this._id = id;
    this.owner_id = owner_id;
    this.date = date;
    this.dayOfTheWeek = dayOfTheWeek;
    this.startTime = startTime;
    this.endTime = endTime;
    this.name = name;
    this.goal = goal;
    this.isActive = isActive;
    this.isRepeated = isRepeated;
    this.type = type;
    if (place) this.place = place;
  }

  static TYPE = {
    TIME: 'TIME',
    IN_PLACE: 'IN_PLACE',
    MOVE_PLACE: 'MOVE_PLACE',
    BOTH_PLACE: 'BOTH_PLACE',
  };

  static schema = {
    name: 'Mission',
    properties: {
      _id: 'objectId',
      date: 'date?',
      dayOfTheWeek: {type: 'int?', default: 0},
      endTime: {type: 'int?'},
      goal: 'Goal?',
      isActive: {type: 'bool', default: true},
      isRepeated: {type: 'bool', default: false},
      type: 'string',
      name: 'string',
      owner_id: 'string',
      place: 'Place?',
      startTime: {type: 'int?'},
    },
    primaryKey: '_id',
  };
}

export {Mission};
