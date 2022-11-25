import React, {useState, useEffect, useRef} from 'react';
import {Text, View, StyleSheet, Switch, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';

import Colors from '../../utils/Colors';
import {compareTimeBeforeStart, timeInfoText} from '../../functions/time';
import {useDispatch, useSelector} from 'react-redux';
import {getDistance} from '../../functions/space';

function MissionBox(props) {
  const [isEnabled, setIsEnabled] = useState(true);
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);
  //TIME
  const [leftTime, setLeftTime] = useState(
    compareTimeBeforeStart(props.mission.time.startTime),
  );
  const [endMissionTime, setEndMissionTime] = useState(
    compareTimeBeforeStart(props.mission.time.endTime),
  );
  const sixty = useRef(new Date().getUTCSeconds());
  //SPACE
  const missionLocation = useSelector(store => store.placeReducer.data).filter(
    place => place.name === props.mission.space,
  );
  const [currentLocation, setCurrentLocation] = useState({});
  const [missionState, setMissionState] = useState('none'); //props.mission.state
  const missionData = useSelector(store => store.missionReducer.missionData);
  useEffect(() => {
    sixty.current = setTimeout(() => {
      if (props.mission.type === 'TIME') {
        setLeftTime(compareTimeBeforeStart(props.mission.time.startTime));
        setEndMissionTime(compareTimeBeforeStart(props.mission.time.endTime));
      }
    }, 1000);
    // console.log('sixty', sixty);
    // 미션 진행 중으로 상태 변화
    if (missionState === 'none' && isEnabled) {
      if (props.mission.type === 'TIME' && leftTime[1] <= 0) {
        setMissionState('start');
      } else if (
        props.mission.type !== 'TIME' &&
        missionLocation.length != 0 &&
        getDistance(
          missionLocation[0].lat,
          missionLocation[0].lng,
          currentLocation.latitude,
          currentLocation.longitude,
        ) *
          1000 -
          50 <
          0
      ) {
        setMissionState('start');
      }
    }
  }, [leftTime, currentLocation]);
  useEffect(() => {
    //console.log('is created');
    const watchId = Geolocation.watchPosition(
      position => {
        const {latitude, longitude} = position.coords;
        if (props.mission.type !== 'TIME') {
          setCurrentLocation({latitude, longitude});
        }
      },
      error => {
        console.log(error.message);
      },
      {
        enableHighAccuracy: true,
        distanceFilter: 0,
        interval: 2000,
        fastestInterval: 2000,
      },
    );
    return () => {
      if (watchId != null) {
        Geolocation.clearWatch(watchId);
        //console.log('is deleted');
      }
    };
  }, []);

  function timeStateMessage() {
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
  const db = useSelector(store => store.placeReducer.data);
  function spaceStateMessage() {
    // console.log('디비');
    // console.log(db);
    // console.log('미션 장소 정보');
    // console.log(missionLocation);
    if (missionLocation.length == 0) {
      return <LeftCondition>거리 계산 중</LeftCondition>;
    } else {
      const distance = getDistance(
        missionLocation[0].lat,
        missionLocation[0].lng,
        currentLocation.latitude,
        currentLocation.longitude,
      );
      if (isNaN(distance)) return <LeftCondition>거리 계산 중</LeftCondition>;
      else if (missionState === 'none') {
        return distance > 1 ? (
          <LeftCondition>{distance}km 남음</LeftCondition>
        ) : (
          <LeftCondition>{distance * 1000}m 남음</LeftCondition>
        );
      } else if (missionState === 'start') {
        return (
          <LeftCondition style={{color: 'orange'}}>미션 진행 중</LeftCondition>
        );
      }
    }
  }
  // console.log(missionState);
  // console.log(props.mission.state);
  // console.log('미션 상태', missionState);
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
          {props.mission.type === 'TIME'
            ? timeStateMessage()
            : spaceStateMessage()}
        </LeftView>
      </ContentContainer>
      <ConditionView>
        {props.mission.type === 'TIME' ? (
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
            <Text style={styles.info}>장소: {props.mission.space} |</Text>
            <Text style={[styles.info, {marginLeft: 10}]}>
              {props.mission.type === 'IN_PLACE'
                ? '안'
                : props.mission.type === 'MOVE_PLACE'
                ? '이동'
                : '이동 + 안'}
            </Text>
          </View>
        )}
        {missionState === 'none' ? (
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
        ) : null}
        {missionState === 'start' ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity style={[styles.quitBtn, {marginRight: 5}]}>
              <Text style={{color: Colors.MAIN_COLOR, fontSize: 10}}>
                10분 사용
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quitBtn}>
              <Text style={{color: Colors.MAIN_COLOR, fontSize: 10}}>포기</Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </ConditionView>
    </Container>
  );
}

export default MissionBox;

const styles = StyleSheet.create({
  quitBtn: {
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
    alignItems: 'center',
    justifyContent: 'center',
    width: 55,
    height: 25,
    borderRadius: 25,
  },
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
  padding: 0px 0px 10px 0px;
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
