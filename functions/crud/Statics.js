import mkChartCode from '../../components/charts/ChartCode';
import {AppUsageRecord, PhoneUsageRecord} from '../../schema';

const mkStaticStr = async (user, realm) => {
  console.log('통계 결과 읽기 시작');
  let temp = {};
  try {
    const appUsageRecord = realm.objects('AppUsageRecord');
    const phoneUsageRecord = realm.objects('PhoneUsageRecord');
    const missionRecord = realm.objects('MissionRecord');

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

    // 그래프 2

    // 그래프 3

    // 그래프 4
    const missionRecordByGroupingApp = missionRecord.reduce((acc, curr) => {
      const giveUpApp = curr.giveUpApp ? curr.giveUpApp.name : null;
      if (!giveUpApp) return acc;

      if (acc[giveUpApp]) acc[giveUpApp].push(curr);
      else acc[giveUpApp] = [curr];
      return acc;
    }, {});

    temp.ctx4_label = Object.keys(missionRecordByGroupingApp);

    let totalGiveUpAppNum = 0;
    temp.giveUpAppPer = [];
    for (let i = 0; i < length; i++) {
      const key = temp.ctx4_label[i];
      // console.log(key);
      temp.giveUpAppPer.push(missionRecordByGroupingApp[key].length);
      totalGiveUpAppNum += temp.giveUpAppPer[temp.giveUpAppPer.length - 1];
    }
    temp.giveUpAppPer = temp.giveUpAppPer.map(
      num => (num / totalGiveUpAppNum) * 100,
    );

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

    const length = temp.ctx5_label.length;
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
