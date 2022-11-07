import React from 'react';
import styled from 'styled-components';
import HomeTab from './HomeTab';
import GoalTab from './GoalTab';
import StatisticsTab from './StatisticsTab';
import RecordTab from './RecordTab';
import FriendTab from './FriendTab';
const Container = styled.View`
  height: 100%;
`;
const StyledText = styled.Text`
  font-size: 30px;
`;
export const Home = () => {
  return <HomeTab />;
};
export const Goal = () => {
  return <GoalTab />;
};
export const Record = () => {
  return <RecordTab />;
};
export const Statistics = () => {
  return <StatisticsTab />;
};
export const Friends = () => {
  return <FriendTab />;
};
