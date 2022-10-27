import React, {useState} from 'react';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {TouchableOpacity, Text} from 'react-native';
import AddBtn from './AddBtn';
import Categories from './Categories';

const Container = styled.View`
  height: 100%;
`;
const AddMissionBtn = styled.TouchableOpacity`
  position: absolute;
  bottom: 5%;
  right: 5%;
  background-color: #0891b2;
  border-radius: 600;
`;
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

const HomeTab = () => {
  return (
    <>
      <AddMissionBtn>
        <Ionicons name="play" size={50} color={'white'}></Ionicons>
      </AddMissionBtn>
      <Categories />
      <AboutMission>
        <TouchableOpacity>
          <Text style={{color: '#38a6c0'}}>예정 미션</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text>완료 미션</Text>
        </TouchableOpacity>
      </AboutMission>
    </>
  );
};

export default HomeTab;
