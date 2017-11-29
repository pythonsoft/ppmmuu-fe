export const convertGraph = function (data) {
  data.nodes.forEach((node) => {
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
    symbolSize: 24,
    label: {
      normal: {
        show: false
      },
      emphasis: {
        show: true,
        position: 'right',
        color: '#fff',
        fontSize: 12,
        lineHeight: 16,
        backgroundColor: 'rgba(42, 62, 82, .8)',
        padding: 10,
        borderRadius: 5,
        rich: {
          content: {
            lineHeight: 16
          },
          border: {
            height: 0,
            width: '100%',
            borderWidth: 0.5,
            borderColor: '#9FB3CA',
            lineHeight: 10
          }
        },
        formatter(params) {
          let content = '';
          const data = params.data;
          if (data && data.content) {
            const strArr = data.content.replace(/\n+/g, '<br/>').split('<br/>');
            for (let i = 0; i < strArr.length; i++) {
              const length = strArr[i].length;
              let index = 0;
              while (index < length && length > 0) {
                content += `${strArr[i].slice(index, index + 20)}\n`;
                index += 20;
              }
            }
          }
          return `{content|${content}}{border|} \n${data.user_name} \n粉丝数：${data.followers_count} \n转发数：${data.retweet_count}`;
        }
      }
    },
    draggable: true,
    data: [],
    force: {
      // initLayout: 'circular'
      repulsion: 40,
      edgeLength: 80
      // repulsion: 100
      // gravity: 0.2
    },
    edges: [],
    lineStyle: {
      normal: {
        width: 1,
        color: '#CED9E5'
      }
    }
  }]
};
