// 목표 탭에서 전체목표가 아닌 특정 카테고리를 눌렀을 때 표시되는 해당 카테고리 미션 컴포넌트

import React from 'react';
import {Text, View, StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../utils/Colors';
import {compareTimeBeforeStart, timeInfoText} from '../../functions/time';

function GoalBox(props) {
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
              // backgroundColor: 'black',
            }}>
            <ContentView>
              <Category>{props.mission.category}</Category>
              <Category>|</Category>
              <MissionName>{props.mission.name}</MissionName>
              <Ionicons
                name={
                  props.mission.type === 'time'
                    ? 'timer-sharp'
                    : 'trail-sign-sharp'
                }
                style={{color: Colors.MAIN_COLOR, marginLeft: 10}}
                size={16}>
                {props.mission.type === 'time' ? '시간' : '공간'}
              </Ionicons>
            </ContentView>
            <TouchableOpacity>
              <Ionicons
                name={'settings-outline'}
                size={20}
                style={{
                  color: 'grey',
                  position: 'absolute',
                  left: 0,
                }}></Ionicons>
            </TouchableOpacity>
          </View>
        </ContentContainer>
      </View>

      <ConditionView>
        <Text style={styles.info}>진행 날짜: {props.mission.date}</Text>
        {props.mission.type === 'time' ? (
          <View>
            <Ionicons name={'lock-closed'} size={14} style={styles.timeIcon}>
              시작:
              <Text style={{color: Colors.MAIN_COLOR, marginHorizontal: 5}}>
                {timeInfoText(props.mission.time.startTime)}
              </Text>
            </Ionicons>

            <Ionicons name={'lock-open'} size={14} style={styles.timeIcon}>
              종료:
              <Text style={{color: Colors.MAIN_COLOR}}>
                {timeInfoText(props.mission.time.endTime)}
              </Text>
            </Ionicons>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.info}>장소: {props.mission.space.place} |</Text>
            <Text style={[styles.info, {marginLeft: 10}]}>
              {props.mission.space.type === 'inside' ? '안' : '밖'}
            </Text>
          </View>
        )}
        <Text style={{color: 'black'}}>{null}</Text>
      </ConditionView>
    </Container>
  );
}

export default GoalBox;

const styles = StyleSheet.create({
  info: {
    color: Colors.MAIN_COLOR,
    fontSize: 12,
  },
  timeIcon: {
    color: Colors.MAIN_COLOR,
    marginVertical: 2,
  },
});

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
`;

const Container = styled.View`
  height: 140px;
  width: 100%;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
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
  padding: 5px 5px;
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
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
