export const convertPieData = function (data, key, formatter) {
  data.forEach((item) => {
    item.name = item.Name;
    item.value = item[key];
    item.displayValue = formatter ? formatter(item[key]) : item[key];
  });
  return data;
};
export const convertPieLegend = function (data) {
  return data.map(item => item.Name);
};

export const pieOption = {
  title: {
    text: '饼状图',
    x: 'center',
    textStyle: {
      fontSize: '12',
      fontWeight: 'bold',
      color: '#303641'
    }
  },
  tooltip: {
    trigger: 'item',
    textStyle: {
      fontSize: 12
    },
    backgroundColor: 'rgba(42, 62, 82, .8)',
    // formatter: '{b} <br/> {c} ({d}%)'
    formatter(params) {
      return `${params.name}<br/>${params.data.displayValue}(${params.percent}%)`;
    }
  },
  legend: {
    y: 'bottom'
  },
  series: [
    {
      name: '饼状图',
      type: 'pie',
      itemStyle: {
        normal: {
          borderColor: '#fff',
          borderWidth: 1
        }
      },
      label: {
        normal: {
          formatter: '{d}%',
          position: 'inner'
        }
      },
      data: []
    }
  ]
};
