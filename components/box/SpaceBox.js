import React from 'react';
import {Text, View} from 'react-native';
import styled from 'styled-components/native';

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
`;

const Container = styled.View`
  height: 120px;
  width: 100%;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
`;

const ContentView = styled.View`
  width: 320px;
  height: 50px;
  flex-direction: row;
  display: flex;
`;

const SpaceView = styled.View`
  padding: 5px 15px;
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
`;

// 10자 이내로 제한
const Category = styled.Text`
  font-size: 15px;
  font-weight: bold;
  color: black;
  margin-right: 5px;
`;

// 25자 이내로 제한
const SpaceName = styled.Text`
  color: black;
`;

export default function SpaceBox(props) {
  return (
    <Container>
      <ContentContainer>
        <View>
          <ContentView>
            <Category>{props.category}</Category>
            <Category>|</Category>
            <Text style={{color: 'black'}}>{props.missionName}</Text>
          </ContentView>
        </View>
      </ContentContainer>
      <SpaceView>
        <SpaceName>흑석동</SpaceName>
      </SpaceView>
    </Container>
  );
}
