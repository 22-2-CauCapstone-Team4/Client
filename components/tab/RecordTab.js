import Categories from '../Categories';
import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text, ScrollView, View} from 'react-native';
import {StyleSheet} from 'react-native';
import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart,
} from 'react-native-chart-kit';

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
