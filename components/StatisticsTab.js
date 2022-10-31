import Categories from './Categories';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const StatisticsTab = () => {
  return (
    <Container>
      <Categories />
    </Container>
  );
};

export default StatisticsTab;
