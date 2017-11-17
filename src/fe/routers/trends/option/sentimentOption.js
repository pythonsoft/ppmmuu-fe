export const convertOpinionData = function (data) {
  data.forEach((item) => {
    item.name = item.title;
    item.value = item.people;
  });
  return data;
};
export const convertSentimentData = function (data) {
  const sentiments = ['正面', '中立', '负面'];
  const res = [];
  sentiments.forEach((sentiment, i) => {
    res.push({ name: sentiment, value: data[i] });
  });
  return res;
};

export const sentimentOption = {
  title: {
    text: '舆情观点',
    textStyle: {
      fontSize: '12',
      fontWeight: 'normal',
      color: '#2A3E52',
      align: 'left'
    }
  },
  tooltip: {
    trigger: 'item',
    textStyle: {
      fontSize: 12
    },
    backgroundColor: 'rgba(42, 62, 82, .8)',
    formatter: '{a}: {b} <br/> {c} ({d}%)'
  },
  series: [
    {
      name: '情感',
      type: 'pie',
      radius: [0, '30%'],
      stillShowZeroSum: false,
      label: {
        normal: {
          position: 'inner',
          formatter(params) {
            const data = params.data;
            return data.value > 0 ? data.name : '';
          }
        }
      },
      labelLine: {
        normal: {
          show: false
        }
      },
      data: []
    },
    {
      name: '观点',
      type: 'pie',
      selectedMode: 'single',
      radius: ['40%', '55%'],
      stillShowZeroSum: false,
      label: {
        normal: {
          formatter(params) {
            const data = params.data;
            let title = data.title.slice(0, 10);
            if (data.title.length > 10) {
              title += '...';
            }
            return `${title}  ${params.percent}%`;
          },
          color: '#4C637B',
          backgroundColor: '#EBF3FB',
          borderRadius: 4,
          padding: [2, 5],
          rich: {
            b: {
              fontSize: 12,
              lineHeight: 17
            }
          }
        }
      },
      labelLine: {
        normal: {
          lineStyle: {
            color: '#CED9E5'
          }
        }
      },
      data: []
    }
  ]
};
