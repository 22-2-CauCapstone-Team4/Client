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
