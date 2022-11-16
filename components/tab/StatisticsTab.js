import React from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {Dimensions} from 'react-native';
import Colors from '../../utils/Colors';
import {StackedBarChart, BarChart} from 'react-native-chart-kit';

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const StatisticsTab = () => {
  const screenWidth = Dimensions.get('window').width;

  // 1번쨰 차트
  const data1 = {
    labels: ['미션 중', '포기 중', '평소'], // ★ 레이블
    legend: ['데이터1', '데이터2'], // ★ 파란색, 빨간색 바를 나타내는 내용 작성하면 됌
    data: [
      // ★ 데이터 넣는 곳([a, b] => a = 빨간색 바, b = 파란색 바)
      [30, 60],
      [30, 30],
      [30, 30],
    ],
    barColors: ['#fe6383', '#36a2eb'],
  };
  // 2번 째 차트
  const data2 = {
    labels: ['일', '월', '화', '수', '목', '금', '토'], // ★ 내용 수정
    datasets: [
      // ★ 데이터 넣는 곳
      {
        data: [1, 2, 3, 4, 5, 6, 7],
      },
    ],
  };
  const chartConfig = {
    backgroundGradientFrom: '#ffffff',
    backgroundGradientFromOpacity: 0.1,
    backgroundGradientTo: '#ffffff',
    backgroundGradientToOpacity: 0.5,
    color: (opacity = 0.5) => `rgb(0, 0, 0)`,
    barPercentage: 0.5,
  };
  return (
    <Container>
      <ScrollView>
        <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
          chart1
        </Text>
        <StackedBarChart
          data={data1}
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
        <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
          chart2
        </Text>
        <BarChart
          withHorizontalLabels
          data={data2}
          fromZero
          width={screenWidth * 0.95}
          height={220}
          chartConfig={chartConfig}
        />
      </ScrollView>
    </Container>
  );
};

export default StatisticsTab;
