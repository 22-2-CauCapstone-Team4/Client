import React, {useEffect, useState, useCallback, useRef} from 'react';
import styled from 'styled-components/native';
import {Text, ScrollView, TouchableOpacity, View, Alert} from 'react-native';

// import {Dimensions} from 'react-native';
// import Colors from '../../utils/Colors';
// import {StackedBarChart, BarChart} from 'react-native-chart-kit';
// import Realm from 'realm';
// import {
//   mkConfig,
//   readUsageInRealm,
//   readAppSecInRealm,
//   readAppCntInRealm,
// } from '../../functions';
// import {AppUsageRecord, PhoneUsageRecord, CurState} from '../../schema';
// import {useAuth} from '../../providers/AuthProvider';

import {WebView} from 'react-native-webview';

import chartcode from '../charts/ChartCode';

const StatisticsTab = () => {
  let html = chartcode;
  const webviewRef = useRef();

  /** 웹뷰 ref */
  const handleSetRef = _ref => {
    webviewRef.current = _ref;
  };

  //웹뷰에서 RN으로 값을 보낼때 함수
  const handleOnMessage = e => {
    // postMessage 담겨있는 결과 값이 웹뷰에서 값을 출력
    console.log('콘솔', e.nativeEvent.data);
    Alert.alert(e.nativeEvent.data);
  };
  return (
    <WebView onMessage={handleOnMessage} source={{html}} ref={handleSetRef} />
  );
};

// const StatisticsTab = () => {
//   return (
//     <Container>
//       <LineChart width={400} height={400} data={data}>
//         <Line type="monotone" dataKey="uv" stroke="#8884d8" />
//       </LineChart>
//     </Container>
//   );
// };
// const StatisticsTab = () => {
//   const {user} = useAuth();
//   const [now, setNow] = useState(new Date());
//   const [data1, setData1] = useState(null);
//   const [data2, setData2] = useState(null);
//   const [data3, setData3] = useState(null);

//   useEffect(() => {
//     const innerFunc = async () => {
//       const realm = await Realm.open(
//         mkConfig(user, [
//           AppUsageRecord.schema,
//           PhoneUsageRecord.schema,
//           CurState.schema,
//         ]),
//       );

//       let [tempData1, tempData2, tempData3] = await Promise.all([
//         readUsageInRealm(user, realm, now, now),
//         readAppSecInRealm(user, realm, now, now),
//         readAppCntInRealm(user, realm, now, now),
//       ]);

//       realm.close();

//       tempData1 = {
//         labels: ['평소'],
//         legend: ['일반 앱', '금지 앱'],
//         data: [[tempData1.total - tempData1.app, tempData1.app]],
//         barColors: ['#fe6383', '#36a2eb'],
//       };

//       tempData2 = {
//         labels: tempData2.map(app => app.appName),
//         datasets: [
//           {
//             data: tempData2.map(app => app.usageSec),
//           },
//         ],
//       };
//       tempData3 = {
//         labels: tempData3.map(app => app.appName),
//         datasets: [
//           {
//             data: tempData3.map(app => app.clickCnt),
//           },
//         ],
//       };

//       // console.log(
//       //   tempData1,
//       //   tempData2,
//       //   tempData3,
//       //   tempData2.datasets[0].data,
//       //   tempData3.datasets[0].data,
//       // );

//       setData1(tempData1);
//       setData2(tempData2);
//       setData3(tempData3);
//     };

//     innerFunc();

//     setTimeout(() => {
//       setNow(new Date());
//     }, 30000);
//   }, [user, now]);

//   const screenWidth = Dimensions.get('window').width;

//   const chartConfig = {
//     backgroundGradientFrom: '#ffffff',
//     backgroundGradientFromOpacity: 1,
//     backgroundGradientTo: '#ffffff',
//     backgroundGradientToOpacity: 0.5,
//     color: (opacity = 0.5) => '#888888',
//     labelColor: (opacity = 1) => '#000000',
//     decimalPlaces: 1,
//     style: {
//       borderRadius: 16,
//     },
//   };
//   return (
//     <Container>
//       {/* <ScrollView>
//         {data1 !== null && (
//           <>
//             <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
//               금지 앱 사용 비율
//             </Text>
//             <StackedBarChart
//               data={data1}
//               width={screenWidth * 0.95}
//               height={220}
//               chartConfig={{
//                 backgroundGradientFrom: '#ffffff',
//                 backgroundGradientTo: '#ffffff',
//                 decimalPlaces: 1, // optional, defaults to 2dp
//                 color: (opacity = 1) => '#888888',
//                 labelColor: (opacity = 1) => '#000000',
//                 style: {
//                   borderRadius: 16,
//                 },
//                 propsForDots: {
//                   r: '6',
//                   strokeWidth: '12',
//                   stroke: '#ffa726',
//                 },
//               }}
//             />
//           </>
//         )}
//         {data2 !== null && (
//           <>
//             <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
//               금지 앱 사용 시간
//             </Text>
//             <BarChart
//               withHorizontalLabels
//               data={data2}
//               fromZero
//               width={screenWidth * 0.95}
//               height={220}
//               chartConfig={chartConfig}
//             />
//           </>
//         )}

//         {data3 !== null && (
//           <>
//             <Text style={{color: 'black', fontSize: 20, textAlign: 'center'}}>
//               금지 앱 클릭 횟수
//             </Text>
//             <BarChart
//               withHorizontalLabels
//               data={data3}
//               fromZero
//               width={screenWidth * 0.95}
//               height={220}
//               chartConfig={chartConfig}
//             />
//           </>
//         )}
//       </ScrollView> */}
//     </Container>
//   );
// };

export default StatisticsTab;
