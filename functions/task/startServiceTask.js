/* eslint-disable no-labels */
import {ForegroundServiceModule} from '../../wrap_module';

// ** TODO : 수정 필요 (prohibitedApp 값들을 로컬 렐름을 열어 확인하도록)
const startServiceTask = async taskData => {
  console.log('Boot event js에서 받음');

  await ForegroundServiceModule.startService(
    ['com.github.android', 'com.android.chrome'],
    null,
  );
};

export {startServiceTask};
