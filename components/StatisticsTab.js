import Categories from './Categories';
import React from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {Dimensions} from 'react-native';
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
const StatisticsTab = () => {
  const screenWidth = Dimensions.get('window').width;

  const data = {
    labels: ['미션 중', '포기 중', '평소'],
    legend: ['Dataset1', 'Dataset2'],
    data: [
      [60, 60],
      [30, 30],
      [30, 30],
    ],
    barColors: ['#fe6383', '#36a2eb'],
  };
  return (
    <Container>
      <Categories />
      <ScrollView>
        <Text>StackedBar chart</Text>
        <StackedBarChart
          data={data}
          width={screenWidth}
          height={220}
          chartConfig={{
            backgroundColor: '#e26a00',
            backgroundGradientFrom: '#fb8c00',
            backgroundGradientTo: '#ffa726',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            labelColor: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '2',
              stroke: '#ffa726',
            },
          }}
        />
      </ScrollView>
    </Container>
  );
};

export default StatisticsTab;
