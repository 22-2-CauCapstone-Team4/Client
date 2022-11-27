// 목표 탭에서 전체목표가 아닌 특정 카테고리를 눌렀을 때 표시되는 해당 카테고리 미션 컴포넌트

import React, {useState} from 'react';
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import {Mission, Goal, Place} from '../../schema';
import Colors from '../../utils/Colors';
import {deleteMission} from '../../store/action';
import {compareTimeBeforeStart, timeInfoText} from '../../functions/time';
import GoalBoxSettingModal from '../modal/GoalBoxSettingModal';
import Realm from 'realm';
import {deleteMissionInRealm} from '../../functions';
import {mkConfig} from '../../functions/mkConfig';
import {useAuth} from '../../providers/AuthProvider';

function GoalBox(props) {
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const missionData = useSelector(store => store.missionReducer.missionData);
  const {user} = useAuth();
  // console.log('미션', missionData);
  return (
    <Container>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          // backgroundColor: 'red',
        }}>
        <ContentContainer>
          <View
            style={{
              width: '100%',
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            <ContentView>
              <Category>{props.mission.category}</Category>
              <Category>|</Category>
              <MissionName>{props.mission.name}</MissionName>
              <Ionicons
                name={
                  props.mission.type === Mission.TYPE.TIME
                    ? 'timer-sharp'
                    : 'trail-sign-sharp'
                }
                style={{color: Colors.MAIN_COLOR, marginLeft: 10}}
                size={16}>
                {props.mission.type === Mission.TYPE.TIME ? '시간' : '공간'}
              </Ionicons>
            </ContentView>
            <TouchableOpacity
              onPress={() => {
                Alert.alert(
                  '미션 삭제',
                  `미션 "${props.mission.name}" 을/를 삭제하시겠습니까?`,
                  [
                    {
                      text: '삭제',
                      onPress: () => {
                        dispatch(
                          deleteMission(
                            missionData.filter(
                              item => item.id !== props.mission.id,
                            ),
                          ),
                        );

                        Realm.open(
                          mkConfig(user, [
                            Mission.schema,
                            Goal.schema,
                            Place.schema,
                          ]),
                        ).then(async realm => {
                          await deleteMissionInRealm(
                            user,
                            realm,
                            props.mission.id,
                          );

                          realm.close();
                        });
                      },
                    },
                    {text: '취소'},
                  ],
                );
              }}>
              <Ionicons name="trash" size={24} style={styles.icon}></Ionicons>
            </TouchableOpacity>
            {/* <TouchableOpacity onPress={() => setModalVisible(true)}>
              <Ionicons
                name={'settings-outline'}
                size={24}
                style={{
                  color: 'grey',
                }}></Ionicons>
            </TouchableOpacity> */}
          </View>
        </ContentContainer>
      </View>

      <ConditionView>
        <View>
          {props.mission.type !== Mission.TYPE.IN_PLACE && (
            <Ionicons name={'lock-closed'} size={14} style={styles.timeIcon}>
              <Text style={[{marginHorizontal: 5}]}>
                시작: {timeInfoText(props.mission.time.startTime)}
              </Text>
            </Ionicons>
          )}
          {props.mission.type === Mission.TYPE.TIME && (
            <Ionicons name={'lock-open'} size={14} style={styles.timeIcon}>
              <Text style={[{marginHorizontal: 20}]}>
                종료: {timeInfoText(props.mission.time.endTime)}
              </Text>
            </Ionicons>
          )}
          {props.mission.type !== Mission.TYPE.TIME && (
            <View style={{flexDirection: 'row'}}>
              <Text style={styles.info}>장소: {props.mission.space} |</Text>
              <Text style={[styles.info, {marginLeft: 3}]}>
                {props.mission.type === Mission.TYPE.IN_PLACE
                  ? '안'
                  : props.mission.type === Mission.TYPE.MOVE_PLACE
                  ? '이동'
                  : '이동 + 안'}
              </Text>
            </View>
          )}
        </View>
        <Ionicons name={'calendar'} size={14} style={styles.timeIcon}>
          <Text style={[{marginHorizontal: 10}]}> {props.mission.date}</Text>
        </Ionicons>
      </ConditionView>
      <GoalBoxSettingModal
        data={props.mission}
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}></GoalBoxSettingModal>
    </Container>
  );
}

export default GoalBox;

const styles = StyleSheet.create({
  icon: {
    color: Colors.GREY,
  },
  info: {
    color: Colors.MAIN_COLOR,
    fontSize: 12,
  },
  timeIcon: {
    color: Colors.MAIN_COLOR,
    marginVertical: 3,
  },
});

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
`;

const Container = styled.View`
  height: 120px;
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
  align-items: center;
`;

const ContentView = styled.View`
  width: 70%;
  // background-color: green;
  height: 50px;
  flex-direction: row;
  flex-wrap: wrap;
  align-items: center;
`;

const ConditionView = styled.View`
  padding: 10px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  position: absolute;
  bottom: 0px;
`;

// 10자 이내로 제한
const Category = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: black;
  margin-right: 5px;
`;

// 25자 이내로 제한
const MissionName = styled.Text`
  color: black;
`;
