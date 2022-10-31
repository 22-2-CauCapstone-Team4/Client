import AddBtn from './AddBtn';
import React, {useState} from 'react';
import Categories from './Categories';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Text, ScrollView} from 'react-native';

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
const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  border-radius: 600px;
`;
const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
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
const GoalTab = () => {
  const [mission, setMission] = useState(false);
  const clickMission1 = () => setMission(false);
  const clickMission2 = () => setMission(true);
  return (
    <Container>
      <AddMissionBtn>
        <Ionicons name="add-circle" size={50} color={'#0891b2'} />
      </AddMissionBtn>
      <Categories />
      <AboutMission>
        <TouchableOpacity onPress={clickMission1}>
          <Text style={{color: mission ? 'black' : '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clickMission2}>
          <Text style={{color: mission ? '#38a6c0' : 'black'}}>미션 공간</Text>
        </TouchableOpacity>
      </AboutMission>
      <MainText>{mission ? '미션 공간 | 0' : '예정 미션 | 0'}</MainText>
      <ScrollView>
        <MissionList></MissionList>
      </ScrollView>
    </Container>
  );
};

export default GoalTab;
