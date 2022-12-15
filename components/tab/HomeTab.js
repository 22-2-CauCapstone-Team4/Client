import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Text, View, StyleSheet} from 'react-native';

import MissionBox from '../box/MissionBox';
import Categories from '../Categories';
import OngoingBox from '../box/OngoingBox';
import CreateMissionModal from '../modal/CreateMissionModal';
import {useSelector, useDispatch} from 'react-redux';
import {compareToday} from '../../functions/time';
import Colors from '../../utils/Colors';
import Geolocation from 'react-native-geolocation-service';

// 미션 더미 데이터에 있는 날짜와 현재 날짜 비교하는 함수
const HomeTab = ({navigation}) => {
  const dispatch = useDispatch();
  const missionData = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  );

  const [myLocation, setMyLocation] = useState({});

  // 오늘 미션
  let todayMission = missionData;
  const todayTimeMission = todayMission.filter(el => el.type === 'TIME');
  const todaySpaceMission = todayMission.filter(el => el.type !== 'TIME');
  const doingMission = useSelector(
    store => store.todayMissionReducer.todayMissionData,
  ).filter(item => item.state == 'start')[0];
  const [mission, setMission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);
  //console.log('홈탭만 바뀌나요?', doingMission);
  useEffect(() => {}, [doingMission]);

  useEffect(() => {
    const timeOutId = setInterval(() => {
      Geolocation.getCurrentPosition(
        position => {
          const {latitude, longitude} = position.coords;
          // 현재위치 좌표뽑기
          //console.log(position.coords);
          setMyLocation({latitude: latitude, longitude: longitude});
        },
        error => {
          console.log(error.message);
        },
        {enableHighAccuracy: true, timeout: 15000, maximumAge: 10000},
      );
    }, 1000);
    return () => clearInterval(timeOutId);
  }, []);

  return (
    <View style={styles.tabContainer}>
      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text
            style={{
              color: mission ? 'black' : '#38a6c0',
              fontSize: 16,
              fontWeight: mission ? '400' : '600',
            }}>
            오늘 미션
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text
            style={{
              color: mission ? '#38a6c0' : 'black',
              fontSize: 16,
              fontWeight: mission ? '600' : '400',
            }}>
            진행 중
          </Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>
        {mission ? `진행 중` : `오늘 미션 | ${todayMission.length}`}
      </MainText>
      <View style={styles.lineStyle}></View>
      {mission ? (
        <OngoingBox />
      ) : (
        <ScrollViews>
          <MissionList>
            <View style={styles.missionTypeView}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name={'timer-sharp'}
                  style={{color: Colors.MAIN_COLOR}}
                  size={24}></Ionicons>
                <Text style={styles.missionTypeText}>
                  시간 미션 | {todayTimeMission.length}
                </Text>
              </View>
            </View>

            {todayTimeMission.map(mission => {
              // console.log(mission, mission.id);
              return (
                <MissionBox key={mission.id} mission={mission}></MissionBox>
              );
            })}
            <View style={styles.lineStyle}></View>
            <View style={styles.missionTypeView}>
              <View style={{flexDirection: 'row'}}>
                <Ionicons
                  name={'trail-sign-sharp'}
                  style={{color: Colors.MAIN_COLOR}}
                  size={24}></Ionicons>
                <Text style={styles.missionTypeText}>
                  공간 미션 | {todaySpaceMission.length}
                </Text>
              </View>
              <View style={{flexDirection: 'row'}}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('WatchMyLocation', {data: myLocation});
                  }}>
                  <Ionicons
                    name={'navigate-circle'}
                    size={20}
                    color={Colors.MAIN_COLOR}></Ionicons>
                </TouchableOpacity>
                <Text style={{color: Colors.MAIN_COLOR}}>위치확인</Text>
              </View>
            </View>

            {todaySpaceMission.map(mission => {
              return (
                <MissionBox key={mission.id} mission={mission}></MissionBox>
              );
            })}
          </MissionList>
          {todayMission.length == 0 ? (
            <View style={{alignItems: 'center', marginTop: 30}}>
              <Text style={{color: Colors.MAIN_COLOR, fontSize: 20}}>
                목표 탭에서 미션을 추가하세요
              </Text>
            </View>
          ) : null}
        </ScrollViews>
      )}
      <View style={styles.centeredView}>
        <CreateMissionModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}></CreateMissionModal>
      </View>
      {/* <AddMissionBtn onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddMissionBtn> */}
    </View>
  );
};

export default HomeTab;

const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;
const AboutMission = styled.View`
  margin-top: 20px;
  border: 1px solid #f1f1f1;
  border-radius: 600px;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background-color: #fcfcfc;
  height: 30px;
`;
const MainText = styled.Text`
  color: #373737;
  font-size: 20px;
  font-weight: bold;
  margin: 15px 0;
`;
const MissionList = styled.View`
  background-color: #ffffff;
`;
const ScrollViews = styled.ScrollView``;

const styles = StyleSheet.create({
  missionTypeView: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 3,
    justifyContent: 'space-between',
  },
  tabContainer: {
    height: '100%',
    backgroundColor: 'white',
    padding: 20,
  },

  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },

  // 경계선
  lineStyle: {
    borderWidth: 0.5,
    borderColor: Colors.MAIN_COLOR_INACTIVE,
    margin: 10,
    backgroundColor: Colors.MAIN_COLOR_INACTIVE,
  },

  missionTypeText: {
    color: 'black',
    fontSize: 16,
    fontWeight: 'bold',
    marginVertical: 5,
  },
});
