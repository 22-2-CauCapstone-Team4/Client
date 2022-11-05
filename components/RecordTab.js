import Categories from './Categories';
import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native';
import OngoingBox from './box/OngoingBox';
const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const Info1 = styled.View`
  align-items: center;
  margin-top: 40px;
`;
const Info2 = styled.View`
  align-items: center;
  margin-top: 30px;
`;
const Btn = styled.View`
  flex-direction: row;
  justify-content: space-evenly;
`;
const RecordTab = () => {
  return (
    <Container>
      <Categories />
    </Container>
  );
};

export default RecordTab;
