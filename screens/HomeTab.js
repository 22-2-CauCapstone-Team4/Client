import React, {useState} from 'react';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Text, ScrollView} from 'react-native';
import AddBtn from './AddBtn';
import Categories from './Categories';

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 6%;
  right: 6.7%;
  background-color: #0891b2;
  border-radius: 600px;
`;
const AboutMission = styled.View`
  border: 1px solid #f1f1f1;
  border-radius: 600px;
  margin: 10px 0;
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
`;
const MissionList = styled.View`
  background-color: #fcfcfc;
  border-radius: 10px;
  border: 1px solid #ededed;
`;
const HomeTab = () => {
  const [mission, setMission] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);
  const [list, setList] = useState({});
  return (
    <Container>
      <Icon name={'log-out'} size={30} color={'black'} />
      <Categories />
      <AddMissionBtn>
        <Icon name="play-outline" size={40} color={'white'}></Icon>
      </AddMissionBtn>

      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text style={{color: mission ? 'black' : '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text style={{color: mission ? '#38a6c0' : 'black'}}>완료 미션</Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>{mission ? '완료 미션 | 0' : '예정 미션 | 0'}</MainText>
      {/* 미션 | 뒤에 0은 나중에 데이터를 받아서 count 값을 넣어주면 될듯 */}
      <ScrollView>
        <MissionList></MissionList>
      </ScrollView>
    </Container>
  );
};

export default HomeTab;
