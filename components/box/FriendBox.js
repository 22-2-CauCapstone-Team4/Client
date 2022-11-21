import React from 'react';
import {Text, View, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import Icon from 'react-native-vector-icons/Ionicons';
import Colors from '../../utils/Colors';
import {baseFontSize} from 'native-base/lib/typescript/theme/tools';

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
        <Text style={{color: 'black'}}>{props.name}</Text>
      </FriendContainer>

      <MissionContainer>
        <ContentContainer>
          <View>
            <ContentView>
              <Category>✏️수업</Category>
              <Category>|</Category>
              <MissionName>모바일 앱</MissionName>
            </ContentView>
          </View>
        </ContentContainer>
        <ConditionView>
          <Text
            style={{
              color:
                props.state === 'lock'
                  ? Colors.MAIN_COLOR
                  : props.state === 'unlock'
                  ? 'orange'
                  : 'red',
              size: 1,
            }}>
            {props.state === 'lock'
              ? '미션 진행 중'
              : props.state === 'unlock'
              ? '금지 앱 사용 중'
              : '포기'}
          </Text>
        </ConditionView>
      </MissionContainer>
    </Container>
  );
}

export default FriendBox;

const Container = styled.View`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

const ContentContainer = styled.View`
  width: 100%;
  margin-top: 5px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const FriendContainer = styled.View`
  justify-content: center;
  align-items: center;
  height: 100px;
  width: 60px;
  margin: 15px 5px;
`;

const MissionContainer = styled.View`
  height: 100px;
  width: 270px;
  border: 1px solid #f1f1f1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
`;

const ContentView = styled.View`
  width: 180px;
  height: 40px;
  flex-direction: row;
  display: flex;
  flex-wrap: wrap;
`;

const ConditionView = styled.View`
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
