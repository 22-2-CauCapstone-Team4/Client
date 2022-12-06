import moment from 'moment';
import {TodayMission} from '../schema/TodayMission';
import {ForegroundServiceModule, MissionSetterModule} from '../wrap_module';

const takeBreakTime = async realm => {
  let success = false;

  try {
    console.log('쉬는 시간 버튼 클릭');

    realm.write(() => {
      const curState = realm.objects('CurState')[0];
      const mission = realm
        .objects('Mission')
        .filtered(`_id == oid(${curState.mission._id})`)[0];
      const prohibitedApps = JSON.parse(
        JSON.stringify(realm.objects('ProhibitedApp')),
      ).map(app => {
        return {name: app.name, packageName: app.packageName};
      });
      const now = new Date();

      let leftTime;
      if (curState.lastBreakTime === null) {
        leftTime = 0;
      } else {
        leftTime = parseInt(moment().diff(curState.lastBreakTime) / 1000);

        leftTime = 60 * 60 - leftTime;
        if (leftTime < 0) leftTime = 0;
      }

      console.log(
        '마지막 쉬는 시간',
        curState.lastBreakTime,
        ', 쉬는 시간 사용 가능까지 남은 시간',
        leftTime,
      );

      if (
        curState.isNowDoingMission &&
        !curState.isNowGivingUp &&
        leftTime === 0
      ) {
        // 현재 진행 중 미션이 있고 쉬는시간 사용 가능한 경우
        curState.lastBreakTime = now;

        // 시간 계산
        const breakEndTime = moment().add(10, 'm');

        // 쉬는 시간 알림 noti 주기
        ForegroundServiceModule.startService(prohibitedApps, {
          title: `[ ${mission.goal.name} - ${mission.name} ] 10분 휴식 중`,
          content: `${breakEndTime.hour()}:${breakEndTime.minute()}에 휴식이 종료됩니다. `,
        });

        // 10분 뒤 쉬는 시간 종료하도록 설정
        MissionSetterModule.setBreakTimeEndAlarm();

        console.log('쉬는 시간 시작');
        success = true;
      } else {
        console.log('쉬는 시간 시작 불가능');
      }
    });
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return success;
};

const giveUp = async realm => {
  let success = false;

  try {
    console.log('포기 버튼 클릭');

    realm.write(() => {
      const curState = realm.objects('CurState')[0];
      const missionRecord = realm
        .objects('MissionRecord')
        .filtered(`mission._id == oid(${curState.mission._id})`)[0];
      const todayMission = realm
        .objects('TodayMission')
        .filtered(`mission._id == oid(${curState.mission._id})`)[0];
      const prohibitedApps = JSON.parse(
        JSON.stringify(realm.objects('ProhibitedApp')),
      ).map(app => {
        return {name: app.name, packageName: app.packageName};
      });

      const now = new Date();
      // const canUsingBreakTime =
      //   moment(now).diff(curState.lastBreakTIme) / 1000 >= 60 * 60
      //     ? true
      //     : false;

      if (
        curState.isNowDoingMission &&
        !curState.isNowGivingUp
        // && !canUsingBreakTime
      ) {
        curState.isNowGivingUp = true;
        missionRecord.giveUpTime = parseInt(
          moment(now).diff(missionRecord.startTime) / 1000,
        );
        todayMission.state = TodayMission.STATE.QUIT;

        curState.isNowDoingMission = false;
        curState.isNowGivingUp = false;
        curState.lastBreakTime = null;
        curState.mission = null;

        // 다시 알림 주기
        ForegroundServiceModule.startService(prohibitedApps, {
          title: '감지 중',
          content: '금지 앱 사용을 감지 중입니다. ',
        });

        console.log('포기');
        success = true;
      } else {
        console.log('포기 불가능');
      }
    });
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return success;
};

export {takeBreakTime, giveUp};
