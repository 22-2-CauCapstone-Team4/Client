import React, {useState, useEffect} from 'react';
import styled from 'styled-components/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Text, View} from 'react-native';
import MissionBox from '../box/MissionBox';
import Categories from '../Categories';
import OngoingBox from '../box/OngoingBox';
import CreateMissionModal from '../modal/CreateMissionModal';
import {styles} from '../../utils/styles';
import {useSelector, useDispatch} from 'react-redux';
const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;
const AboutMission = styled.View`
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

// 미션 더미 데이터에 있는 날짜와 현재 날짜 비교하는 함수
function compareToday(date) {
  return (
    new Date(date).getFullYear() +
      '-' +
      new Date(date).getMonth() +
      '-' +
      new Date(date).getDate() ===
    new Date().getFullYear() +
      '-' +
      new Date().getMonth() +
      '-' +
      new Date().getDate()
  );
}

const HomeTab = ({navigation}) => {
  const dispatch = useDispatch();
  const missionData = useSelector(store => store.missionReducer.missionData);
  const place = useSelector(store => store.spaceReducer.data);
  const today = new Date();
  //오늘 날짜
  const todayDate =
    today.getFullYear() + '-' + today.getMonth() + '-' + today.getDate();
  // 오늘 미션 개수
  const todayMissionNumber = missionData.filter(el =>
    compareToday(el.date),
  ).length;
  const [mission, setMission] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);

  return (
    // 미션 중 화면 채택시 Container 자체를 바꿔야 할 듯
    <View style={styles.tabContainer}>
      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text style={{color: mission ? 'black' : '#38a6c0'}}>오늘 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text style={{color: mission ? '#38a6c0' : 'black'}}>진행 중</Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>
        {mission ? `진행중 | 0` : `오늘 미션 | ${todayMissionNumber}`}
      </MainText>
      {/* 미션 | 뒤에 0은 나중에 데이터를 받아서 count 값을 넣어주면 될듯 */}

      {/* 디비 데이터 받아와서 카테고리, 미션 이름을 뿌려주면 될 것 같다? */}
      {mission ? (
        <OngoingBox />
      ) : (
        <ScrollViews>
          <MissionList>
            {/* 시간 공간미션 따로 보여주자 */}
            {missionData
              .filter(el => compareToday(el.date))
              .map(mission => {
                return (
                  <MissionBox
                    key={mission.id}
                    category={mission.category}
                    missionName={mission.name}></MissionBox>
                );
              })}
          </MissionList>
        </ScrollViews>
      )}
      <View style={styles.centeredView}>
        <CreateMissionModal
          navigation={navigation}
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}></CreateMissionModal>
      </View>
      <AddMissionBtn onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddMissionBtn>
    </View>
  );
};

export default HomeTab;
