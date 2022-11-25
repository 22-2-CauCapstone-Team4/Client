import {startTransition} from 'react';

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
