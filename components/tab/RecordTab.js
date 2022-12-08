import React, {useState} from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, View, Switch} from 'react-native';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';
import {ProgressBar} from 'rn-multi-progress-bar';
import {useSelector, useDispatch} from 'react-redux';
import {styles} from '../../utils/styles';
import {updateComment} from '../../store/action';
import {updateCommentInRealm} from '../../functions';
import * as Time from '../../functions/time.js';
import {mkConfig} from '../../functions/mkConfig';
import Realm from 'realm';
import {useAuth} from '../../providers/AuthProvider';
import {
  Goal,
  Place,
  Mission,
  AppUsageEmbedded,
  GiveUpAppEmbedded,
  MissionRecord,
  UserInfo,
} from '../../schema';

const RecordTab = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [dateMessage, setDateMessage] = useState('');
  const {user} = useAuth();

  // redux 적용
  const recordList = useSelector(store => store.recordReducer.data);
  const newRecord = recordList.sort(sortRecord).reverse();
  const dispatch = useDispatch();

  const arr = Array.from(new Set(newRecord.map(item => item.mission.date)));

  function sortRecord(a, b) {
    let aDate = a.mission.date.split('-').join('');
    let bDate = b.mission.date.split('-').join('');
    if (aDate < bDate) return -1;
    else if (aDate == bDate) {
      let aStartTime = a.startTime.split(':').join('');
      let bStartTime = b.startTime.split(':').join('');
      if (aStartTime <= bStartTime) return 1;
      else return -1;
    } else return 1;
  }

  // 초시간 배열로 관리하는 프로그레스 바
  // BLUE: 시작, 종료 시간, 휴식 종료 시간(startTime, endTime, breakTimes[i] + extraTime(less than 600))
  // YELLOW: 휴식 시작 시간(breakTimes elements)
  // RED: 포기 시간(giveUpTime)
  const CustomProgressBar = props => {
    let BLUE = [
      Time.timeToInteger(props.timeData.startTime),
      Time.timeToInteger(props.timeData.endTime),
    ];
    let YELLOW = props.timeData.breakTimes;
    let RED = [props.timeData.giveUpTime];
    let breakTimes = props.timeData.breakTimes;
    // 휴식 종료 시간 BLUE에 append (마지막 휴식 종료 시간 제외)
    if (breakTimes.length > 0) {
      for (var i = 0; i < breakTimes.length - 1; i++)
        BLUE.push(breakTimes[i] + 600);

      // 마지막 휴식 종료 시간 처리
      // 휴식 중에 포기했거나 미션 종료됐다면 마지막 휴식 종료 시간은 포기 시간 or 미션 종료 시간이 된다. 즉, push 안함
      let lastBreakTime = breakTimes[breakTimes.length - 1];
      if (
        (props.timeData.giveUpTime &&
          props.timeData.giveUpTime - lastBreakTime > 600) ||
        (!props.timeData.giveUpTime &&
          Time.timeToInteger(props.timeData.endTime) - lastBreakTime > 600)
      ) {
        BLUE.push(lastBreakTime + 600);
      }
    }
    let times = [];
    if (RED[0] !== null) times = BLUE.concat(YELLOW, RED); //null처리
    else times = BLUE.concat(YELLOW);
    times.sort();

    let bars = [];
    for (var i = 0; i < times.length - 1; i++)
      bars.push({
        progress: times[i + 1] - times[i],
        color: BLUE.includes(times[i])
          ? Colors.MAIN_PROGRESS_COLOR
          : YELLOW.includes(times[i])
          ? Colors.PROGRESS_PAUSE_COLOR
          : Colors.PROGRESS_FAIL_COLOR,
      });
    return <ProgressBar data={bars} />;
  };

  return (
    <View style={recordStyle.canvas}>
      <View style={[recordStyle.toggleBtn]}>
        <Text style={recordStyle.selectRecord}>성공 기록만 보기</Text>
        <Switch
          style={{transform: [{scaleX: 0.9}, {scaleY: 0.9}]}}
          trackColor={{false: '#767577', true: Colors.MAIN_COLOR}}
          thumbColor={isEnabled ? '#ffffff' : '#222222'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />

        {/* ★ 성공 기록만 보기 유무 */}
      </View>

      <View style={recordStyle.lineStyle}></View>
      <ScrollView>
        {/* 날짜 선 */}
        {arr.map(item => (
          <View key={item} style={{alignItems: 'center'}}>
            {isEnabled ? (
              newRecord.filter(
                record => record.mission.date === item && !record.giveUpTime,
              ).length > 0 ? (
                <View style={{flexDirection: 'row', marginVertical: 10}}>
                  <View style={recordStyle.dateLineStyle}></View>
                  <Text style={recordStyle.dateHeader} key={item}>
                    {item}
                  </Text>
                  <View style={recordStyle.dateLineStyle}></View>
                </View>
              ) : null
            ) : (
              <View style={{flexDirection: 'row', marginVertical: 10}}>
                <View style={recordStyle.dateLineStyle}></View>
                <Text style={recordStyle.dateHeader} key={item}>
                  {item}
                </Text>
                <View style={recordStyle.dateLineStyle}></View>
              </View>
            )}
            {/* 최신순 기록 컴포넌트 표시 */}
            {newRecord
              .filter(record => record.mission.date === item)
              .map(item => {
                if (isEnabled === true && item.giveUpTime) {
                  return;
                }
                return (
                  <View
                    key={item._id}
                    style={{alignItems: 'center', padding: 5}}>
                    <View style={recordStyle.info}>
                      <View style={recordStyle.timeRecord}>
                        <View style={{flexDirection: 'row', marginBottom: 3}}>
                          <Text style={recordStyle.lockTime}>
                            🔒
                            {Time.getActualMissionTime(
                              item.startTime,
                              item.endTime,
                              item.giveUpTime,
                              item.breakTimes,
                            )}
                          </Text>
                          {/* ★ 잠금 시간 */}
                        </View>
                        {!item.totalProhibitedAppUsageSec ? null : (
                          <View style={{flexDirection: 'row', marginBottom: 3}}>
                            <Text style={recordStyle.useTime}>
                              📵
                              {Time.integerToTime(
                                item.totalProhibitedAppUsageSec,
                              )}
                            </Text>
                            {/* ★ 금지앱 사용 시간 */}
                          </View>
                        )}

                        {/* 미션 성공시 포기 시간 표시 안함 */}
                        {!item.giveUpTime ? null : (
                          <View style={{flexDirection: 'row'}}>
                            <Text style={recordStyle.quitTime}>
                              ❌
                              {Time.getGiveUpTime(
                                item.endTime,
                                item.giveUpTime,
                              )}
                            </Text>
                            {/* ★ 금지앱 사용 시간 */}
                          </View>
                        )}
                      </View>
                      <View
                        style={{
                          border: 1,
                          borderWidth: 1,
                          borderRadius: 25,
                          padding: '4%',
                          width: '80%',
                          borderColor: !item.giveUpTime
                            ? Colors.MAIN_COLOR
                            : '#f5a6a3',
                          // ★ 실패 or 성공 전체적인 테두리
                        }}>
                        <View style={[recordStyle.main]}>
                          <View>
                            <View style={recordStyle.missionInfo}>
                              <Text style={recordStyle.category}>
                                {item.mission.category}
                              </Text>
                              {/* ★ 카테고리 */}
                              <Text style={recordStyle.bar}> | </Text>
                              <Text style={recordStyle.missionName}>
                                {item.mission.name}
                              </Text>
                              {/* ★ 미션 이름 */}
                            </View>
                          </View>
                          <View
                            style={
                              ([recordStyle.missionStatus],
                              {
                                justifyContent: 'center',
                                borderRadius: 10,
                              })
                            }>
                            <Text
                              style={{
                                color: 'black',
                                fontSize: 10,
                                backgroundColor: !item.giveUpTime
                                  ? '#e1f0fb'
                                  : '#fae4e1',
                              }}>
                              {!item.giveUpTime ? '성공' : '실패'}
                              {/* ★ 성공 or 실패 -> true or false 값 넣어줘야 함 */}
                            </Text>
                            {/* ★ 성공 or 실패에 따라 성공, 실패가 보이는 곳 */}
                          </View>
                        </View>
                        <View style={recordStyle.progressBar}>
                          <View
                            style={{
                              width: '100%',
                            }}>
                            <CustomProgressBar
                              timeData={item}></CustomProgressBar>
                            <View
                              style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                              }}>
                              <Text style={recordStyle.timeText}>
                                {item.startTime}
                              </Text>
                              <View style={recordStyle.timeLineStyle}></View>
                              <Text style={recordStyle.timeText}>
                                {item.endTime}
                              </Text>
                            </View>
                          </View>
                        </View>
                        <View>
                          <TextInput
                            style={recordStyle.inputText}
                            placeholder="한 줄 평가"
                            placeholderTextColor={Colors.GREY}
                            onChangeText={event => setText(event)}
                            onSubmitEditing={() => {
                              Realm.open(
                                mkConfig(user, [
                                  Goal.schema,
                                  Place.schema,
                                  Mission.schema,
                                  MissionRecord.schema,
                                  GiveUpAppEmbedded.schema,
                                  AppUsageEmbedded.schema,
                                  UserInfo.schema,
                                ]),
                              ).then(realm => {
                                updateCommentInRealm(user, realm, {
                                  ...item,
                                  comment: text,
                                });
                                realm.close();
                              });
                              dispatch(updateComment({...item, comment: text}));
                            }}
                          />
                          {/* ★ 상태 메시지 남기는 곳 */}
                        </View>
                      </View>
                    </View>
                  </View>
                );
              })}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};
const recordStyle = StyleSheet.create({
  canvas: {
    height: '100%',
    backgroundColor: 'white',
    padding: 3,
  },
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  inputText: {
    border: 1,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 10,
    marginTop: 10,
    fontSize: 10,
    paddingVertical: 0,
    height: 30,
    color: Colors.MAIN_COLOR,
  },
  timeText: {
    color: 'black',
    fontSize: 8,
  },
  missionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionStatus: {
    borderRadius: 4,
    justifyContent: 'center',
  },
  selectRecord: {
    marginRight: 10,
    color: 'black',
    fontSize: 13,
  },
  category: {
    fontSize: 16,
    color: 'black',
  },
  bar: {
    color: 'black',
  },
  missionName: {
    color: 'black',
  },
  progressBarStyle: {
    width: '100%',
  },
  lockTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },
  useTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.PROGRESS_PAUSE_COLOR,
  },
  quitTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.PROGRESS_FAIL_COLOR,
  },
  timeRecord: {
    width: '20%',
    alignItems: 'center',
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 10,
  },
  lineStyle: {
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR_INACTIVE,
    marginVertical: 5,
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },
  dateLineStyle: {
    marginVertical: 5,
    backgroundColor: Colors.GREY,
    height: 2,
    flex: 1,
    alignSelf: 'center',
  },
  dateHeader: {
    color: 'black',
    fontSize: 18,
    alignSelf: 'center',
    paddingHorizontal: 7,
  },
  timeLineStyle: {
    height: 0.5,
    marginVertical: 5,
    backgroundColor: Colors.GREY,
    width: '80%',
    marginHorizontal: 3,
  },
});
export default RecordTab;
