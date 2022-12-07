// CATEGORY
export const initCategory = item => {
  return {
    type: 'INIT_CATEGORY',
    payload: item,
  };
};

export const addCategory = item => {
  return {
    type: 'ADD_CATEGORY',
    payload: item,
  };
};

export const deleteCategory = items => {
  return {
    type: 'DELETE_CATEGORY',
    payload: items,
  };
};

export const selectCategory = item => {
  return {
    type: 'SELECT_CATEGORY',
    payload: item,
  };
};

// MISSION
export const initMission = item => {
  return {
    type: 'INIT_MISSION',
    payload: item,
  };
};

export const addMission = item => {
  return {
    type: 'ADD_MISSION',
    payload: item,
  };
};

export const deleteMission = items => {
  return {
    type: 'DELETE_MISSION',
    payload: items,
  };
};

export const updateMission = items => {
  return {
    type: 'UPDATE_MISSION',
    payload: items,
  };
};

export const selectMission = item => {
  return {
    type: 'SELECT_MISSION',
    payload: item,
  };
};

// TODAY MISSION
export const initTodayMission = item => {
  return {
    type: 'INIT_TODAY_MISSION',
    payload: item,
  };
};

export const addTodayMission = item => {
  return {
    type: 'ADD_TODAY_MISSION',
    payload: item,
  };
};

export const deleteTodayMission = items => {
  return {
    type: 'DELETE_TODAY_MISSION',
    payload: items,
  };
};

export const updateTodayMission = items => {
  return {
    type: 'UPDATE_TODAY_MISSION',
    payload: items,
  };
};

export const selectTodayMission = item => {
  return {
    type: 'SELECT_TODAY_MISSION',
    payload: item,
  };
};

//친구
export const initFriend = item => {
  return {
    type: 'INIT_FRIEND',
    payload: item,
  };
};

export const addFriend = item => {
  return {
    type: 'ADD_FRIEND',
    payload: item,
  };
};

export const deleteFriend = items => {
  return {
    type: 'DELETE_FRIEND',
    payload: items,
  };
};

export const selectFriend = item => {
  return {
    type: 'SELECT_FRIEND',
    payload: item,
  };
};

// 장소
export const initPlace = item => {
  return {
    type: 'INIT_PLACE',
    payload: item,
  };
};

export const addPlace = item => {
  return {
    type: 'ADD_PLACE',
    payload: item,
  };
};

export const deletePlace = items => {
  return {
    type: 'DELETE_PLACE',
    payload: items,
  };
};

export const selectPlace = item => {
  return {
    type: 'SELECT_PLACE',
    payload: item,
  };
};

export const addApps = items => {
  return {
    type: 'ADD_APPS',
    payload: items,
  };
};

export const addBlockedApps = items => {
  return {
    type: 'ADD_BLOCKED_APPS',
    payload: items,
  };
};

export const updateComment = items => {
  return {
    type: 'UPDATE_COMMENT',
    payload: items,
  };
};
