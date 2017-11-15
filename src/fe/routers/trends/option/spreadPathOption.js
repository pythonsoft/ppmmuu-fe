
export const convertGraph = function(data) {
  data.nodes.forEach(function (node) {
    node.value = node.impact_force;
    node.name = node.id;
    node.symbol = `image://${node.image_url}`;
    // node.symbolSize = node.impact_force;
    node.symbolSize = node.user_type === 'BigV' ? 32 : 24;
  });
  return data;
};

export const spreadPathOption = {
  title: {
    text: '传播路径分析',
    textStyle: {
        fontSize: '12',
        fontWeight: 'normal',
        color: '#2A3E52',
        align: 'left'
    }
  },
  tooltip: {
    show: false
    // trigger: 'item',
    // formatter: function(params) {
    //   return `${params.data.user_name}<br/>粉丝数：${params.data.followers_count}<br/>转发数：${params.data.retweet_count}`;
    // }
  },
  series: [{
    type: 'graph',
    layout: 'force',
    animation: false,
    symbolSize: 30,
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: true,
        position: 'right',
        color: '#fff',
        fontSize: 14,
        lineHeight: 17,
        backgroundColor: 'rgba(42, 62, 82, .8)',
        padding: 10,
        borderRadius: 5,
        formatter: function(params) {
          let content = '';
          if (params.data && params.data.content) {
            const length = params.data.content.length;
            let index = 0;
            while (index <= length && length > 0) {
              content += params.data.content.slice(index, index + 20) + '\n';
              index += 20;
            }
          }
          return `${content} \n${params.data.user_name} \n粉丝数：${params.data.followers_count} \n转发数：${params.data.retweet_count}`;
        }
      }
    },
    draggable: true,
    data: [],
    // categories: webkitDep.categories,
    force: {
        // initLayout: 'circular'
        // repulsion: 20,
        edgeLength: 80,
        repulsion: 100,
        // gravity: 0.2
    },
    edges: [],
    lineStyle: {
      normal: {
        width: 1,
        color: '#CED9E5'
      }
    },
  }]
};
