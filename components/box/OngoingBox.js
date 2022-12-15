import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, View, Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import * as Time from '../../functions/time';
import {updateMission, updateTodayMission} from '../../store/action';
import {mkConfig, giveUp, takeBreakTime} from '../../functions';

import Realm from 'realm';
import {useAuth} from '../../providers/AuthProvider';
import SnackBar from 'react-native-snackbar';
import {
  CurState,
  TodayMission,
  Goal,
  Place,
  Mission,
  ProhibitedApp,
  AppUsageEmbedded,
  GiveUpAppEmbedded,
  MissionRecord,
  UserInfo,
} from '../../schema';

const OngoingBox = () => {
  const {user} = useAuth();
  const dispatch = useDispatch();
  const missionData = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  );
  const doingMission = missionData.filter(item => item.state == 'start')[0];
  const record = useSelector(store => store.recordReducer.data2);
  // console.log('기록을 봐보자', record);
  // console.log(doingMission);
  const now = new Date();
  const nowSec =
    now.getHours() * 60 * 60 + now.getMinutes() * 60 + now.getSeconds();

  // 경과 시간: 미션 시작 시간(hh:mm) -> 약간 부정확한 형식 (hh:mm:ss)여야 정확
  // 경과 시간은 휴식 시간을 제외한 상태이기 때문에 time.js에서 getActualMissionTime(startTime,endTime,null,breakTimes)를 이용하면 정확한 경과 시간을 얻을 것이라 예상
  const [elapsedTime, setElapsedTime] = useState(
    !record ? 0 : nowSec - record.startTime,
  );

  // 금지 앱 시간: 저장된 금지 앱 사용 시간
  const [pauseTime, setPauseTime] = useState(
    !record ? 0 : record.totalProhibitedAppUsageSec,
  ); //0 대신에 DB에 저장된 금지 앱 사용시간을 넣어줘야겠다

  // 경과시간 실시간 측정
  useEffect(() => {
    const timeOutId = setInterval(() => {
      setElapsedTime(second => second + 1);
      //
      // if ('금지앱사용가능한상태'.length !== 0) {
      //   setPauseTime(second => second + 1);
      // }
    }, 1000);
    return () => clearInterval(timeOutId);
  }, [doingMission, elapsedTime]);

  if (typeof doingMission !== 'undefined') {
    return (
      <Container>
        <Info1>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.type1, {marginRight: 5}]}>
              {doingMission.category}
            </Text>
            <Text style={styles.type2}>| {doingMission.name}</Text>
          </View>
        </Info1>
        <Info2>
          <Text style={styles.info2}>
            🔒{' '}
            <Text style={{fontWeight: '500'}}>
              {Time.integerToTime(elapsedTime)}
            </Text>{' '}
            <Text style={{fontSize: 20}}>경과</Text>
          </Text>
          <Text style={styles.info3}>
            📵{' '}
            <Text style={{fontWeight: '500'}}>
              {Time.integerToTime(pauseTime)}
            </Text>
            <Text style={{fontSize: 20}}>사용</Text>
          </Text>
          <View style={styles.info4}>
            <Text style={{fontSize: 17, textAlign: 'center'}}>
              조건 만족 시
            </Text>
            <Text style={{fontSize: 17, textAlign: 'center'}}>
              잠금이 해제될 수 있습니다.
            </Text>
          </View>
        </Info2>
        <Btn>
          <TouchableOpacity
            style={styles.btn1}
            onPress={() => {
              Alert.alert(
                '10분 사용',
                '지금부터 10분간 금지 앱을 사용하시겠습니까?',
                [
                  {
                    text: '사용',
                    onPress: async () => {
                      const realm = await Realm.open(
                        mkConfig(user, [
                          CurState.schema,
                          Mission.schema,
                          Goal.schema,
                          Place.schema,
                          ProhibitedApp.schema,
                          MissionRecord.schema,
                          GiveUpAppEmbedded.schema,
                          AppUsageEmbedded.schema,
                          UserInfo.schema,
                        ]),
                      );
                      await takeBreakTime(realm);
                      realm.close();

                      SnackBar.show({
                        text: '지금부터 10분간 금지 앱을 사용할 수 있습니다. ',
                        duration: SnackBar.LENGTH_SHORT,
                      });
                    },
                  },
                  {
                    text: '취소',
                  },
                ],
              );
            }}>
            <Text style={styles.btnStyle}>10분 사용</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.btn2}>
            <Text
              style={styles.btnStyle}
              onPress={() => {
                Alert.alert('미션 포기!', '정말 미션을 포기하시겠습니까?', [
                  {
                    text: '포기',
                    onPress: async () => {
                      const realm = await Realm.open(
                        mkConfig(user, [
                          CurState.schema,
                          TodayMission.schema,
                          Mission.schema,
                          MissionRecord.schema,
                          GiveUpAppEmbedded.schema,
                          AppUsageEmbedded.schema,
                          UserInfo.schema,
                          Goal.schema,
                          Place.schema,
                          ProhibitedApp.schema,
                        ]),
                      );
                      await giveUp(realm);
                      realm.close();

                      SnackBar.show({
                        text: '미션 포기가 완료되었습니다. ',
                        duration: SnackBar.LENGTH_SHORT,
                      });
                      dispatch(
                        updateTodayMission({...doingMission, state: 'quit'}),
                      );
                    },
                  },
                  {
                    text: '취소',
                  },
                ]);
              }}>
              포기
            </Text>
          </TouchableOpacity>
        </Btn>
      </Container>
    );
  } else {
    return (
      <Container>
        <Text style={styles.type1}>현재 진행 중인 미션이 없습니다.</Text>
      </Container>
    );
  }
};

const styles = StyleSheet.create({
  type1: {
    fontSize: 30,
    color: 'black',
    fontWeight: 'bold',
  },
  type2: {
    fontSize: 20,
    color: 'black',
  },
  emoji: {
    fontSize: 30,
    color: 'yellow',
  },
  title: {
    color: 'black',
  },
  info1: {
    color: 'black',
    marginTop: 15,
  },
  info2: {
    color: 'black',
    fontSize: 30,
  },
  info3: {
    color: 'black',
    fontSize: 30,
  },
  info4: {
    color: 'black',
    fontSize: 20,
    padding: 20,
    textAlign: 'center',
  },
  infoLeftOver: {
    color: 'black',
    textAlign: 'center',
  },
  btn1: {
    backgroundColor: '#cce7ee',
    padding: 10,
    borderRadius: 5,
  },
  btn2: {
    backgroundColor: '#cce7ee',
    padding: 10,
    borderRadius: 5,
  },
  btnStyle: {
    color: '#8ccbda',
    fontWeight: 'bold',
    fontSize: 20,
  },
});

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const Info1 = styled.View`
  align-items: center;
`;
const Info2 = styled.View`
  align-items: center;
  margin-top: 30px;
`;
const Btn = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;

export default OngoingBox;
