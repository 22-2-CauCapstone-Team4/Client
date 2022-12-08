// import {mkChartCode} from '../../components/charts/ChartCode';
import {AppUsageRecord, PhoneUsageRecord} from '../../schema';

const mkStaticStr = async (user, realm) => {
  console.log('통계 결과 읽기 시작');
  let temp = {};
  try {
    const appUsageRecord = realm.objects('AppUsageRecord');
    const phoneUsageRecord = realm.objects('PhoneUsageRecord');
    const missionRecord = realm.objects('MissionRecord');

    // {
    //   nonProhibitedAppMins,
    //   prohibitedAppMins,
    //   ctx2_label,
    //   prohibitedAppClickCnts,
    //   breakTimeOrGiveUpCnt,
    //   ctx3_label,
    //   giveUpPer,
    //   ctx4_label,
    //   giveUpAppPer,
    //   ctx5_label,
    //   giveUpAppCllickCnt,
    //   ctx6_label,
    //   giveUpAppUsages
    // }
    // 그래프 1
    temp.prohibitedAppMins = [
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.MISSION) acc += curr.usageSec;
        return acc;
      }, 0),
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.GIVE_UP) acc += curr.usageSec;
        return acc;
      }, 0),
      appUsageRecord.reduce((acc, curr) => {
        if (curr.type === AppUsageRecord.TYPE.DEFAULT) acc += curr.usageSec;
        return acc;
      }, 0),
    ];
    temp.nonProhibitedAppMins = [
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.MISSION) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[0],
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.GIVE_UP) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[1],
      phoneUsageRecord.reduce((acc, curr) => {
        if (curr.type === PhoneUsageRecord.TYPE.DEFAULT) acc += curr.usageSec;
        return acc;
      }, 0) - temp.prohibitedAppMins[2],
    ];

    // 그래프 2

    // 그래프 3

    // 그래프 4
    const missionRecordByGroupingApp = missionRecord.reduce((acc, curr) => {
      const giveUpApp = curr.giveUpApp ? curr.giveUpApp.name : null;
      if (!giveUpApp) return acc;

      if (acc[giveUpApp]) acc[giveUpApp].push(curr);
      else acc[giveUpApp] = [curr];
      return acc;
    }, {});

    temp.ctx4_label = Object.keys(missionRecordByGroupingApp);

    let totalGiveUpAppNum = 0;
    temp.giveUpAppPer = [];
    for (let i = 0; i < length; i++) {
      const key = temp.ctx4_label[i];
      // console.log(key);
      temp.giveUpAppPer.push(missionRecordByGroupingApp[key].length);
      totalGiveUpAppNum += temp.giveUpAppPer[temp.giveUpAppPer.length - 1];
    }
    temp.giveUpAppPer = temp.giveUpAppPer.map(
      num => (num / totalGiveUpAppNum) * 100,
    );

    // 그래프 5
    const appUsageGroupByApp = appUsageRecord.reduce((acc, curr) => {
      const {appName} = curr;
      if (acc[appName]) acc[appName].push(curr);
      else acc[appName] = [curr];
      return acc;
    }, {});
    temp.ctx5_label = temp.ctx6_label = Object.keys(appUsageGroupByApp);
    // console.log(
    //   appUsageGroupByApp['10x10'],
    //   temp.ctx5_label,
    //   temp.ctx6_label,
    // );
    temp.giveUpAppClickCnt = [];
    temp.giveUpAppUsages = [];

    const length = temp.ctx5_label.length;
    for (let i = 0; i < length; i++) {
      const key = temp.ctx5_label[i];
      //   console.log(key);
      temp.giveUpAppClickCnt.push(
        appUsageGroupByApp[key].reduce((a, b) => a + b.clickCnt, 0),
      );
      temp.giveUpAppUsages.push(
        appUsageGroupByApp[key].reduce((a, b) => a + b.usageSec, 0),
      );
    }

    console.log('읽기 완료');
  } catch (err) {
    console.log(err.message);
  }

  return mkChartCode(temp);
};

const mkChartCode = ({
  nonProhibitedAppMins,
  prohibitedAppMins,
  ctx2_label,
  prohibitedAppClickCnts,
  breakTimeOrGiveUpCnt,
  ctx3_label,
  giveUpPer,
  ctx4_label,
  giveUpAppPer,
  ctx5_label,
  giveUpAppCllickCnt,
  ctx6_label,
  giveUpAppUsages,
}) => {
  return `
<link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.css"
    /> 
<style>
  .swiper {
    width: 100%;
    height: 50%;
  }
  .swiper-slide {
    text-align: center;
    font-size: 18px;
    background: #fff;
  }
  #title1{
    width: 100%;
    text-align: center;
    font-size: 35px;
  }
  h1{
    font-size: 50px;
    text-align: center;
  }
</style>
<h1>금지 앱 사용 시간 비율</h1>
<canvas id="myChart1" width ="970vh" height = "700vh"></canvas>
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <h1 id="title2">시간 경과에 따른 금지 앱 유혹 정도</h1>
      <canvas id="myChart2" width ="970vh" height = "700vh"></canvas>  
    </div>
    <div class="swiper-slide second">
      <h1 id="title3">시간 경과에 따른 포기 상태일 확률</h1>
      <canvas id="myChart3" width ="970vh" height = "700vh"></canvas>  
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>
<div class="swiper mySwiper">
  <div class="swiper-wrapper">
    <div class="swiper-slide">
      <h1 id="title4">포기 앱 비율</h1>
      <canvas id="myChart4" width ="970vh" height = "700vh"></canvas>  
    </div>
    <div class="swiper-slide">
      <h1 id="title5">금지 앱 클릭</h1>
      <canvas id="myChart5" width ="970vh" height = "700vh"></canvas>  
    </div>
    <div class="swiper-slide">
      <h1 id="title6">금지 앱 사용시간</h1>
      <canvas id="myChart6" width ="970vh" height = "700vh"></canvas>  
    </div>
  </div>
  <div class="swiper-pagination"></div>
</div>

<script src="https://cdn.jsdelivr.net/npm/swiper/swiper-bundle.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
<script>
  var swiper = new Swiper('.mySwiper', {
    pagination: {
      el: '.swiper-pagination',
      dynamicBullets: true,
    },
  });
</script>
<script>
const ctx1 = document.getElementById('myChart1');
const ctx2 = document.getElementById('myChart2');
const ctx3 = document.getElementById('myChart3');
const ctx4 = document.getElementById('myChart4');
const ctx5 = document.getElementById('myChart5');
const ctx6 = document.getElementById('myChart6');

// ★1. 미션 중/포기 중/평소 전체 시간 대비 금지 앱 사용 시간

new Chart(ctx1, {
  type: 'bar',
  data: {
    labels: ['미션 중', '포기 중', '평소'],
    datasets: [
      {
        label: '금지 X 앱 사용시간',
        data: ${nonProhibitedAppMins},
        backgroundColor: ['rgba(54, 162, 235, 0.7)'],
        borderColor: ['rgba(255, 26, 104, 0.2)'],
        borderWidth: 1,
      },
      {
        label: '금지 앱 사용시간',
        data: ${prohibitedAppMins},
        backgroundColor: ['rgba(255, 26, 104, 0.7)'],
        borderColor: ['rgba(255, 26, 104, 0.2)'],
        borderWidth: 1,
      },
    ],
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 35,
          },
          color:"black",
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 10,
      },
    },
    scales: {
      x: {
        stacked: true,
      },
      y: {
        
        beginAtZero: true,
        stacked: true,
        title:{  
          display: true,
          text: '사용시간(분)',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
        
      },
    },
  },
});
// ★ 3-a 포기 앱 비율
new Chart(ctx4, {
  type: 'doughnut',
  data: {
    labels: ${ctx4_label},
    datasets: [
      {
        label: 'My First Dataset',
        data: ${giveUpAppPer},
        backgroundColor: [
          'rgb(255, 99, 132)',
          'rgb(54, 162, 235)',
          'rgb(255, 205, 86)',
        ],
        hoverOffset: 4,
      },
    ],
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 35,
          },
          color:"black",
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 10,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  },
});
// ★ 3-b 금지 앱 클릭
new Chart(ctx5, {
  type: 'bar',
  data: {
    labels: ${ctx5_label},
    datasets: [
      {
        label: '클릭 횟수',
        data: ${giveUpAppCllickCnt},
        borderWidth: 1,
      },
    ],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)',
    ],
    borderWidth: 1,
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 35,
          },
          color:"black",
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 10,
      },
    },
    scales: {
      x:{
        title:{
          display: true,
          text:'금지 앱 이름',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
      },
      y: {
        beginAtZero: true,
        title:{
          display: true,
          text:'클릭 횟수',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
      },
    },
  },
});
// ★ 3-c 금지 앱 사용시간
new Chart(ctx6, {
  type: 'bar',
  data: {
    labels: ${ctx6_label},
    datasets: [
      {
        label: '사용 시간',
        data: ${giveUpAppUsages},
        borderWidth: 1,
      },
    ],
    backgroundColor: [
      'rgba(255, 99, 132, 0.2)',
      'rgba(255, 159, 64, 0.2)',
      'rgba(255, 205, 86, 0.2)',
      'rgba(75, 192, 192, 0.2)',
      'rgba(54, 162, 235, 0.2)',
      'rgba(153, 102, 255, 0.2)',
      'rgba(201, 203, 207, 0.2)',
    ],
    borderColor: [
      'rgb(255, 99, 132)',
      'rgb(255, 159, 64)',
      'rgb(255, 205, 86)',
      'rgb(75, 192, 192)',
      'rgb(54, 162, 235)',
      'rgb(153, 102, 255)',
      'rgb(201, 203, 207)',
    ],
    borderWidth: 1,
  },
  options: {
    responsive: false,
    plugins: {
      legend: {
        labels: {
          font: {
            size: 35,
          },
          color:"black",
        },
      },
    },
    layout: {
      padding: {
        left: 10,
        right: 10,
        bottom: 10,
      },
    },
    scales: {
      x:{
        title:{
          display: true,
          text:'금지 앱 이름',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
      },
      y: {
        beginAtZero: true,
        title:{
          display: true,
          text:'사용시간(분)',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
      },
    },
  },
});`;
};

export {mkStaticStr};
