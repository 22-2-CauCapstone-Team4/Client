import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {baseFontSize} from 'native-base/lib/typescript/theme/tools';

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
`;

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  justify-contents: center;
  align-items: center;
`;

const FriendContainer = styled.View`
  justify-contents: center;
  align-items: center;
  height: 150px;
  width: 60px;
  margin: 15px 5px;
`;

const MissionContainer = styled.View`
  height: 150px;
  width: 270px;
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

function FriendBox(props) {
  return (
    <Container>
      <FriendContainer>
        <TouchableOpacity
          style={{
            borderColor: Colors.MAIN_COLOR,
            borderRadius: 45,
            borderWidth: 1,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Icon name="person" color="green" size={40}></Icon>
        </TouchableOpacity>
        <Text style={{color: 'black'}}>User01</Text>
      </FriendContainer>

      <MissionContainer>
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
          <Text style={{color: 'black', size: 1}}>금지 앱 사용 중</Text>
        </ConditionView>
      </MissionContainer>
    </Container>
  );
}

export default FriendBox;