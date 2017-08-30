# tabs

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| data | 展示数据 | array | - | - | ✅ |
| node-key | 每个树节点的唯一标识属性 | string | - | id | ✅ |
| indent | 缩进值 | string | - | 10 | ✅ |
| node-style | 节点样式 | object | - | - | ✅ |
| render-content | 树节点内容的渲染函数 | function(h, {node}) | - | - | ✅ |
| theme | tab主题 | string | normal, dark | normal | ✅ |

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| node-click | 节点被点击时的回调 | 被选中的node | ✅ |
| current-change | 当前选中节点变化时触发的事件 | 被选中的node | ✅ |
| node-expand | 节点被展开时触发的事件 | 被选中的node | ✅ |
| node-collapse | 节点被关闭时触发的事件 | 被选中的node | ✅ |
