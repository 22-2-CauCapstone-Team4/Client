import Categories from '../Categories';
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, ScrollView, View, Switch} from 'react-native';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import CalendarStrip from 'react-native-calendar-strip';
import Colors from '../../utils/Colors';
import * as Progress from 'react-native-progress';
import {useSelector, useDispatch} from 'react-redux';
import {styles} from '../../utils/styles';
import {updateComment} from '../../store/action';

const RecordTab = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // redux 적용
  const recordList = useSelector(store => store.recordReducer.data);
  const newRecord = recordList
    .filter(value => {
      return value.isFinished === true;
    })
    .sort(sortRecord)
    .reverse();
  const dispatch = useDispatch();

  function sortRecord(a, b) {
    a = a.date.split('-').join('');
    b = b.date.split('-').join('');
    if (a < b) return -1;
    else if (a == b) return 0;
    else return 1;
  }

  return (
    <View style={recordStyle.canvas}>
      <View style={recordStyle.lineStyle}></View>
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

      <ScrollView>
        {newRecord.map(item => {
          if (isEnabled === true && item.isGiveUp === true) {
            return;
          }
          return (
            <View key={item.id} style={{alignItems: 'center', padding: 5}}>
              <View style={recordStyle.info}>
                <View style={recordStyle.timeRecord}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={recordStyle.lockTime}>
                      🔒{item.LockTime.useTime}
                    </Text>
                    {/* ★ 잠금 시간 */}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={recordStyle.useTime}>
                      ❌{item.useTimeLockApp.useTime}
                    </Text>
                    {/* ★ 금지앱 사용 시간 */}
                  </View>
                </View>
                <View
                  style={{
                    border: 1,
                    borderWidth: 1,
                    borderRadius: 25,
                    padding: '4%',
                    width: '80%',
                    borderColor:
                      item.isGiveUp === false ? Colors.MAIN_COLOR : '#f5a6a3',
                    // ★ 실패 or 성공 전체적인 테두리
                  }}>
                  <View style={[recordStyle.main]}>
                    <View>
                      <View style={recordStyle.missionInfo}>
                        <Text style={recordStyle.category}>
                          {item.category}
                        </Text>
                        {/* ★ 카테고리 */}
                        <Text style={recordStyle.bar}> | </Text>
                        <Text style={recordStyle.missionName}>{item.name}</Text>
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
                          backgroundColor:
                            item.isGiveUp === false ? '#e1f0fb' : '#fae4e1',
                        }}>
                        {item.date}
                        {item.isGiveUp === false ? '  성공' : '  실패'}
                        {/* ★ 성공 or 실패 -> true or false 값 넣어줘야 함 */}
                      </Text>
                      {/* ★ 성공 or 실패에 따라 성공, 실패가 보이는 곳 */}
                    </View>
                  </View>
                  <View style={recordStyle.progressBar}>
                    <View>
                      <Progress.Bar progress={0.3} width={270}></Progress.Bar>
                      <Text style={{color: 'black', fontSize: 8}}>123</Text>
                    </View>
                  </View>
                  <View>
                    <TextInput
                      style={recordStyle.inputText}
                      placeholder="한 줄 평가"
                      placeholderTextColor={Colors.GREY}
                      onChangeText={event => setText(event)}
                      onSubmitEditing={() =>
                        dispatch(updateComment({...item, inputText: text}))
                      }
                    />
                    {/* ★ 상태 메시지 남기는 곳 */}
                  </View>
                </View>
              </View>
            </View>
          );
        })}
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
  progressBar: {
    alignItems: 'center',
    marginTop: '5%',
  },
  progressBarStyle: {
    width: '100%',
  },
  lockTime: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
  },
  useTime: {
    color: 'black',
    fontSize: 10,
    fontWeight: 'bold',
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
});
export default RecordTab;
