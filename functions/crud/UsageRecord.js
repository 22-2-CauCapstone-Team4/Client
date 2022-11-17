import moment from 'moment';

const readUsage = async (user, realm, startDate, endDate) => {
  console.log('read my usage records');
  let result = null;

  try {
    const now = new Date();

    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let appUsageRecords = realm
        .objects('AppUsageRecord')
        .filtered(
          `date >= ${moment(startDate)
            .utc()
            .format('YYYY-MM-DD@HH:mm:ss')}:0 && date <= ${moment(endDate)
            .utc()
            .format('YYYY-MM-DD@HH:mm:ss')}:0`,
        ),
      phoneUsageRecords = realm
        .objects('PhoneUsageRecord')
        .filtered(
          `date >= ${moment(startDate)
            .utc()
            .format('YYYY-MM-DD@HH:mm:ss')}:0 && date <= ${moment(endDate)
            .utc()
            .format('YYYY-MM-DD@HH:mm:ss')}:0`,
        ),
      curState = realm.objects('CurState');
    curState = curState[0];

    appUsageRecords = appUsageRecords.map(realmObj =>
      JSON.parse(JSON.stringify(realmObj)),
    );
    phoneUsageRecords = phoneUsageRecords.map(realmObj =>
      JSON.parse(JSON.stringify(realmObj)),
    );

    let appUsageSec = 0,
      phoneUsageSec = 0;
    appUsageRecords.forEach(app => (appUsageSec += app.usageSec));
    phoneUsageRecords.forEach(phone => (phoneUsageSec += phone.usageSec));
    // console.log(
    //   '현재 시간 추가하기',
    //   now,
    //   '-',
    //   curState.startPhoneTime,
    //   parseInt(moment(now).diff(curState.startPhoneTime) / 1000),
    // );
    phoneUsageSec += parseInt(moment(now).diff(curState.startPhoneTime) / 1000);

    result = {total: phoneUsageSec, app: appUsageSec};
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const readAppSec = async (user, realm, startDate, endDate) => {
  console.log('read my app sec records');
  let result = null;

  try {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let appUsageRecords = realm
      .objects('AppUsageRecord')
      .filtered(
        `date >= ${moment(startDate)
          .utc()
          .format('YYYY-MM-DD@HH:mm:ss')}:0 && date <= ${moment(endDate)
          .utc()
          .format('YYYY-MM-DD@HH:mm:ss')}:0`,
      );

    appUsageRecords = appUsageRecords.map(realmObj =>
      JSON.parse(JSON.stringify(realmObj)),
    );

    // 1. 앱 이름으로 정렬
    appUsageRecords.sort((a, b) => a.appPackageName - b.appPackageName);
    result = [];

    // 2. 계산
    let privName = '';
    appUsageRecords.forEach(app => {
      if (app.appPackageName === privName) {
        // 이름 같으면 걍 더해주기
        result[result.length - 1].usageSec += app.usageSec;
      } else {
        result.push({
          appPackageName: app.appPackageName,
          usageSec: app.usageSec,
        });
      }
    });

    appUsageRecords.sort((a, b) => b.usageSec - a.usageSec);
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

const readAppCnt = async (user, realm, startDate, endDate) => {
  console.log('read my app click cnt records');
  let result = null;

  try {
    startDate.setHours(0, 0, 0, 0);
    endDate.setHours(0, 0, 0, 0);

    let appUsageRecords = realm
      .objects('AppUsageRecord')
      .filtered(
        `date >= ${moment(startDate)
          .utc()
          .format('YYYY-MM-DD@HH:mm:ss')}:0 && date <= ${moment(endDate)
          .utc()
          .format('YYYY-MM-DD@HH:mm:ss')}:0`,
      );

    appUsageRecords = appUsageRecords.map(realmObj =>
      JSON.parse(JSON.stringify(realmObj)),
    );

    // 1. 앱 이름으로 정렬
    appUsageRecords.sort((a, b) => a.appPackageName - b.appPackageName);
    result = [];

    // 2. 계산
    let privName = '';
    appUsageRecords.forEach(app => {
      if (app.appPackageName === privName) {
        // 이름 같으면 걍 더해주기
        result[result.length - 1].clickCnt += app.clickCnt;
      } else {
        result.push({
          appPackageName: app.appPackageName,
          clickCnt: app.clickCnt,
        });
      }
    });

    appUsageRecords.sort((a, b) => b.clickCnt - a.clickCnt);
    console.log('읽기 결과', result);
  } catch (err) {
    console.log(err.message);

    if (realm !== null) {
      realm.close();
    }
  }

  return result;
};

export {readUsage, readAppSec, readAppCnt};
