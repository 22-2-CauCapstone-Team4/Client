import Categories from '../Categories';
import React, {useState} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, ScrollView, View, Switch} from 'react-native';
import {StyleSheet} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
// import CalendarStrip from 'react-native-calendar-strip';
import Colors from '../../utils/Colors';
import * as Progress from 'react-native-progress';
import recordReducer from '../../store/reducers/recordReducer';

import {Provider, useSelector, useDispatch} from 'react-redux';
import {createStore} from 'redux';
import {curr} from '../../functions/time';

const RecordTab = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [text, setText] = useState('');
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);

  // redux 적용
  const recordList = useSelector(store => store.recordReducer.data);
  const newRecord = recordList.filter(value => {
    return value.isFinished === true;
  });
  const dispatch = useDispatch();
  return (
    <View style={{height: '100%', backgroundColor: 'white', padding: 20}}>
      <View style={[recordStyle.toggleBtn]}>
        <Text style={recordStyle.selectRecord}>성공 기록만 보기</Text>
        <View>
          <Switch
            style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
            trackColor={{false: '#767577', true: Colors.MAIN_COLOR}}
            thumbColor={isEnabled ? '#ffffff' : '#222222'}
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
          {/* ★ 성공 기록만 보기 유무 */}
        </View>
      </View>

      <ScrollView>
        {newRecord.map(item => {
          if (isEnabled === true && item.isGiveUp === false) {
            return;
          }
          return (
            <View style={{alignItems: 'center', marginTop: 10}}>
              <View style={recordStyle.info}>
                <View style={recordStyle.timeRecord}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'yellow'}}>🔒</Text>
                    <Text style={recordStyle.lockTime}>
                      {item.LockTime.useTime}
                    </Text>
                    {/* ★ 잠금 시간 */}
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={{color: 'red'}}>❌</Text>
                    <Text style={recordStyle.useTime}>
                      {item.useTimeLockApp.useTime}
                    </Text>
                    {/* ★ 금지앱 사용 시간 */}
                  </View>
                </View>
                <View
                  style={{
                    border: 1,
                    borderWidth: 2,
                    borderRadius: 5,
                    padding: '6%',
                    borderColor: item.isGiveUp === true ? '#5CD4F3' : '#f5a6a3',
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
                        <Text style={recordStyle.missionName}>{item.id}</Text>
                        {/* ★ 미션 이름 */}
                      </View>
                    </View>
                    <View
                      style={
                        ([recordStyle.missionStatus],
                        {
                          backgroundColor:
                            item.isGiveUp === true ? '#e1f0fb' : '#fae4e1',
                          justifyContent: 'center',
                          padding: 2,
                          borderRadius: 10,
                        })
                      }>
                      <Text style={{color: 'black'}}>
                        {item.isGiveUp === true ? '성공' : '실패'}
                        {/* ★ 성공 or 실패 -> true or false 값 넣어줘야 함 */}
                      </Text>
                      {/* ★ 성공 or 실패에 따라 성공, 실패가 보이는 곳 */}
                    </View>
                  </View>
                  <View style={recordStyle.progressBar}>
                    <Progress.Bar progress={0.3} width={220} />
                  </View>
                  <View>
                    <TextInput
                      style={recordStyle.inputText}
                      placeholder="한 줄 평가"
                      onChangeText={event => setText(event)}
                      // onSubmitEditing={() =>
                      //   dispatch({type: 'EVAUEATION', newText: text})
                      // }
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
  main: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  toggleBtn: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  inputText: {
    border: 1,
    borderWidth: 1,
    borderColor: '#D4D4D4',
    borderRadius: 10,
    marginTop: 10,
  },
  missionInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  missionStatus: {
    borderRadius: 4,
    paddingLeft: '1%',
    paddingRight: '1%',
    justifyContent: 'center',
  },
  selectRecord: {
    marginRight: 10,
    color: 'black',
    fontSize: 17,
  },
  category: {
    fontSize: 25,
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
    fontSize: 15,
    fontWeight: 'bold',
  },
  useTime: {
    color: 'black',
    fontSize: 15,
    fontWeight: 'bold',
  },
  timeRecord: {
    marginRight: 10,
  },
  info: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginTop: 20,
  },
});
export default RecordTab;
