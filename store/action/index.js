// CATEGORY
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

//MISSION
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

export const selectMission = item => {
  return {
    type: 'SELECT_MISSION',
    payload: item,
  };
};

//친구
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
export const addSpace = item => {
  return {
    type: 'ADD_SPACE',
    payload: item,
  };
};

export const deleteSpace = items => {
  return {
    type: 'DELETE_SPACE',
    payload: items,
  };
};

export const selectSpace = item => {
  return {
    type: 'SELECT_SPACE',
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
