import React, {useEffect, useState} from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, TouchableOpacity, View} from 'react-native';
import {Dimensions} from 'react-native';
import Colors from '../../utils/Colors';
import {StackedBarChart, BarChart} from 'react-native-chart-kit';
import Realm from 'realm';
import {
  mkConfig,
  readUsageInRealm,
  readAppSecInRealm,
  readAppCntInRealm,
} from '../../functions';
import {AppUsageRecord, PhoneUsageRecord} from '../../schema';
import {useAuth} from '../../providers/AuthProvider';

const Container = styled.View`
  height: 100%;
  background-color: white;
  padding: 20px;
`;
const StatisticsTab = () => {
  const {user} = useAuth();
  const [isInit, setIsInit] = useState(false);
  const [data1, setData1] = useState(null);
  const [data2, setData2] = useState(null);
  const [data3, setData3] = useState(null);

  useEffect(() => {
    const innerFunc = async () => {
      setIsInit(true);
      const realm = await Realm.open(
        mkConfig(user, [AppUsageRecord.schema, PhoneUsageRecord.schema]),
      );

      const now = new Date();
      let [tempData1, tempData2, tempData3] = await Promise.all([
        readUsageInRealm(user, realm, now, now),
        readAppSecInRealm(user, realm, now, now),
        readAppCntInRealm(user, realm, now, now),
      ]);

      realm.close();

      tempData1 = {
        labels: ['평소'],
        legend: ['일반 앱', '금지 앱'],
        data: [
          [
            ((tempData1.total - tempData1.app) / 60).toFixed(1),
            (tempData1.app / 60).toFixed(1),
          ],
        ],
        barColors: ['#fe6383', '#36a2eb'],
      };

      tempData2 = {
        labels: tempData2.map(app => app.appPackageName),
        datasets: [
          {
            data: tempData2.map(app => (app.usageSec / 60).toFixed(1)),
          },
        ],
      };
      tempData3 = {
        labels: tempData3.map(app => app.appPackageName),
        datasets: [
          {
            data: tempData3.map(app => app.clickCnt),
          },
        ],
      };

      console.log(
        tempData1,
        tempData2,
        tempData3,
        tempData2.datasets[0].data,
        tempData3.datasets[0].data,
      );

      setData1(tempData1);
      setData2(tempData2);
      setData3(tempData3);
    };

    innerFunc();
  }, [isInit, user]);

  const screenWidth = Dimensions.get('window').width;

  // // 1번쨰 차트
  // const data1 = {
  //   labels: ['미션 중', '포기 중', '평소'], // ★ 레이블
  //   legend: ['일반', '금지 앱'], // ★ 파란색, 빨간색 바를 나타내는 내용 작성하면 됌
  //   data: [
  //     // ★ 데이터 넣는 곳([a, b] => a = 빨간색 바, b = 파란색 바)
  //     [30, 60],
  //     [30, 30],
  //     [30, 30],
  //   ],
  //   barColors: ['#fe6383', '#36a2eb'],
  // };

  // // 2번 째 차트
  // const data2 = {
  //   labels: ['일', '월', '화', '수', '목', '금', '토'], // ★ 내용 수정
  //   datasets: [
  //     // ★ 데이터 넣는 곳
  //     {
  //       data: [1, 2, 3, 4, 5, 6, 7],
  //     },
  //   ],
  // };

  // const data3 = {
  //   labels: ['일', '월', '화', '수', '목', '금', '토'], // ★ 내용 수정
  //   datasets: [
  //     // ★ 데이터 넣는 곳
  //     {
  //       data: [1, 2, 3, 4, 5, 6, 7],
  //     },
  //   ],
  // };

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
        {data1 !== null && (
          <>
            <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
              금지 앱 사용 비율
            </Text>
            <StackedBarChart
              data={data1}
              width={screenWidth * 0.95}
              height={220}
              chartConfig={{
                backgroundGradientFrom: '#ffffff',
                backgroundGradientTo: '#ffffff',
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) => '#000000',
                labelColor: (opacity = 1) => '#000000',
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
          </>
        )}
        {data2 !== null && (
          <>
            <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
              금지 앱 사용 시간
            </Text>
            <BarChart
              withHorizontalLabels
              data={data2}
              fromZero
              width={screenWidth * 0.95}
              height={220}
              chartConfig={chartConfig}
            />
          </>
        )}

        {data3 !== null && (
          <>
            <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
              금지 앱 클릭 횟수
            </Text>
            <BarChart
              withHorizontalLabels
              data={data3}
              fromZero
              width={screenWidth * 0.95}
              height={220}
              chartConfig={chartConfig}
            />
          </>
        )}
      </ScrollView>
    </Container>
  );
};

export default StatisticsTab;
