import React from 'react';
import styled from 'styled-components';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Container = styled.View`
  align-items: center;
  justify-content: center;
  height: 100%;
`;
const StyledText = styled.Text`
  font-size: 30px;
`;
export const Home = () => {
  return (
    <Container>
      <StyledText>홈</StyledText>
    </Container>
  );
};
export const Goal = () => {
  return (
    <Container>
      <StyledText>목표</StyledText>
    </Container>
  );
};
export const Record = () => {
  return (
    <Container>
      <StyledText>기록</StyledText>
    </Container>
  );
};
export const Statistics = () => {
  return (
    <Container>
      <StyledText>통계</StyledText>
    </Container>
  );
};
export const Friends = () => {
  return (
    <Container>
      <StyledText>친구</StyledText>
    </Container>
  );
};
