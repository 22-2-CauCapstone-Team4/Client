import React, {useState, useCallback, useEffect} from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, View, Switch, Image} from 'react-native';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import Colors from '../../utils/Colors';
import {ProgressBar} from 'rn-multi-progress-bar';
import {useSelector, useDispatch} from 'react-redux';
import {styles} from '../../utils/styles';
import {updateComment} from '../../store/action';
import {updateCommentInRealm, readMissionRecordsInRealm} from '../../functions';
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
import {initRecord} from '../../store/action';

const RecordTab = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [dateMessage, setDateMessage] = useState('');
  const {user} = useAuth();

  useEffect(() => {});

  // useEffect(() => {
  //   try {
  //     Realm.open(
  //       mkConfig(user, [
  //         Goal.schema,
  //         Place.schema,
  //         Mission.schema,
  //         MissionRecord.schema,
  //         GiveUpAppEmbedded.schema,
  //         AppUsageEmbedded.schema,
  //         UserInfo.schema,
  //       ]),
  //     ).then(realm => {
  //       realm.addListener('change', onRealmChange);
  //       realm.close();
  //     });
  //   } catch (error) {
  //     console.log(error.message);
  //   }
  // });

  // const onRealmChange = async () => {
  //   const realm = await Realm.open(
  //     mkConfig(user, [
  //       Goal.schema,
  //       Place.schema,
  //       Mission.schema,
  //       MissionRecord.schema,
  //       GiveUpAppEmbedded.schema,
  //       AppUsageEmbedded.schema,
  //       UserInfo.schema,
  //     ]),
  //   );
  //   let tempRecords = await readMissionRecordsInRealm(user, realm);
  //   dispatch(initRecord(tempRecords));

  //   realm.close();
  // };

  // redux ??????
  const recordList = useSelector(store => store.recordReducer.data);
  const appList = useSelector(store => store.appReducer.data); // ?????? ?????? ????????? ?????? ??? ????????? ??????
  // console.log(recordList[0].mission.goal);
  const newRecord =
    recordList !== null ? recordList.sort(sortRecord).reverse() : null;

  const dispatch = useDispatch();
  const arr =
    newRecord !== null
      ? Array.from(new Set(newRecord.map(item => item.date)))
      : null;
  function sortRecord(a, b) {
    let aDate = a.date.split('-').join('');
    let bDate = b.date.split('-').join('');
    if (aDate < bDate) return -1;
    else if (aDate == bDate) {
      let aStartTime = a.startTime.split(':').join('');
      let bStartTime = b.startTime.split(':').join('');
      if (aStartTime <= bStartTime) return 1;
      else return -1;
    } else return 1;
  }

  function getMostUsedProhibitedAppIcon(usages) {
    let appNameList = new Set(usages.map(item => item.name));
    let appCounter = {};
    for (var app of appNameList) {
      appCounter[app] = 0;
    }
    for (var data of usages) {
      appCounter[data.name] +=
        parseInt(data.endTime) - parseInt(data.startTime);
    }
    let mostUsedApp = Object.entries(appCounter).sort(function (a, b) {
      return b[1] - a[1];
    })[0][0];
    let mostUsedAppIcon = appList.filter(data => {
      return data.name === mostUsedApp;
    })[0].icon;
    return mostUsedAppIcon;
  }
  // BLUE: ??????, ?????? ??????, ?????? ?????? ??????(startTime, endTime, breakTimes[i] + extraTime(less than 600))
  // YELLOW: ?????? ?????? ??????(breakTimes elements)
  // RED: ?????? ??????(giveUpTime)
  const CustomProgressBar = props => {
    let BLUE = [0, props.timeData.endTime];
    let YELLOW = props.timeData.prohibitedAppUsages.map(el => el.startTime);
    let RED = props.timeData.giveUpTime ? [props.timeData.giveUpTime] : [];
    let endAppTimes = props.timeData.prohibitedAppUsages.map(el => {
      return {startTime: el.startTime, endTime: el.endTime};
    });
    // ?????? ?????? ?????? BLUE??? append (????????? ?????? ?????? ?????? ??????)
    if (endAppTimes.length > 0) {
      for (var i = 0; i < endAppTimes.length; i++) {
        if (endAppTimes[i].endTime > props.timeData.giveUpTime) {
          RED.push(endAppTimes[i].endTime);
        } else BLUE.push(endAppTimes[i].endTime);
      }

      // ????????? ?????? ?????? ?????? ??????
      // ?????? ?????? ??????????????? ?????? ??????????????? ????????? ?????? ?????? ????????? ?????? ?????? or ?????? ?????? ????????? ??????. ???, push ??????
      let lastAppTime = endAppTimes[endAppTimes.length - 1].endTime;
      if (!lastAppTime || lastAppTime > props.timeData.endTime) {
        if (props.timeData.endTime > props.timeData.giveUpTime) {
          RED.push(endAppTimes[i].endTime);
        } else {
          BLUE.push(props.timeData.endTime);
        }
      } else {
        if (lastAppTime > props.timeData.giveUpTime) {
          RED.push(lastAppTime);
        } else BLUE.push(lastAppTime);
      }
    }
    let times = [];
    if (RED[0] !== null) times = BLUE.concat(YELLOW, RED); //null??????
    else times = BLUE.concat(YELLOW);
    times.sort(function (a, b) {
      return a - b;
    });
    let bars = [];
    for (var i = 0; i < times.length - 1; i++) {
      if (times[i + 1] - times[i] !== 0) {
        bars.push({
          progress: times[i + 1] - times[i],
          color: BLUE.includes(times[i])
            ? Colors.MAIN_PROGRESS_COLOR
            : YELLOW.includes(times[i])
            ? Colors.PROGRESS_PAUSE_COLOR
            : Colors.PROGRESS_FAIL_COLOR,
        });
      }
    }
    return <ProgressBar data={bars} />;
  };

  return (
    <View style={recordStyle.canvas}>
      <View style={[recordStyle.toggleBtn]}>
        <Text style={recordStyle.selectRecord}>?????? ????????? ??????</Text>
        <Switch
          style={{transform: [{scaleX: 0.9}, {scaleY: 0.9}]}}
          trackColor={{false: '#767577', true: Colors.MAIN_COLOR}}
          thumbColor={isEnabled ? '#ffffff' : '#222222'}
          onValueChange={toggleSwitch}
          value={isEnabled}
        />

        {/* ??? ?????? ????????? ?????? ?????? */}
      </View>
      <View style={recordStyle.lineStyle}></View>
      {newRecord.length === 0 ? (
        <View style={{alignItems: 'center', marginVertical: 20}}>
          <Text style={recordStyle.defaultText}>????????? ????????????</Text>
        </View>
      ) : null}
      <ScrollView>
        {/* ?????? ??? */}
        {arr !== null
          ? arr.map(item => (
              <View key={item} style={{alignItems: 'center'}}>
                {isEnabled ? (
                  newRecord.filter(
                    record => record.date === item && !record.giveUpTime,
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
                {/* ????????? ?????? ???????????? ?????? */}
                {newRecord
                  .filter(record => record.date === item)
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
                            {/* ?????? ?????? ????????? ?????? ??? */}
                            {item.prohibitedAppUsages.length == 0 ? null : (
                              <View
                                style={{
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                }}>
                                <Text style={recordStyle.mostUsedApp}>
                                  ?????? ?????? ?????????
                                </Text>
                                <Text style={recordStyle.mostUsedApp}>
                                  ?????? ??????
                                </Text>
                                <Image
                                  source={{
                                    uri: getMostUsedProhibitedAppIcon(
                                      item.prohibitedAppUsages,
                                    ),
                                  }}
                                  style={{width: 60, height: 60}}
                                  color={Colors.MAIN_COLOR}
                                />
                              </View>
                            )}

                            <View
                              style={{flexDirection: 'row', marginVertical: 3}}>
                              <Text style={recordStyle.lockTime}>
                                ????
                                {Time.getActualMissionTime(
                                  item.endTime,
                                  item.giveUpTime,
                                  0,
                                )}
                              </Text>
                              {/* ??? ?????? ?????? */}
                            </View>
                            {!item.totalProhibitedAppUsageSec ? null : (
                              <View
                                style={{flexDirection: 'row', marginBottom: 3}}>
                                <Text style={recordStyle.useTime}>
                                  ????
                                  {Time.integerToTime(
                                    item.totalProhibitedAppUsageSec,
                                  )}
                                </Text>
                                {/* ??? ????????? ?????? ?????? */}
                              </View>
                            )}

                            {/* ?????? ????????? ?????? ?????? ?????? ?????? */}
                            {!item.giveUpTime ? null : (
                              <View style={{flexDirection: 'row'}}>
                                <Text style={recordStyle.quitTime}>
                                  ???
                                  {Time.getGiveUpTime(
                                    item.endTime,
                                    item.giveUpTime,
                                  )}
                                </Text>
                                {/* ??? ????????? ?????? ?????? */}
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
                              // ??? ?????? or ?????? ???????????? ?????????
                            }}>
                            <View style={[recordStyle.main]}>
                              <View>
                                <View style={recordStyle.missionInfo}>
                                  <Text style={recordStyle.category}>
                                    {item.mission.goal.name}
                                  </Text>
                                  {/* ??? ???????????? */}
                                  <Text style={recordStyle.bar}> | </Text>
                                  <Text style={recordStyle.missionName}>
                                    {item.mission.name}
                                  </Text>
                                  {/* ??? ?????? ?????? */}
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
                                  {!item.giveUpTime ? '??????' : '??????'}
                                  {/* ??? ?????? or ?????? -> true or false ??? ???????????? ??? */}
                                </Text>
                                {/* ??? ?????? or ????????? ?????? ??????, ????????? ????????? ??? */}
                              </View>
                            </View>
                            <View style={recordStyle.progressBar}>
                              <View
                                style={{
                                  width: '100%',
                                  justifyContent: 'center',
                                  alignItems: 'center',
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
                                  <View
                                    style={recordStyle.timeLineStyle}></View>
                                  <Text style={recordStyle.timeText}>
                                    {item.endTimeStr}
                                  </Text>
                                </View>
                              </View>
                            </View>
                            <View>
                              <TextInput
                                style={recordStyle.inputText}
                                defaultValue={item.comment}
                                placeholder="??? ??? ??????"
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
                                  dispatch(
                                    updateComment({...item, comment: text}),
                                  );
                                }}
                              />
                              {/* ??? ?????? ????????? ????????? ??? */}
                            </View>
                          </View>
                        </View>
                      </View>
                    );
                  })}
              </View>
            ))
          : null}
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
  defaultText: {
    fontSize: 24,
    color: Colors.MAIN_COLOR,
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
  mostUsedApp: {
    marginBottom: 2,
    color: 'red',
    fontSize: 9,
  },
  lockTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },
  useTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.USAGE_COLOR,
  },
  quitTime: {
    color: 'black',
    fontSize: 10,
    backgroundColor: Colors.FAIL_COLOR,
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
    width: '85%',
    marginHorizontal: 3,
  },
});
export default RecordTab;
