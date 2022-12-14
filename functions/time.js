import {startTransition} from 'react';
import {interpolate} from 'react-native-reanimated';
import moment from 'moment';

// 현재 시간 정보
export const curr = new Date();
export const today = new Date(
  curr.getTime() + curr.getTimezoneOffset() * 60 * 1000 + 9 * 60 * 60 * 1000,
);
export const year = today.getFullYear();
export const month = today.getMonth() + 1;
export const date = today.getDate();
export const hour = today.getHours();
export const minute = today.getMinutes();
export const seconds = today.getSeconds();
//오늘 날짜
export const todayDate = year + '-' + month + '-' + date;
//console.log(todayDate);
export function compareToday(date) {
  return (
    new Date(date).getFullYear() +
      '-' +
      (new Date(date).getMonth() + 1) +
      '-' +
      new Date(date).getDate() ===
    todayDate
  );
}

//미션 더미 데이터에 있는 시작 시간과 현재 시간 비교하는 함수
export function compareTimeBeforeStart(startTime) {
  if (startTime !== undefined) {
    const timeInfo = startTime.split(':');
    // 시작 시간 - 현재 시간
    let elapsedTime =
      new Date(year, month, date, timeInfo[0], timeInfo[1]).getTime() -
      new Date(
        year,
        month,
        date,
        new Date().getHours(),
        new Date().getMinutes(),
      ).getTime();
    let leftTime = elapsedTime / 60 / 1000;
    let leftHour = parseInt(leftTime / 60);
    let leftMinute = parseInt(leftTime % 60);
    return [leftHour, leftMinute];
  }
}

// 경과 시간 구하기 - return int
export function getElapsedTime(startTime) {
  if (startTime !== undefined) {
    let date = new Date();
    date.setHours(date.getHours() + 9);
    let value =
      timeToInteger(date.toISOString().replace('T', ' ').substring(11, 16)) -
      timeToInteger(startTime);

    // hh:mm:ss 형식 문자열 처리
    if (startTime.split(':').length == 3) {
      value += parseInt(startTime.split(':')[2]);
    }
    return value;
  }
}

// 시간 미션 컴포넌트의 시간 정보 텍스트
export function timeInfoText(data) {
  let timeData = data.split(':');
  let result =
    (parseInt(timeData[0] / 12) == 0 ? '오전 ' : '오후 ') +
    (parseInt(timeData[0] % 12).toString() == 0 &&
    parseInt(timeData[0] / 12) != 0
      ? '12'
      : parseInt(timeData[0] % 12).toString()) +
    '시 ' +
    parseInt(timeData[1]).toString() +
    '분';
  return result;
}

// MissionRecord startTime/endTime 프로퍼티 int 변환
export function timeToInteger(data) {
  const parsed = data.split(':');
  return parseInt(parsed[0] * 3600) + parseInt(parsed[1] * 60);
}

// 초 단위 시간 hh:mm:ss 문자열 변환
export function integerToTime(data) {
  return new Date(data * 1000).toISOString().substr(11, 8);
}

// 포기 시간 구하기
export function getGiveUpTime(endT, giveUpT) {
  const result = endT - (giveUpT === null ? 0 : giveUpT);
  return integerToTime(result);
}

// 실질적 미션 진행 시간 = 전체 시간 - (포기 시간) - 휴식 시간들
export function getActualMissionTime(endT, giveUpT, totalPT) {
  // console.log(
  //   '종료 시간: ',
  //   endT,
  //   '포기 시간: ',
  //   giveUpT,
  //   '금지 앱 사용 시간: ',
  //   totalPT,
  // );
  if (giveUpT) {
    return integerToTime(giveUpT - totalPT);
  } else {
    return integerToTime(endT - totalPT);
  }
}
