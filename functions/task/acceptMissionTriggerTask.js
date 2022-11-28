/* eslint-disable no-labels */

const acceptMissionTriggerTask = async (user, taskData) => {
  let realm = null;

  try {
    console.log('MissionTrigger 이벤트', taskData);
  } catch (err) {
    console.log(err.message());
    if (realm !== null) realm.close();
  }
};

export {acceptMissionTriggerTask};
