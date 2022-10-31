import React from 'react';
import {Text, View, TextInput} from 'react-native';
import styled from 'styled-components/native';

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
`;

const Container = styled.View`
  height: 180px;
  width: 100%;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
`;

const ContentView = styled.View`
  width: 180px;
  height: 75px;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
`;

const ConditionView = styled.View`
  margin-top: 20px;
  padding: 5px 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
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

// const Comment = styled.TextInput`
//   background-color: '#fcfcfc';
//   border-color: '#000000';
//   border: 1px solid black;
//   color: 'black';
// `;

function GoalBox(props) {
  return (
    <Container>
      <ContentContainer>
        <View>
          <ContentView>
            <Category>{props.category}</Category>
            <Category>|</Category>
            <MissionName>{props.missionName}</MissionName>
          </ContentView>
        </View>
      </ContentContainer>
      <ConditionView>
        <Text style={{color: 'black'}}>-</Text>
        <Text style={{color: 'black'}}>-</Text>
        <Text style={{color: 'black'}}>-</Text>
      </ConditionView>
    </Container>
  );
}

export default GoalBox;
