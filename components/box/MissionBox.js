import React, {useState, useEffect, useRef} from 'react';
import {
  Text,
  View,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import styled from 'styled-components/native';
import Geolocation from 'react-native-geolocation-service';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {useDispatch, useSelector} from 'react-redux';

import Colors from '../../utils/Colors';
import {compareTimeBeforeStart, timeInfoText} from '../../functions/time';
import {updateTodayMission} from '../../store/action';
import {getDistance} from '../../functions/space';
import {mkConfig, toggleMissionActiveInRealm} from '../../functions';
import {TodayMission, Mission, Place, Goal} from '../../schema';
import Realm from 'realm';
import {useAuth} from '../../providers/AuthProvider';
import {usePropsResolution} from 'native-base';

/*
README 11.27
작성자: 한신
todayMissionReducer에 저장되는 데이터에
range와 state가 없는 것 같아 임시로 잡아두고 진행 중
state는 총 4가지가 있고 아래에 세부 설명 있습니다.
range는 추후에 반영되면 간단하게 수정 가능
state같은 경우 DB에 반영할 때 dispatch(updateMission(...)); 써진 코드에
DB에 반영할 코드를 추가하면 될 것 같다.
'temp'라는 업데이트 된 미션 배열 데이터가 마련되어 있다.
** 설정한 state 종류 **
none: 초기 상태, 미션 시작 전 상태, 미션 조건 만족했는데 진행 중인 미션이 있어서 대기 중인 상태, 
생성된 시간 미션이 이미 시간이 지난 상태
start: 미션 진행 중, !!미션 1개만 이 state를 가질 수 있음!!
10분 휴식 버튼 눌러도 start 상태로 유지, 다른 상태 변화가 필요하면 수정하도록 하겠습니다.
end: 정상적으로 미션을 완료한 상태, UI에서 종료 미션으로 따로 빼둠
quit: 중도 포기한 상태, 포기한 미션은 재시작이 불가능하다.
*/

function MissionBox(props) {
  const {user} = useAuth();

  const dispatch = useDispatch();
  // console.log(userState);
  // console.log('미션 정보', props.mission);
  const [isEnabled, setIsEnabled] = useState(props.mission.isActive);
  const toggleSwitch = () => {
    Realm.open(
      mkConfig(user, [
        TodayMission.schema,
        Mission.schema,
        Place.schema,
        Goal.schema,
      ]),
    ).then(async realm => {
      await toggleMissionActiveInRealm(user, realm, props.mission.id);
      dispatch(updateTodayMission({...props.mission, isActive: !isEnabled}));
      realm.close();
    });

    setIsEnabled(!isEnabled);
  };
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
  const missionData = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  );
  const [missionState, setMissionState] = useState(props.mission.state); //props.mission.state

  useEffect(() => {
    sixty.current = setTimeout(() => {
      //시간 미션일 때 미션 시작까지 남은 시간 + 종료 시간까지 남은 시간 계산
      if (props.mission.type !== 'IN_PLACE') {
        setLeftTime(compareTimeBeforeStart(props.mission.time.startTime));
        setEndMissionTime(compareTimeBeforeStart(props.mission.time.endTime));
      }
    }, 1000);
    // update할 미션 배열 데이터
    let temp = missionData.slice();
    // 공간 미션에서의 장소와 현재 위치간 거리
    let distance;
    let range;
    if (props.mission.type === 'IN_PLACE' && missionLocation.length != 0) {
      distance =
        getDistance(
          missionLocation[0].lat,
          missionLocation[0].lng,
          currentLocation.latitude,
          currentLocation.longitude,
        ) * 1000;
      range = missionLocation[0].range * 1000;
    }
    // 미션 상태 관리 시작
    //none -> start
    //조건: 토글 켜져있고 진행 중인 미션이 없을 때 start로 전환
    if (
      props.mission.state === 'none' &&
      isEnabled
      // && missionData.filter(item => item.state === 'start').length == 0
    ) {
      if (missionData.filter(item => item.state === 'start').length === 0) {
        temp = {
          ...props.mission,
          state: 'start',
        };
      } else {
        temp = {
          ...props.mission,
          state: 'pending',
        };
      }
      // 시간 조건 확인: 1. 시작 시간이 된 상태 2. 뒤늦게 만든 시간 미션의 종료 시간이 지나지 않았을 때
      if (
        props.mission.type === 'TIME' &&
        leftTime[1] <= 0 &&
        (endMissionTime[0] > 0 || endMissionTime[1] > 0)
      ) {
        dispatch(updateTodayMission(temp));
      }
      // 공간 조건 확인: 안 미션은 안에 있을 때, 이동 미션은 밖에 있을 때
      else if (
        props.mission.type == 'IN_PLACE' &&
        distance < range
        // (props.mission.type == 'MOVE_PLACE' && distance > range)
      ) {
        dispatch(updateTodayMission(temp));
      } else if (
        (props.mission.type == 'MOVE_PLACE' ||
          props.mission.type == 'BOTH_PLACE') &&
        leftTime[1] <= 0
      ) {
        dispatch(updateTodayMission(temp));
      }
    }
    //start -> over(정상 종료)
    //start -> quit는 포기 버튼 onPress에서 따로 처리됨
    //조건: {시간: 종료 시간까지 채움, 공간: 공간에서 벗어남(IN_PLACE) or 들어옴(MOVE_PLACE)}
    // pending -> none (걍 아무 일도 벌어지지 않았던 것이므로)
    else if (
      props.mission.state === 'start' ||
      props.mission.state === 'pending'
    ) {
      if (props.mission.state === 'start') {
        temp = {
          ...props.mission,
          state: 'over',
        };
      } else {
        temp = {
          ...props.mission,
          state: 'none',
        };
      }
      //시간 조건 확인
      if (
        props.mission.type === 'TIME' &&
        endMissionTime[0] <= 0 &&
        endMissionTime[1] <= 0
      ) {
        dispatch(updateTodayMission(temp));
      }
      //공간 조건 확인: 안 미션은 벗어날 때, 이동 미션은 들어올 때
      else if (
        (props.mission.type == 'IN_PLACE' && distance > range) ||
        (props.mission.type == 'MOVE_PLACE' && distance < range)
      ) {
        dispatch(updateTodayMission(temp));
      }
    }
    // over -> start
    // 공간 미션이 끝났는데 또 조건 만족하면 발동
    // 시간 미션은 종료 시간이 정해져 있으니까 그대로 over로 유지된다 (검사 자체를 안 함)
    else if (props.mission.state === 'over') {
      temp = {
        ...props.mission,
        state: 'start',
      };
      //공간 조건 확인: none->start와 동일
      if (
        (props.mission.type == 'IN_PLACE' && distance < range) ||
        (props.mission.type == 'MOVE_PLACE' && distance > range)
      ) {
        dispatch(updateTodayMission(temp));
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
    switch (props.mission.state) {
      case 'none':
        // 뒤늦게 생성됐지만 종료 시간이 지나 시작할 수 없는 미션 처리
        if (
          props.mission.type === 'TIME' &&
          endMissionTime[0] <= 0 &&
          endMissionTime[1] <= 0
        ) {
          return (
            <LeftCondition style={{color: 'brown'}}>
              시간이 지나 시작할 수 없습니다...
            </LeftCondition>
          );
        } else {
          if (leftTime[1] > 0) {
            return (
              <LeftCondition>
                {leftTime[0] == 0 ? null : leftTime[0] + '시간'} {leftTime[1]}분
                후 시작
              </LeftCondition>
            );
          } else {
            return <LeftCondition>미션 대기 중</LeftCondition>;
          }
        }

      case 'start':
        return (
          <LeftCondition style={{color: 'orange'}}>미션 진행 중</LeftCondition>
        );
      case 'pending':
        return (
          <LeftCondition style={{color: 'purple'}}>미션 대기</LeftCondition>
        );
      case 'over':
        return (
          <View>
            <LeftCondition style={{color: 'green'}}>미션 완료!</LeftCondition>
            <LeftCondition style={{color: 'green'}}>
              기록 탭에서 결과를 확인해보세요!
            </LeftCondition>
          </View>
        );
      case 'quit':
        return (
          <LeftCondition style={{color: 'grey'}}>미션 포기..</LeftCondition>
        );
      default:
        console.log('미션 상태 변화에 문제 발생');
    }
  }
  function spaceStateMessage() {
    if (missionLocation.length == 0) {
      return <LeftCondition>거리 계산 중</LeftCondition>;
    } else {
      const distance = getDistance(
        missionLocation[0].lat,
        missionLocation[0].lng,
        currentLocation.latitude,
        currentLocation.longitude,
      );
      if (isNaN(distance) && props.mission.state === 'none')
        return <LeftCondition>거리 계산 중</LeftCondition>;
      else {
        switch (props.mission.state) {
          case 'none':
            return distance > 1 ? (
              <LeftCondition>{distance}km 남음</LeftCondition>
            ) : (
              <LeftCondition>{distance * 1000}m 남음</LeftCondition>
            );
          case 'start':
            return (
              <LeftCondition style={{color: 'orange'}}>
                미션 진행 중
              </LeftCondition>
            );
          case 'pending':
            return (
              <LeftCondition style={{color: 'purple'}}>미션 대기</LeftCondition>
            );
          case 'over':
            return (
              <LeftCondition style={{color: 'red'}}>미션 종료</LeftCondition>
            );
          case 'quit':
            return (
              <LeftCondition style={{color: 'grey'}}>미션 포기..</LeftCondition>
            );
          default:
            console.log('미션 상태 변화에 문제 발생');
        }
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
          <LeftCondition>
            {props.mission.type !== Mission.TYPE.IN_PLACE
              ? timeStateMessage()
              : spaceStateMessage()}
          </LeftCondition>
        </LeftView>
      </ContentContainer>
      <ConditionView>
        {props.mission.type === 'TIME' ? (
          <View>
            <Ionicons name={'lock-closed'} size={14} style={styles.timeIcon}>
              <Text style={{color: Colors.MAIN_COLOR, marginHorizontal: 5}}>
                시작: {timeInfoText(props.mission.time.startTime)}
              </Text>
            </Ionicons>

            <Ionicons name={'lock-open'} size={14} style={styles.timeIcon}>
              <Text style={{color: Colors.MAIN_COLOR}}>
                종료: {timeInfoText(props.mission.time.endTime)}
              </Text>
            </Ionicons>
          </View>
        ) : (
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.info}>장소: {props.mission.space} |</Text>
            <Text style={[styles.info]}>
              {props.mission.type === 'IN_PLACE'
                ? ' 안'
                : props.mission.type === 'MOVE_PLACE'
                ? ' 이동'
                : ' 이동 + 안'}
            </Text>
          </View>
        )}
        {/* 하단 처리 */}
        {/*종료시간 지나지 않은 시간 미션 + 조건 만족 못한 공간 미션 + 완료한 공간 미션은 토글 표시*/}
        {(props.mission.state === 'none' &&
          props.mission.type === 'TIME' &&
          endMissionTime[1] > 0) ||
        (props.mission.state === 'none' && props.mission.type !== 'TIME') ||
        (props.mission.state === 'over' && props.mission.type !== 'TIME') ? (
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text
              style={{
                color: isEnabled ? Colors.MAIN_COLOR : 'grey',
                fontSize: 12,
                marginRight: 7,
              }}>
              {isEnabled ? '활성화' : '비활성화'}
            </Text>
            <Switch
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.2}]}}
              trackColor={{false: '#767577', true: Colors.MAIN_COLOR}}
              thumbColor={isEnabled ? '#ffffff' : '#222222'}
              onValueChange={toggleSwitch}
              value={isEnabled}></Switch>
          </View>
        ) : null}
        {props.mission.state === 'start' ? (
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity
              style={[styles.quitBtn, {marginRight: 5}]}
              onPress={() => {
                Alert.alert(
                  '10분 사용',
                  '제한한 어플을 10분동안 사용할 수 있습니다.',
                  [
                    {
                      text: '사용',
                    },
                    {
                      text: '취소',
                    },
                  ],
                );
              }}>
              <Text style={{color: Colors.MAIN_COLOR, fontSize: 10}}>
                10분 사용
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.quitBtn}
              onPress={() => {
                const temp = {
                  ...props.mission,
                  state: 'quit',
                };
                Alert.alert('미션 포기!', '정말 미션을 포기하시겠습니까?', [
                  {
                    text: '포기',
                    onPress: () => {
                      dispatch(updateTodayMission(temp));
                    },
                  },
                  {
                    text: '취소',
                  },
                ]);
              }}>
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
    // fontSize: 12,
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
  font-size: 11px;
  text-align: right;
`;
