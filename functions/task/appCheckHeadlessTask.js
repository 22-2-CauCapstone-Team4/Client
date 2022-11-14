/* eslint-disable no-labels */
// import {LockAppModule} from './wrap_module';

import Realm from 'realm';
import {AppUsageRecord, CurState} from '../../schema';
import moment from 'moment';
import {mkConfig} from '../mkConfig';

const appCheckHeadlessTask = async (user, taskData) => {
  // 지금 날짜, 시간
  let realm,
    isOpened = false;
  try {
    const now = new Date();

    console.log('CheckApp 이벤트', taskData);
    const {appPackageName, isProhibitedApp} = taskData;

    // Realm 열기
    realm = await Realm.open(
      mkConfig(user, [AppUsageRecord.schema, CurState.schema]),
    );
    isOpened = true;
    console.log('0. realm open');

    // 1. 현 상태 업데이트
    let curState,
      isPrevUsedProhibitedApp,
      prevAppPackageName,
      prevStartTime = null;
    realm.write(() => {
      // 상태 데이터 없으면 err
      curState = realm.objects('CurState');
      if (curState.length !== 1) {
        throw new Error(
          `1. curState 개수는 항상 1개여야 함, 현재 ${curState.length}개`,
        );
      }

      // 문제 없는 경우
      curState = curState[0];
      isPrevUsedProhibitedApp = curState.isNowUsingProhibitedApp;
      prevAppPackageName = curState.appPackageName;

      curState.isNowUsingProhibitedApp = isProhibitedApp;
      if (isProhibitedApp) {
        curState.appPackageName = appPackageName;
        if (curState.isNowUsingProhibitedApp) {
          // 이전 시작 시간을 따로 변수에 기록해두어야 함
          prevStartTime = curState.startTime;
        }
        curState.startTime = now;
      } else {
        curState.endTime = now;
      }
    });

    console.log(
      '1. CurState 업데이트 완료',
      // `app = ${appPackageName}, isProhibitedApp = ${isProhibitedApp}`,
      //   curState.startTime,
      //   curState.endTime,
    );

    // 2. 기록 업데이트 (금지 앱 사용 끝인 경우)
    // 날짜 및 현재 시간(0-23) 정보 추출
    const hour = now.getHours();
    const todayMidnight = new Date(now);
    todayMidnight.setHours(0, 0, 0, 0);

    realm.write(() => {
      // 1. 금지 앱 사용 시작 case
      if (isProhibitedApp) {
        // 기록 존재 확인
        let startRecord = realm
          .objects('AppUsageRecord')
          .filtered(
            `appPackageName == "${appPackageName}" && date == ${moment(
              todayMidnight,
            )
              .utc()
              .format('YYYY-MM-DD@HH:mm:ss')}:0 && hour == ${hour}`,
          );
        const startRecordObj = startRecord.map(realmObj =>
          JSON.parse(JSON.stringify(realmObj)),
        );
        // console.log(
        //   startRecordObj,
        //   startRecordObj.length,
        //   startRecordObj[0].date,
        //   moment(todayMidnight).isSame(startRecordObj[0].date),
        //   startRecordObj[0].hour,
        // );

        if (
          startRecordObj.length === 0 ||
          !moment(todayMidnight).isSame(startRecordObj[0].date) ||
          startRecordObj[0].hour !== hour
        ) {
          // 현 시간에 대한 기록 없는 경우, 생성
          realm.create(
            'AppUsageRecord',
            new AppUsageRecord({
              owner_id: user.id,
              appPackageName,
              date: todayMidnight,
              hour,
              clickCnt: 1,
            }),
          );

          console.log('2. AppUsageRecord 시작 기록 - 추가');
        } else if (startRecordObj.length === 1) {
          // 있는 경우
          startRecord = startRecord[0];
          startRecord.clickCnt++;

          console.log('2. AppUsageRecord 시작 기록 - 업데이트');
        } else {
          // 여러 개 있으면 err
          throw new Error(
            `2. 현재 앱 현재 시간에 대한 AppUsageRecord는 0개 또는 1개 존재해야 함, 현재 ${startRecord.length}개`,
          );
        }
      }

      // 2. 금지 앱 사용 종료 case
      if (
        !isProhibitedApp ||
        (isProhibitedApp && isPrevUsedProhibitedApp) // 연속해서 바로 금지 앱 사용하는 경우, 이전 금지 앱 사용은 끝난 것
      ) {
        // 이전 앱의 사용 종료인지에 따라 startTime으로 사용할 값 바뀜
        // 현재 앱이 금지 앱이 아닌지에 따라 앱 이름으로 사용할 값 바뀜
        const selectedStartTime = !isProhibitedApp
          ? curState.startTime
          : prevStartTime;

        const startDate = new Date(selectedStartTime);
        startDate.setHours(0, 0, 0, 0);

        const endDate = todayMidnight,
          startHour = selectedStartTime.getHours(),
          endHour = hour,
          days = moment(endDate).diff(startDate, 'days');

        if (days === 0 && startHour === endHour) {
          // for문 필요 없이 기록하면 됨
          const sec =
            curState.endTime.getSeconds() - curState.startTime.getSeconds();

          let record = realm
            .objects('AppUsageRecord')
            .filtered(
              `appPackageName == "${prevAppPackageName}" && date == ${moment(
                startDate,
              )
                .utc()
                .format('YYYY-MM-DD@HH:mm:ss')}:0 && hour == ${hour}`,
            );

          // 기록 1개가 아니면 err
          const endRecordObj = record.map(realmObj =>
            JSON.parse(JSON.stringify(realmObj)),
          );
          // console.log(startRecordObj);

          if (endRecordObj.length !== 1) {
            throw new Error(
              `3. AppUsageRecord 개수는 1개여야 함, 현재 ${record.length}개`,
            );
          }

          record = record[0];
          // 정상 상황 처리 - 기록 update
          record.usageSec += sec;
          record.clickCnt++;
        } else {
          // for문 필요 (시간대 또는 날짜가 바뀌는 상황)
          const startSec =
              60 * 60 -
              (selectedStartTime.getMinutes() * 60 +
                selectedStartTime.getSeconds()),
            endSec =
              curState.endTime.getMinutes() * 60 +
              curState.endTime.getSeconds();

          const tempDate = moment(startDate);
          console.log(startSec, endSec);

          outer: for (
            let dayCnt = 0;
            dayCnt < days + 1;
            dayCnt++, tempDate.add(1, 'd')
          ) {
            for (let tempHour = 0; tempHour < 24; tempHour++) {
              // console.log(
              //   `for문 안 - dayCnt = ${dayCnt}, tempHour = ${tempHour} `,
              // );
              // 시작 전 시간대 처리
              if (dayCnt === 0 && tempHour < startHour) {
                continue;
              }

              // 1. 시작 시간
              // 이전에 반드시 시작 기록을 했을 것
              console.log('이전 앱 이름', prevAppPackageName);
              if (dayCnt === 0 && tempHour === startHour) {
                // console.log('시작 시간');
                let endRecord = realm
                  .objects('AppUsageRecord')
                  .filtered(
                    `appPackageName == "${prevAppPackageName}" && date == ${moment(
                      tempDate,
                    )
                      .utc()
                      .format('YYYY-MM-DD@HH:mm:ss')}:0 && hour == ${tempHour}`,
                  );

                // 기록 1개가 아니면 err
                const endRecordObj = endRecord.map(realmObj =>
                  JSON.parse(JSON.stringify(realmObj)),
                );
                // console.log(startRecordObj);

                if (endRecordObj.length !== 1) {
                  throw new Error(
                    `3. AppUsageRecord 개수는 1개여야 함, 현재 ${endRecord.length}개`,
                  );
                }

                endRecord = endRecord[0];
                // 정상 상황 처리 - 기록 update
                endRecord.usageSec += startSec;
                endRecord.clickCnt++;
              }

              // 이외의 시간대에 대해서는 새로 생성해주어야 할 것
              // 2. 마지막 시간
              else if (dayCnt === days && tempHour === endHour) {
                // console.log('마지막 시간');
                realm.create(
                  'AppUsageRecord',
                  new AppUsageRecord({
                    owner_id: user.id,
                    appPackageName: prevAppPackageName,
                    date: tempDate.toDate(),
                    hour: tempHour,
                    usageSec: endSec,
                  }),
                );

                // 종료
                break outer;
              }

              // 3. 그 외 중간 시간 (tempDate, hourCnt에 대해 1시간을 풀로 했을 것)
              else {
                // console.log('중간 시간');
                realm.create(
                  'AppUsageRecord',
                  new AppUsageRecord({
                    owner_id: user.id,
                    appPackageName: prevAppPackageName,
                    date: tempDate.toDate(),
                    hour: tempHour,
                    usageSec: 60 * 60,
                  }),
                );
              }
            }
          }
        }

        console.log('3. AppUsageRecord 종료 기록');
      }
    });

    // Realm 작업 끝
    realm.close();

    // try {
    //   await LockAppModule.viewLockScreen();
    // } catch (err) {
    //   console.error(err.message);
    // }

    console.log('AppCheckHeadlessTask 완료');
  } catch (err) {
    console.error(err.message);

    if (isOpened) {
      realm.close();
    }
  }
};

export {appCheckHeadlessTask};
