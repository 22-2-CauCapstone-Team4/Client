import Categories from '../Categories';
import React from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {Dimensions} from 'react-native';
import Colors from '../../utils/Colors';
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
    data: [
      [60, 60],
      [30, 30],
      [30, 30],
    ],
    barColors: ['#fe6383', '#36a2eb'],
  };
  return (
    <Container>
      <ScrollView>
        <Text>chart1</Text>
        <StackedBarChart
          data={data}
          width={screenWidth * 0.95}
          height={220}
          chartConfig={{
            backgroundGradientFrom: '#ffffff',
            backgroundGradientTo: '#ffffff',
            decimalPlaces: 2, // optional, defaults to 2dp
            color: (opacity = 1) => Colors.MAIN_COLOR,
            labelColor: (opacity = 1) => Colors.MAIN_COLOR,
            style: {
              borderRadius: 16,
            },
            propsForDots: {
              r: '6',
              strokeWidth: '12',
              stroke: '#ffa726',
            },
          }}
        />
      </ScrollView>
    </Container>
  );
};

export default StatisticsTab;
