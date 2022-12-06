import {mkConfig, takeBreakTime} from '..';
import {CurState, Mission, Goal, Place, ProhibitedApp} from '../../schema';
import Realm from 'realm';

const btnClickTask = async (user, taskData) => {
  // 금지 앱 가리는 화면에서 버튼을 클릭한 경우
  console.log('BtnClick event js에서 받음');

  let realm = null;

  try {
    realm = await Realm.open(
      mkConfig(user, [
        CurState.schema,
        Mission.schema,
        Goal.schema,
        Place.schema,
        ProhibitedApp.schema,
      ]),
    );
    await takeBreakTime(realm);
    realm.close();
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }
};

export {btnClickTask};
