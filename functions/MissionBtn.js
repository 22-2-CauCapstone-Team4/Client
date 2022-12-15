import moment from 'moment';
import {GiveUpAppEmbedded} from '../schema/MissionRecord';
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
      const missionRecord = realm
        .objects('MissionRecord')
        .sorted('startTime', true);
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
        if (missionRecord.breakTimes) {
          missionRecord.breakTimes.push(
            parseInt(moment(now).diff(missionRecord.startTime) / 1000),
          );
        } else {
          missionRecord.breakTimes = [
            parseInt(moment(now).diff(missionRecord.startTime) / 1000),
          ];
        }

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

      // console.log(curState, curState.mission);

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

        if (
          curState.appName &&
          moment(curState.startAppTime).isAfter(missionRecord.startTime)
        ) {
          const icon = prohibitedApps.filter(
            el => el.name === curState.appName,
          )[0];
          console.log(icon);
          missionRecord.giveUpApp = new GiveUpAppEmbedded({
            name: curState.appName,
            icon,
          });
        }

        // console.log('?');
        todayMission.state = TodayMission.STATE.QUIT;

        curState.isNowDoingMission = false;
        curState.isNowGivingUp = false;
        curState.lastBreakTime = null;
        curState.mission = null;

        // console.log('?');
        // 다시 알림 주기
        ForegroundServiceModule.startService(prohibitedApps, {
          title: `[ ${todayMission.mission.goal.name} - ${todayMission.mission.name} ] 포기 중`,
          content:
            '미션 종료 조건 전까지 금지 앱 사용 내역을 기록하는 중입니다. ',
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
