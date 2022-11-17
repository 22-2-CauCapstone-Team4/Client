import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Switch} from 'react-native';
import styled from 'styled-components/native';
import Colors from '../../utils/Colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {compareTimeBeforeStart, timeInfoText} from '../../functions/time';

function MissionBox(props) {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  const [leftTime, setLeftTime] = useState(
    compareTimeBeforeStart(props.mission.time.startTime),
  );
  const [endMissionTime, setEndMissionTime] = useState(
    compareTimeBeforeStart(props.mission.time.endTime),
  );
  const sixty = useRef(new Date().getUTCSeconds());
  useEffect(() => {
    sixty.current = setTimeout(() => {
      if (props.mission.type === 'time') {
        setLeftTime(compareTimeBeforeStart(props.mission.time.startTime));
        setEndMissionTime(compareTimeBeforeStart(props.mission.time.endTime));
      }
    }, 1000);
  }, [leftTime]);

  function missionStateMessage() {
    // 미션 시작 시간 전
    if (leftTime[0] > 0 || leftTime[1] > 0) {
      return (
        <LeftCondition>
          {leftTime[0] == 0 ? null : leftTime[0] + '시간'} {leftTime[1]} 분 후
          시작
        </LeftCondition>
      );
    } else {
      // 미션 시작 시간 이후 ~ 미션 종료 시간
      if (endMissionTime[0] > 0 || endMissionTime[1] > 0) {
        return (
          <LeftCondition style={{color: 'orange'}}>미션 진행 중</LeftCondition>
        );
        // 미션 종료 시간 이후
      } else {
        return <LeftCondition style={{color: 'red'}}>미션 종료</LeftCondition>;
      }
    }
  }

  return (
    <Container>
      <ContentContainer>
        <View>
          <ContentView>
            <Category>{props.mission.category}</Category>
            <Category>|</Category>
            <MissionName>{props.mission.name}</MissionName>
          </ContentView>
        </View>
        <LeftView>
          {props.mission.type === 'time' ? missionStateMessage() : null}
        </LeftView>
      </ContentContainer>
      <ConditionView>
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
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text
            style={{
              color: isEnabled ? Colors.MAIN_COLOR : 'grey',
              marginRight: 7,
            }}>
            {isEnabled ? 'ON' : 'OFF'}
          </Text>
          <Switch
            style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
            trackColor={{false: '#767577', true: Colors.MAIN_COLOR}}
            thumbColor={isEnabled ? '#ffffff' : '#222222'}
            onValueChange={toggleSwitch}
            value={isEnabled}></Switch>
        </View>
      </ConditionView>
    </Container>
  );
}

export default MissionBox;

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
  height: 120px;
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
  align-items: center;
`;

const ContentView = styled.View`
  width: 180px;
  height: 75px;
  flex-direction: row;
  display: flex;
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

const LeftView = styled.View`
  position: absolute;
  right: 0;
`;

const LeftCondition = styled.Text`
  color: #0891b2;
  font-size: 12px;
`;
