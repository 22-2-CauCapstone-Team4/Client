import mkChartCode from '../../components/charts/ChartCode';
import {AppUsageRecord, PhoneUsageRecord} from '../../schema';

const mkStaticStr = async (user, realm) => {
  console.log('read statics');
  let temp = {};
  try {
    const appUsageRecord = realm.objects('AppUsageRecord');
    const phoneUsageRecord = realm.objects('PhoneUsageRecord');
    let missionRecords = realm.objects('MissionRecord');
    missionRecords = missionRecords.filter(el => el.endTime);

    // {
    //   nonProhibitedAppMins,
    //   prohibitedAppMins,
    //   ctx2_label,
    //   prohibitedAppClickCnts,
    //   breakTimeOrGiveUpCnt,
    //   ctx3_label,
    //   giveUpPer,
    //   ctx4_label,
    //   giveUpAppPer,
    //   ctx5_label,
    //   giveUpAppCllickCnt,
    //   ctx6_label,
    //   giveUpAppUsages
    // }
    // 그래프 1
    temp.prohibitedAppMins = [
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.MISSION) acc += curr.usageSec;
        return acc;
      }, 0),
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.GIVE_UP) acc += curr.usageSec;
        return acc;
      }, 0),
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.DEFAULT) acc += curr.usageSec;
        return acc;
      }, 0),
    ];
    temp.prohibitedAppMins = temp.prohibitedAppMins.map(el =>
      parseInt(el / 60),
    );
    temp.nonProhibitedAppMins = [
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.MISSION) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[0],
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.GIVE_UP) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[1],
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.DEFAULT) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[2],
    ];
    temp.nonProhibitedAppMins = temp.nonProhibitedAppMins.map(el =>
      parseInt(el / 60),
    );

    // 그래프 2, 3
    missionRecords.sort((a, b) => a.endTime < b.endTime);

    console.log(missionRecords);
    if (missionRecords.length === 0) {
      temp = {
        ...temp,
        ctx2_label: [],
        prohibitedAppClickCnts: [],
        breakTimeOrGiveUpCnt: [],
        ctx3_label: [],
        giveUpPer: [],
      };
    } else {
      // 그래프 2
      // 금지 앱 클릭이 포기/휴식으로 이어진 경우
      // 1. 마지막 시간 기준 7등분으로 나누기
      const std = missionRecords[missionRecords.length - 1].endTime;
      temp.ctx2_label = temp.ctx3_label = [
        0,
        parseInt(std * (1 / (7 * 60))),
        parseInt(std * (2 / (7 * 60))),
        parseInt(std * (3 / (7 * 60))),
        parseInt(std * (4 / (7 * 60))),
        parseInt(std * (5 / (7 * 60))),
        parseInt(std * (6 / (7 * 60))),
        parseInt(std / 60),
      ];

      // 2. 금지 앱 클릭 횟수 시간대별로 더해주기
      let indCnt = 1;
      let missionCnt = [0, 0, 0, 0, 0, 0, 0, 0];
      const prohibitedAppClickCnts = [0, 0, 0, 0, 0, 0, 0, 0];
      const breakTimeOrGiveUpCnt = [0, 0, 0, 0, 0, 0, 0, 0];
      const giveUpPer = [0, 0, 0, 0, 0, 0, 0, 0];
      missionRecords.forEach(element => {
        console.log('!');
        const endTime = parseInt(element.endTime / 60);

        // 개수 cnt
        // for (let i = 0; i < 8; i++) {
        //   if (endTime < temp.ctx2_label[i]) {
        //     missionCnt[i] += 1;
        //   }
        // }

        // console.log(element.prohibitedAppUsages);

        indCnt = 1;
        element.prohibitedAppUsages.forEach(el => {
          while (parseInt(el.startTime / 60) >= temp.ctx2_label[indCnt]) {
            // console.log(el.startTime, temp.ctx2_label[indCnt]);
            indCnt++;
          }

          prohibitedAppClickCnts[indCnt - 1] += 1;
        });

        indCnt = 1;
        // element.breakTimes.forEach(el => {
        //   if (el.startTime > temp.ctx2_label[indCnt]) {
        //     indCnt++;
        //   } else {
        //     temp.breakTimeOrGiveUpCnt[indCnt]++;
        //   }
        // });

        if (element.giveUpTime) {
          console.log('?');
          const giveUpTime = parseInt(element.giveUpTime / 60);
          let flag = false;

          for (let i = 0; i < 8; i++) {
            console.log(flag, giveUpTime, temp.ctx2_label[i]);
            if (flag) {
              if (endTime < temp.ctx2_label[i]) {
                break;
              } else {
                giveUpPer[i] += 1;
              }
            }

            if (giveUpTime < temp.ctx2_label[i]) {
              if (!flag) {
                console.log('??');
                breakTimeOrGiveUpCnt[i] += 1;
                giveUpPer[i] += 1;
                flag = true;
              }
            }
          }
        }

        // for (let i = 1; i < 8; i++) {
        //   giveUpPer[i] += giveUpPer[i - 1];
        // }
      });

      temp.breakTimeOrGiveUpCnt = breakTimeOrGiveUpCnt;
      temp.prohibitedAppClickCnts = prohibitedAppClickCnts;
      temp.giveUpPer = giveUpPer;
    }
    // console.log(temp.giveUpPer);
    // 그래프 4
    const missionRecordByGroupingApp = missionRecords.reduce((acc, curr) => {
      const giveUpApp = curr.giveUpApp ? curr.giveUpApp.name : null;
      if (!giveUpApp) return acc;

      if (acc[giveUpApp]) acc[giveUpApp].push(curr);
      else acc[giveUpApp] = [curr];

      return acc;
    }, {});

    temp.ctx4_label = Object.keys(missionRecordByGroupingApp);
    let length = temp.ctx4_label.length;

    let totalGiveUpAppNum = 0;
    temp.giveUpAppPer = [];
    for (let i = 0; i < length; i++) {
      const key = temp.ctx4_label[i];
      // console.log(key);
      // console.log(missionRecordByGroupingApp[key].length);
      temp.giveUpAppPer.push(missionRecordByGroupingApp[key].length);
      totalGiveUpAppNum += missionRecordByGroupingApp[key].length;
    }
    // console.log(totalGiveUpAppNum);
    // temp.giveUpAppPer = temp.giveUpAppPer.map(
    //   num => (num / totalGiveUpAppNum) * 100,
    // );

    // 그래프 5
    const appUsageGroupByApp = appUsageRecord.reduce((acc, curr) => {
      const {appName} = curr;
      if (acc[appName]) acc[appName].push(curr);
      else acc[appName] = [curr];
      return acc;
    }, {});
    temp.ctx5_label = temp.ctx6_label = Object.keys(appUsageGroupByApp);
    // console.log(
    //   appUsageGroupByApp['10x10'],
    //   temp.ctx5_label,
    //   temp.ctx6_label,
    // );
    temp.giveUpAppClickCnt = [];
    temp.giveUpAppUsages = [];

    length = temp.ctx5_label.length;
    for (let i = 0; i < length; i++) {
      const key = temp.ctx5_label[i];
      //   console.log(key);
      temp.giveUpAppClickCnt.push(
        appUsageGroupByApp[key].reduce((a, b) => a + b.clickCnt, 0),
      );
      temp.giveUpAppUsages.push(
        appUsageGroupByApp[key].reduce((a, b) => a + b.usageSec, 0),
      );
    }

    temp.giveUpAppUsages = temp.giveUpAppUsages.map(el => parseInt(el / 60));

    console.log('읽기 완료', temp);
  } catch (err) {
    console.log(err.message);
  }

  return mkChartCode(temp);
};

export {mkStaticStr};
