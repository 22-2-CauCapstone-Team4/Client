import React, {useEffect} from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, View, Alert} from 'react-native';
import {StyleSheet} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';

import {compareToday} from '../../functions/time';
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
  console.log('오늘의 미션', missionData);
  useEffect(() => {}, [doingMission]);
  //console.log('바뀔까요?', doingMission);
  const pendingMission = missionData.filter(
    item =>
      item.state == 'none' &&
      (item.dayOfWeek.length == 0
        ? compareToday(item.date)
        : item.dayOfWeek.includes(new Date().getDay())),
  );
  //console.log('pending중인 미션', pendingMission);
  if (typeof doingMission !== 'undefined') {
    return (
      <Container>
        {/* <Text
          style={
            styles.infoLeftOver
          }>{`오늘 진행할 미션이 ${pendingMission.length}개 있습니다.`}</Text> */}
        <Info1>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={[styles.type1, {marginRight: 5}]}>
              {doingMission.category}
            </Text>
            <Text style={styles.type2}>| {doingMission.name}</Text>
          </View>

          {/* <Text style={styles.info1}>
              전체 <Text>123</Text>명 · 친구 <Text>3</Text>명이 함께함
            </Text> */}
        </Info1>
        <Info2>
          <Text style={styles.info2}>
            🔒 <Text style={{fontWeight: '500'}}>1:30:23</Text>{' '}
            <Text style={{fontSize: 20}}>경과</Text>
          </Text>
          <Text style={styles.info3}>
            📵 <Text style={{fontWeight: '500'}}>0:17:23 </Text>
            <Text style={{fontSize: 20}}>사용</Text>
          </Text>
          <Text style={styles.info4}>
            🕒 <Text style={{fontWeight: 'bold'}}>3시간</Text>{' '}
            <Text style={{fontWeight: 'bold'}}>15분 뒤 · </Text>🦵{' '}
            <Text style={{fontWeight: 'bold'}}>3km 이동 시 </Text>
            <Text style={{fontSize: 17, textAlign: 'center'}}>
              잠금이 해제될 수 있습니다.
            </Text>
          </Text>
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
                          Goal.schema,
                          Place.schema,
                          ProhibitedApp.schema,
                          UserInfo.schema,
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
