import {startTransition} from 'react';
import {interpolate} from 'react-native-reanimated';

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
  const result = timeToInteger(endT) - (giveUpT === null ? 0 : giveUpT);
  return integerToTime(result);
}

// 실질적 미션 진행 시간 = 전체 시간 - (포기 시간) - 휴식 시간들
export function getActualMissionTime(startT, endT, giveUpT, breakTimes) {
  /// 총 휴식 시간
  /// 일반적인 상황: breakTimes 길이 * 10분
  /// 휴식 시간 중 포기: 포기 시간 - 마지막 휴식 시간 < 600 이면 휴식 시간 중에 포기한 것
  /// 이 경우 600 이 아니고 포기 시간 - 마지막 휴식 시간을 더해준다
  /// 휴식 중에 미션 클리어: 종료 시간 - 마지막 휴식 시간 < 600 확인하고 처리
  // console.log(timeToInteger(endT), giveUpT, breakTimes);
  let totalBreakTime = 0;
  if (breakTimes.length > 0) {
    totalBreakTime += (breakTimes.length - 1) * 600;
    if (!giveUpT && endT - breakTimes[breakTimes.length - 1] < 600)
      totalBreakTime += endT - breakTimes[breakTimes.length - 1];
    else if (giveUpT && giveUpT - breakTimes[breakTimes.length - 1] < 600)
      totalBreakTime += giveUpT - breakTimes[breakTimes.length - 1];
    else totalBreakTime += 600;
  }
  return integerToTime(
    (giveUpT === null ? timeToInteger(endT) : giveUpT) -
      timeToInteger(startT) -
      totalBreakTime,
  );
}
