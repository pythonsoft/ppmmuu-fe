const legend = ['新闻', '百度', '微博', '微信', '论坛', '博客'];
const getEmptyData = function () {
  const data = [];
  for (let i = 0; i < 7; i++) {
    data.push(0);
  }
  return data;
};
export const getTrendSeries = function (data = {}) {
  const res = [];
  const item = {
    type: 'line',
    stack: '总量',
    areaStyle: { normal: {} }
  };
  for (let i = 0; i < legend.length; i++) {
    const name = legend[i];
    item.name = name;
    item.data = data[name] ? data[name].latest : getEmptyData();
    res.push(Object.assign({}, item));
  }
  return res;
};

const getHours = function () {
  const hours = [];
  for (let i = 0; i < 6; i++) {
    const start = i * 4;
    let hour = '';
    if (start + 3 < 10) {
      hour = `0${start}:00-0${start + 3}:59`;
    } else if (start < 10 && start + 3 > 10) {
      hour = `0${start}:00-${start + 3}:59`;
    } else {
      hour = `${start}:00-${start + 3}:59`;
    }
    hours.push(hour);
  }
  return hours;
};

export const spreadTrendOption = {
  title: {
    text: '传播趋势分析',
    textStyle: {
      fontSize: '12',
      fontWeight: 'normal',
      color: '#2A3E52',
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
    data: legend,
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
      data: getHours()
    }
  ],
  yAxis: [
    {
      type: 'value'
    }
  ],
  series: getTrendSeries()
};
