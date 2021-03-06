export const convertLineSeries = function (data = {}, legend = [], key = '', type = '') {
  if (legend.length === 0) {
    return [{ type: 'line', data: [] }];
  }
  const res = [];
  const seriesItem = {
    type: 'line',
    smooth: true
  };
  for (let i = 0; i < legend.length; i++) {
    const name = legend[i];
    seriesItem.name = name;
    seriesItem.data = data[name].map(item => (type ? item[type][key] : item[key]));
    res.push(Object.assign({}, seriesItem));
  }
  return res;
};

export const lineOption = {
  backgroundColor: '#fff',
  title: {
    text: '曲线图',
    textStyle: {
      fontSize: '12',
      fontWeight: 'bold',
      color: '#303641',
      align: 'left'
    }
  },
  tooltip: {
    trigger: 'axis',
    textStyle: {
      fontSize: 12
    },
    backgroundColor: 'rgba(42, 62, 82, .8)',
    axisPointer: {
      type: 'cross',
      label: {
        backgroundColor: 'rgba(42, 62, 82, .8)'
      }
    }
  },
  legend: {
    data: [],
    right: 0
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  xAxis: [
    {
      type: 'category',
      boundaryGap: false,
      data: []
    }
  ],
  yAxis: [
    {
      type: 'value',
      axisLabel: {},
      axisPointer: false,
      nameTextStyle: {
        color: '#2A3E52'
      }
    }
  ],
  series: [{
    type: 'line',
    data: []
  }]
};
