import Categories from './Categories';
import React from 'react';
import styled from 'styled-components/native';

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const RecordTab = () => {
  return (
    <Container>
      <Categories />
    </Container>
  );
};

export default RecordTab;
