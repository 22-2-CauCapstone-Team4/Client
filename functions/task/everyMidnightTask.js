/* eslint-disable no-labels */

const everyMidnightTask = async taskData => {
  let realm = null;

  try {
    console.log('Midnignt event js에서 받음');
  } catch (err) {
    console.log(err.message());
    if (realm !== null) realm.close();
  }
};

export {everyMidnightTask};
