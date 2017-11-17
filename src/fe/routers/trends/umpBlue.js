
(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    // AMD. Register as an anonymous module.
    define(['exports', 'echarts'], factory);
  } else if (typeof exports === 'object' && typeof exports.nodeName !== 'string') {
    // CommonJS
    factory(exports, require('echarts'));
  } else {
    // Browser globals
    factory({}, root.echarts);
  }
}(this, (exports, echarts) => {
  const log = function (msg) {
    if (typeof console !== 'undefined') {
      console && console.error && console.error(msg);
    }
  };
  if (!echarts) {
    log('ECharts is not Loaded');
    return;
  }
  echarts.registerTheme('umpBlue', {
    color: [
      '#38b1eb',
      '#9bd8f5',
      '#2ec4b6',
      '#96e1da',
      '#f4ac32',
      '#fad291',
      '#ff3366',
      '#ff99b2',
      '#9353de'
    ],
    backgroundColor: 'rgba(0,0,0,0)',
    textStyle: {},
    title: {
      textStyle: {
        color: '#2a3e52'
      },
      subtextStyle: {
        color: '#4c637b'
      }
    },
    line: {
      itemStyle: {
        normal: {
          borderWidth: '1'
        }
      },
      lineStyle: {
        normal: {
          width: '1'
        }
      },
      symbolSize: '4',
      symbol: 'emptyCircle',
      smooth: false
    },
    radar: {
      itemStyle: {
        normal: {
          borderWidth: '1'
        }
      },
      lineStyle: {
        normal: {
          width: '1'
        }
      },
      symbolSize: '4',
      symbol: 'emptyCircle',
      smooth: false
    },
    bar: {
      itemStyle: {
        normal: {
          barBorderWidth: '0',
          barBorderColor: '#ffffff'
        },
        emphasis: {
          barBorderWidth: '0',
          barBorderColor: '#ffffff'
        }
      }
    },
    pie: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    scatter: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    boxplot: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    parallel: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    sankey: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    funnel: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    gauge: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        },
        emphasis: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      }
    },
    candlestick: {
      itemStyle: {
        normal: {
          color: '#ff3366',
          color0: '#314656',
          borderColor: '#ff3366',
          borderColor0: '#314656',
          borderWidth: 1
        }
      }
    },
    graph: {
      itemStyle: {
        normal: {
          borderWidth: '0',
          borderColor: '#ffffff'
        }
      },
      lineStyle: {
        normal: {
          width: '1',
          color: '#e3eaf3'
        }
      },
      symbolSize: '4',
      symbol: 'emptyCircle',
      smooth: false,
      color: [
        '#38b1eb',
        '#9bd8f5',
        '#2ec4b6',
        '#96e1da',
        '#f4ac32',
        '#fad291',
        '#ff3366',
        '#ff99b2',
        '#9353de'
      ],
      label: {
        normal: {
          textStyle: {
            color: '#ffffff'
          }
        }
      }
    },
    map: {
      itemStyle: {
        normal: {
          areaColor: '#ebf3fb',
          borderColor: '#ffffff',
          borderWidth: '1'
        },
        emphasis: {
          areaColor: 'rgba(227,234,243,1)',
          borderColor: '#ffffff',
          borderWidth: 1
        }
      },
      label: {
        normal: {
          textStyle: {
            color: '#4c637b'
          }
        },
        emphasis: {
          textStyle: {
            color: 'rgb(76,99,123)'
          }
        }
      }
    },
    geo: {
      itemStyle: {
        normal: {
          areaColor: '#ebf3fb',
          borderColor: '#ffffff',
          borderWidth: '1'
        },
        emphasis: {
          areaColor: 'rgba(227,234,243,1)',
          borderColor: '#ffffff',
          borderWidth: 1
        }
      },
      label: {
        normal: {
          textStyle: {
            color: '#4c637b'
          }
        },
        emphasis: {
          textStyle: {
            color: 'rgb(76,99,123)'
          }
        }
      }
    },
    categoryAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#4c637b'
        }
      },
      splitLine: {
        show: false,
        lineStyle: {
          color: [
            '#ccc'
          ]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0.3)',
            'rgba(200,200,200,0.3)'
          ]
        }
      }
    },
    valueAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#4c637b'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            '#ebf3fb'
          ]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0.3)',
            'rgba(200,200,200,0.3)'
          ]
        }
      }
    },
    logAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#4c637b'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            '#ebf3fb'
          ]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0.3)',
            'rgba(200,200,200,0.3)'
          ]
        }
      }
    },
    timeAxis: {
      axisLine: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisTick: {
        show: true,
        lineStyle: {
          color: '#ebf3fb'
        }
      },
      axisLabel: {
        show: true,
        textStyle: {
          color: '#4c637b'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: [
            '#4c637b'
          ]
        }
      },
      splitArea: {
        show: false,
        areaStyle: {
          color: [
            'rgba(250,250,250,0.3)',
            'rgba(200,200,200,0.3)'
          ]
        }
      }
    },
    toolbox: {
      iconStyle: {
        normal: {
          borderColor: '#ced9e5'
        },
        emphasis: {
          borderColor: '#4c637b'
        }
      }
    },
    legend: {
      textStyle: {
        color: '#4c637b'
      }
    },
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#1497d6',
          width: 1
        },
        crossStyle: {
          color: '#1497d6',
          width: 1
        }
      }
    },
    timeline: {
      lineStyle: {
        color: '#9fb3ca',
        width: 1
      },
      itemStyle: {
        normal: {
          color: '#9fb3ca',
          borderWidth: 1
        },
        emphasis: {
          color: '#38b1eb'
        }
      },
      controlStyle: {
        normal: {
          color: '#9fb3ca',
          borderColor: '#9fb3ca',
          borderWidth: 0.5
        },
        emphasis: {
          color: '#9fb3ca',
          borderColor: '#9fb3ca',
          borderWidth: 0.5
        }
      },
      checkpointStyle: {
        color: '#38b1eb',
        borderColor: 'rgba(56,177,235,1)'
      },
      label: {
        normal: {
          textStyle: {
            color: '#9fb3ca'
          }
        },
        emphasis: {
          textStyle: {
            color: '#9fb3ca'
          }
        }
      }
    },
    visualMap: {
      color: [
        '#38b1eb',
        '#ebf3fb'
      ]
    },
    dataZoom: {
      backgroundColor: 'rgba(202,77,117,0)',
      dataBackgroundColor: 'rgba(47,69,84,0.3)',
      fillerColor: 'rgba(167,183,204,0.4)',
      handleColor: '#a7b7cc',
      handleSize: '100%',
      textStyle: {
        color: '#333'
      }
    },
    markPoint: {
      label: {
        normal: {
          textStyle: {
            color: '#ffffff'
          }
        },
        emphasis: {
          textStyle: {
            color: '#ffffff'
          }
        }
      }
    }
  });
}));
