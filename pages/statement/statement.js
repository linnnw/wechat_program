// pages/statement/statement.js
import * as echarts from '../../ec-canvas/echarts';
import request from '../../utils/request.js'
import macarons from '../../ec-canvas/macarons.js'

let chart1 = {  /* 最近7天统计情况 */
  title: '',
  month: [],  //月份
  register: [],   //服务数
  online: []  //在线数
}
let pie1 = {    /* 各区域服务数 */
  title: '',
  legend: []
}
let pie2 = {    /* 各区域在线数 */
  title: '',
  legend: []
}
let bar1 = {    /* 近期产品数量统计 */
  title: '',
  times: [],
  xs: [],
  zl: []
}
let bar2 = {    /* 近期合同数量统计 */
  title: '',
  times: [],
  xs: [],
  zl: []
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    flag: false,
    ecBar: {},
    ecBar1: {},
    ecBar2: {},
    ecScatter: {},
    ecScatter1: {}
  },
  // 获取echarts数据
  getEchartsData() {
    request._post('/getChartData', {}, res => {
      let chartdata = res.data.data;
      // console.log(chartdata)
      if (chartdata != null && chartdata != undefined) {
        chart1 = {
          title: chartdata.chart_2.title,
          month: chartdata.time,
          register: chartdata.chart_1.data,
          online: chartdata.chart_2.data
        }
        for (const key in chartdata.pie_1.data) {
          chartdata.pie_1.data[key].name = chartdata.pie_1.data[key].name
        }
        pie1 = {
          title: chartdata.pie_1.title,
          legend: chartdata.pie_1.data
        }

        for (const key in chartdata.pie_2.data) {
          chartdata.pie_2.data[key].name = chartdata.pie_2.data[key].name
        }
        pie2 = {
          title: chartdata.pie_2.title,
          legend: chartdata.pie_2.data
        }

        bar1 = {
          title: '近期产品数量统计',
          times: chartdata.times,
          xs: chartdata.xs.data,
          zl: chartdata.zl.data
        }
        bar2 = {
          title: '近期合同数量统计',
          times: chartdata.times,
          xs: chartdata.xs_contract.data,
          zl: chartdata.zl_contract.data
        }
      }

      this.setData({
        ecBar: {
          onInit: function (canvas, width, height) {
            const barChart = echarts.init(canvas, 'macarons', {
              width: width,
              height: height
            });
            canvas.setChart(barChart);
            barChart.setOption(getBarOption());

            return barChart;
          }
        },

        ecBar1: {
          onInit: function (canvas, width, height) {
            const barChart = echarts.init(canvas, 'macarons', {
              width: width,
              height: height
            });
            canvas.setChart(barChart);
            barChart.setOption(getBarOption1());

            return barChart;
          }
        },

        ecBar2: {
          onInit: function (canvas, width, height) {
            const barChart = echarts.init(canvas, 'macarons', {
              width: width,
              height: height
            });
            canvas.setChart(barChart);
            barChart.setOption(getBarOption2());

            return barChart;
          }
        },



        ecScatter: {
          onInit: function (canvas, width, height) {
            const scatterChart = echarts.init(canvas, 'macarons', {
              width: width,
              height: height
            });
            canvas.setChart(scatterChart);
            scatterChart.setOption(getScatterOption());

            return scatterChart;
          }
        },
        ecScatter1: {
          onInit: function (canvas, width, height) {
            const scatterChart = echarts.init(canvas, 'macarons', {
              width: width,
              height: height
            });
            canvas.setChart(scatterChart);
            scatterChart.setOption(getScatterOption1());

            return scatterChart;
          }
        },
        flag: true
      })
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getEchartsData();
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.getTabBar().setData({
      // current: 'statement'
      selected: 0
    })
  }
});

function getBarOption() {

  let option = {

    title: {
      text: chart1.title,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 15
      },
      x: 'left',
      y: 'top',
      top: -5
    },
    // tooltip: { trigger: 'axis' },
    grid: {
      left: "8%",
      right: '3%'
    },
    legend: {
      data: ['服务数', '在线数'],
      x: 'right'
    },
    xAxis: {
      data: chart1.month
    },
    yAxis: {
      type: 'value',
      name: '单位(台)',
    },
    series: [
      {
        name: '服务数',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#ffb980'
          }
        },
        data: chart1.register
      },
      {
        name: '在线数',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#97b552'
          },
        },
        data: chart1.online
      }
    ]

    // title: {
    //   text: chart1.title,
    //   subtext: '单位(台)'
    // },
    // tooltip: {
    //   trigger: 'axis'
    // },
    // legend: {
    //   textStyle: {
    //     fontSize: 14
    //   },
    //   data: ['服务数', '在线数'],
    //   align: 'right',
    //   right: 10
    // },

    // xAxis: [{
    //   type: 'category',
    //   data: chart1.month
    // }],
    // yAxis: [{
    //   type: 'value'
    // }],
    // series: [{
    //   name: '服务数',
    //   type: 'bar',
    //   data: chart1.register,
    //   markPoint: {
    //     data: [
    //       { type: 'max', name: '最大值' },
    //       { type: 'min', name: '最小值' }
    //     ]
    //   }
    // },
    // {
    //   name: '在线数',
    //   type: 'bar',
    //   data: chart1.online,
    //   markPoint: {
    //     data: [
    //       { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
    //       { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
    //     ]
    //   }
    // }
    // ]
  };

  return option;
}

function getBarOption1() {

  let option = {
    title: {
      text: bar1.title,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 15
      },
      x: 'left',
      y: 'top',
      top: -5
    },
    // tooltip: { trigger: 'axis' },
    grid: {
      left: "12%",
      right: '3%',
      bottom: '70'
    },
    legend: {
      data: [
        '租赁产品', '销售产品'
      ],
      x: 'right'
    },
    xAxis: {
      data: bar1.times
    },
    yAxis: {
      type: 'value',
      name: '单位',
      offset: '10',
    },
    dataZoom: [
      {
        show: true,
        start: 50,
        end: 100
      },
      {
        type: 'inside',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '租赁产品',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#7cb5ec'
          }
        },
        data: bar1.zl
      },
      {
        name: '销售产品',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#90ed7d'
          },
        },
        data: bar1.xs
      }
    ]
  }

  return option;

  // {
  //   title: {
  //     text: bar1.title,
  //     subtext: '单位'
  //   },
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {
  //     textStyle: {
  //       fontSize: 14
  //     },
  //     data: ['租赁产品', '销售产品'],
  //     align: 'right',
  //     right: 10
  //   },

  //   xAxis: [{
  //     type: 'category',
  //     data: bar1.times
  //   }],
  //   yAxis: [{
  //     type: 'value'
  //   }],
  //   series: [{
  //     name: '租赁产品',
  //     type: 'bar',
  //     data: bar1.zl,
  //     markPoint: {
  //       data: [
  //         { type: 'max', name: '最大值' },
  //         { type: 'min', name: '最小值' }
  //       ]
  //     }
  //   },
  //   {
  //     name: '销售产品',
  //     type: 'bar',
  //     data: bar1.xs,
  //     markPoint: {
  //       data: [
  //         { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
  //         { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
  //       ]
  //     }
  //   }
  //   ]
  // };
}

function getBarOption2() {

  let option = {
    title: {
      text: bar2.title,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 15
      },
      x: 'left',
      y: 'top',
      top: -5
    },
    // tooltip: { trigger: 'axis' },
    grid: {
      left: "12%",
      right: '3%',
      bottom: '70'
    },
    legend: {
      data: ['租赁合同'
        , '销售订单'
      ],
      x: 'right'
    },
    xAxis: {
      data: bar2.times
    },
    yAxis: {
      type: 'value',
      name: '单位',
      offset: '10',
    },
    dataZoom: [
      {
        show: true,
        start: 50,
        end: 100
      },
      {
        type: 'inside',
        start: 50,
        end: 100
      }
    ],
    series: [
      {
        name: '租赁合同',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#7cb5ec'
          }
        },
        data: bar2.zl
      },
      {
        name: '销售订单',
        type: 'bar',
        itemStyle: {
          normal: {
            label: { show: true, position: 'top' },
            color: '#90ed7d'
          },
        },
        data: bar2.xs
      }
    ]
  }

  return option;


  // {
  //   title: {
  //     text: bar2.title,
  //     subtext: '单位(台)'
  //   },
  //   tooltip: {
  //     trigger: 'axis'
  //   },
  //   legend: {
  //     textStyle: {
  //       fontSize: 14
  //     },
  //     data: ['租赁合同', '销售订单'],
  //     align: 'right',
  //     right: 10
  //   },

  //   xAxis: [{
  //     type: 'category',
  //     data: bar2.times
  //   }],
  //   yAxis: [{
  //     type: 'value'
  //   }],
  //   series: [{
  //     name: '租赁合同',
  //     type: 'bar',
  //     data: bar2.zl,
  //     markPoint: {
  //       data: [
  //         { type: 'max', name: '最大值' },
  //         { type: 'min', name: '最小值' }
  //       ]
  //     }
  //   },
  //   {
  //     name: '销售订单',
  //     type: 'bar',
  //     data: bar2.xs,
  //     markPoint: {
  //       data: [
  //         { name: '年最高', value: 182.2, xAxis: 7, yAxis: 183 },
  //         { name: '年最低', value: 2.3, xAxis: 11, yAxis: 3 }
  //       ]
  //     }
  //   }
  //   ]
  // };
}




function getScatterOption() {

  let option = {
    title: {
      text: pie1.title,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 15,
      },
      x: 'top',
      y: 'left',
      top: -5
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      show: false,
      orient: 'vertical',
      x: '20',
      y: 'center',
    },
    calculable: true,
    series: [
      {
        // name: '访问来源',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        itemStyle: {
          normal: {
            label: {
              formatter: "{b}({c})"
            }
          }
        },
        data: pie1.legend
      }
    ]
  }





  return option;


  // {
  //   title: {
  //     text: pie1.title
  //   },
  //   backgroundColor: "#ffffff",
  //   color: ["#FFDB5C", "#FF9F7F", "#ff8787", "#c84a4a", "#8B5A2B", "#76EE00", "#CDC1C5", "#BF3EFF"],
  //   series: [{
  //     label: {
  //       normal: {
  //         fontSize: 14
  //       }
  //     },
  //     type: 'pie',
  //     center: ['50%', '50%'],
  //     radius: [0, '60%'],
  //     data: pie1.legend,

  //     itemStyle: {
  //       emphasis: {
  //         shadowBlur: 10,
  //         shadowOffsetX: 0,
  //         shadowColor: 'rgba(0, 2, 2, 0.3)'
  //       }
  //     }
  //   }]
  // }
}

function getScatterOption1() {
  let option = {
    title: {
      text: pie2.title,
      textStyle: {
        fontWeight: 'bold',
        fontSize: 15,
      },
      x: 'left',
      y: 'top',
      top: -5
    },
    tooltip: {
      trigger: 'item',
      formatter: "{b} : {c} ({d}%)"
    },
    legend: {
      show: false,
      orient: 'vertical',
      x: 'left',
    },
    calculable: true,
    series: [
      {
        // name: '',
        type: 'pie',
        radius: '50%',
        center: ['50%', '60%'],
        itemStyle: {
          normal: {
            label: {
              formatter: "{b}({c})"
            }
          }
        },
        data: pie2.legend
      }
    ]
  }

  return option;



  // {
  //   title: {
  //     text: pie2.title
  //   },
  //   backgroundColor: "#ffffff",
  //   color: ["#ff8787", "#c84a4a"],
  //   series: [{
  //     label: {
  //       normal: {
  //         fontSize: 14
  //       }
  //     },
  //     type: 'pie',
  //     center: ['50%', '50%'],
  //     radius: [0, '60%'],
  //     data: pie2.legend,
  //     itemStyle: {
  //       emphasis: {
  //         shadowBlur: 10,
  //         shadowOffsetX: 0,
  //         shadowColor: 'rgba(0, 2, 2, 0.3)'
  //       }
  //     }
  //   }]
  // }
}