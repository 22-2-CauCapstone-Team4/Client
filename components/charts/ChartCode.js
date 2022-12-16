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
  giveUpAppClickCnt,
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
      <h1 id="title3">시간 경과에 따른 포기 상태일 횟수</h1>
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
Chart.defaults.font.size = 30;
Chart.defaults.font.weight = 'bold';

// ★1. 미션 중/포기 중/평소 전체 시간 대비 금지 앱 사용 시간

new Chart(ctx1, {
  type: 'bar',
  data: {
    labels: ['미션 중', '포기 중', '평소'],
    datasets: [
      {
        label: '일반 앱 사용시간',
        data: ${'[' + nonProhibitedAppMins + ']'},
        backgroundColor: ['rgba(54, 162, 235, 0.7)'],
        borderColor: ['rgba(255, 26, 104, 0.2)'],
        borderWidth: 1,
      },
      {
        label: '금지 앱 사용시간',
        data: ${'[' + prohibitedAppMins + ']'},
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
          text: '사용 시간 (분)',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
             },
    },
  },
});

// ★2-a 시간 경과에 따른 금지 앱 유혹 정도
new Chart(ctx2, {
  type: 'bar',
  data: {
    datasets: [
      {
        type: 'bar',
        label: '금지 앱 클릭 횟수',
        data: ${'[' + prohibitedAppClickCnts + ']'},
        backgroundColor: ['rgba(255, 26, 104, 0.2)'],
        borderColor: ['rgba(255, 26, 104, 0.2)'],
      },
      {
        type: 'line',
        label: '포기 횟수',
        data: ${'[' + breakTimeOrGiveUpCnt + ']'},
        backgroundColor: ['rgba(48,128,208, 0.5)'],
        borderColor: ['rgba(48,128,208, 0.5)'],
      },
    ],
    labels: ${'["' + ctx2_label.join('","') + '"]'},
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
          text:'미션 시작으로부터 시간 경과 (분)',
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
            text:'횟수',
            color: 'black',
            padding:{
              bottom: 20
            }
          }
      },
    },
  },
});
// ★2-b 시간 경과에 따른 포기 상태일 확률
new Chart(ctx3, {
  type: 'line',
  data: {
    labels: ${'["' + ctx3_label.join('","') + '"]'},
    datasets: [
      {
        label: '포기 상태였던 횟수',
        data: ${'[' + giveUpPer + ']'},
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
      x:{
        title:{
          display: true,
          text:'미션 시작으로부터 시간 경과 (분)',
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
          text:'횟수',
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
    labels: ${'["' + ctx4_label.join('","') + '"]'},
    datasets: [
      {
        label: '앱 이름',
        data: ${'[' + giveUpAppPer + ']'},
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
  },
});
// ★ 3-b 금지 앱 클릭
new Chart(ctx5, {
  type: 'bar',
  data: {
    labels: ${'["' + ctx5_label.join('","') + '"]'},
    datasets: [
      {
        label: '클릭 횟수',
        data: ${'[' + giveUpAppClickCnt + ']'},
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
      // x:{
      //   title:{
      //     display: true,
      //     text:'금지 앱 이름',
      //     color: 'black',
      //     padding:{
      //       bottom: 20
      //     }
      //   }
      // },
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
    labels: ${'["' + ctx6_label.join('","') + '"]'},
    datasets: [
      {
        label: '사용 시간',
        data: ${'[' + giveUpAppUsages + ']'},
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
      // x:{
      //   title:{
      //     display: true,
      //     text:'금지 앱 이름',
      //     color: 'black',
      //     padding:{
      //       bottom: 20
      //     }
      //   }
      // },
      y: {
        beginAtZero: true,
        title:{
          display: true,
          text:'사용 시간 (분)',
          color: 'black',
          padding:{
            bottom: 20
          }
        }
      },
    },
  },
});

</script>
`;
};

export default mkChartCode;

{
  /* <h1 id="title1">1.</h1>
<canvas id="myChart1"></canvas>
<h1 id="title2">2-a</h1>
<canvas id="myChart2"></canvas>
<h1 id="title3">2-b</h1>
<canvas id="myChart3"></canvas> */
}

// const ctx1 = document.getElementById('myChart1');
//   const ctx2 = document.getElementById('myChart2');
//   const ctx3 = document.getElementById('myChart3');

// ★1. 미션 중/포기 중/평소 전체 시간 대비 금지 앱 사용 시간
// new Chart(ctx1, {
//   type: 'bar',
//   data: {
//     labels: ['미션 중', '포기 중', '평소'],
//     datasets: [
//       {
//         label: 'Data 1',
//         data: [18, 12, 10],
//         backgroundColor: [
//           'rgba(54, 162, 235, 0.7)',
//         ],
//         borderColor: [
//           'rgba(255, 26, 104, 0.2)',
//         ],
//         borderWidth: 1,
//       },
//       {
//         label: 'Data 2',
//         data: [18, 12, 10],
//         backgroundColor: [
//           'rgba(255, 26, 104, 0.7)',

//         ],
//         borderColor: [
//           'rgba(255, 26, 104, 0.2)',

//         ],
//         borderWidth: 1,
//       },
//     ],
//   },
//   options: {
//       plugins: {
//           legend: {
//               labels: {
//                   font: {
//                       size: 40
//                   }
//               }
//           }
//       },
//       layout: {
//           padding:{
//               left: 10,
//               right: 10,
//               bottom: 10,
//           }
//       },
//     scales: {
//       x: {
//         stacked: true,
//       },
//       y: {
//         beginAtZero: true,
//         stacked: true,
//       },
//     },
//   },
// });
// // ★2-a 시간 경과에 따른 금지 앱 클릭 횟수 ~~
// new Chart(ctx2, {
//   type: 'bar',
//   data: {
//     datasets: [{
//       type: 'bar',
//       label: 'Bar Dataset',
//       data: [10, 20, 30, 10],
//   }, {
//       type: 'line',
//       label: 'Line Dataset',
//       data: [40, 10, 30, 20],
//   }],
//   labels: ['January', 'February', 'March', 'April']
//   },
//   options: {
//       plugins: {
//           legend: {
//               labels: {
//                   font: {
//                       size: 35
//                   }
//               }
//           }
//       },
//       layout: {
//           padding:{
//               left: 10,
//               right: 10,
//               bottom: 10,
//           }
//       },
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });
// // ★2-b 시간 경과에 따른 포기 상태일 확률
// new Chart(ctx3, {
//   type: 'line',
//   data: {
//     labels: ['일', '월', '화', '수', '목', '금', '토'],
//     datasets: [{
//       label: '포기 상태일 확률',
//       data: [12, 19, 3, 5, 2, 3, 1],
//       borderWidth: 1
//     }]
//   },
//   options: {
//       plugins: {
//           legend: {
//               labels: {
//                   font: {
//                       size: 35
//                   }
//               }
//           }
//       },
//       layout: {
//           padding:{
//               left: 10,
//               right: 10,
//               bottom: 10,
//           }
//       },
//     scales: {
//       y: {
//         beginAtZero: true
//       }
//     }
//   }
// });
