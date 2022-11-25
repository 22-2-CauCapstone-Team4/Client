// 목표 탭에서 전체목표를 클릭했을 때 표시되는 카테고리별 묶음 컴포넌트
import React from 'react';
import {Text, View, TextInput} from 'react-native';
import styled from 'styled-components/native';

// 사용자가 설정한 카테고리 더미 데이터

// props:
export default function GoalCategoryBox(props) {
  return (
    <Container>
      <ContentContainer>
        <Category>{props.category}</Category>
        <Text style={{fontSize: 25, marginRight: 10, color: 'black'}}> | </Text>
        <MissionNumber>{props.number}</MissionNumber>
        {props.category === '⭐ 전체 목표' && props.number === 0 ? (
          <Text
            style={{
              position: 'absolute',
              right: 0,
              color: 'red',
              fontSize: 10,
            }}>
            미션을 추가하세요!
          </Text>
        ) : null}
      </ContentContainer>
    </Container>
  );
}

const ContentContainer = styled.View`
  width: 100%;
  height: 70px;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Container = styled.View`
  width: 100%;
  border: 1px solid #e1e1e1;
  border-radius: 20px;
  padding: 10px;
  margin: 5px 0;
`;

// 10자 이내로 제한
const Category = styled.Text`
  font-size: 25px;
  font-weight: bold;
  color: black;
  margin-right: 5px;
`;

// 25자 이내로 제한
const MissionNumber = styled.Text`
  font-size: 25px;
  color: black;
`;
