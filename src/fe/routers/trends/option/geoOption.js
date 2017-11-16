export const convertGeoData = function (data) {
  const keys = Object.keys(data);
  const res = [];
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (data[key].geoCoord) {
      res.push({
        name: key,
        value: data[key].geoCoord.concat(data[key].count)
      });
    }
  }
  return res;
};

export const geoOption = {
  backgroundColor: '#fff',
  tooltip: {
    trigger: 'item',
    textStyle: {
      fontSize: 12
    },
    backgroundColor: 'rgba(42, 62, 82, .8)',
    formatter(params) {
      return `${params.name}<br/>热门报道共${params.value[2]}篇`;
    }
  },
  geo: {
    map: 'china',
    roam: true,
    label: {
      emphasis: {
        show: false
      }
    },
    itemStyle: {
      normal: {
        areaColor: '#EBF3FB',
        borderColor: '#fff'
      },
      emphasis: {
        areaColor: '#E3EAF3'
      }
    }
  },
  series: [
    {
      name: '风向标',
      type: 'scatter',
      coordinateSystem: 'geo',
      data: [],
      symbolSize(val) {
        // return val[2] < 10 ? val[2] * 5 : val[2] * 2;
        return val[2] * 2;
      },
      label: {
        normal: {
          show: false
        },
        emphasis: {
          show: false
        }
      },
      itemStyle: {
        normal: {
          color: '#38B1EB'
        },
        emphasis: {
          borderColor: '#fff',
          borderWidth: 1
        }
      }
    },
    {
      name: 'Top 3',
      type: 'effectScatter',
      coordinateSystem: 'geo',
      data: [],
      symbolSize(val) {
        return val[2] * 2;
      },
      showEffectOn: 'render',
      rippleEffect: {
        brushType: 'stroke'
      },
      hoverAnimation: true,
      label: {
        normal: {
          formatter: '{b}',
          position: 'right',
          show: true
        }
      },
      itemStyle: {
        normal: {
          color: '#38B1EB',
          shadowBlur: 10,
          shadowColor: '#38B1EB'
        }
      },
      zlevel: 1
    }
  ]
};
