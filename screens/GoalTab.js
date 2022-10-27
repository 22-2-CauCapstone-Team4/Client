import AddBtn from './AddBtn';
import React from 'react';
import Categories from './Categories';
import styled from 'styled-components';
import {TouchableOpacity, Text} from 'react-native';

const AboutMission = styled.View`
  border: 1px solid #ffffff;
  border-radius: 600;
  margin: 10px 30px 0 30px;
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
`;

const GoalTab = () => {
  return (
    <>
      <AddBtn />
      <Categories />
      <AboutMission>
        <TouchableOpacity>
          <Text style={{color: '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>미션 공간</Text>
        </TouchableOpacity>
      </AboutMission>
    </>
  );
};

export default GoalTab;
