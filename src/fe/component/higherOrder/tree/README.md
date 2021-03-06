# button

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| nodeKey | 每个树节点的唯一标识属性 | string | - | _id | ✅ |
| title | 左上角文字内容 | string | — | 分组 | ✅ |
| addBtnText | 右上按键的文字显示 | string | — | 添加组 | ✅ |
| vueInstance | 用于消息传递的vue实例 | object | — | - | ✅ |
| menus | 设置触发的下拉菜单列表 { group: [ { name: '删除分组', command: 'deleteGroup' }, ]}  | object | — | {} | ✅ |
| commandFieldName | 设置原始数据中哪个字段的值对应menu中的key | string | — | - | ✅ |
| showUpper | 是否显示顶部标题栏 | boolean | — | true | ✅ |
| autoFetchData | 是否在点树结点的时候自动获取子结点 | boolean | — | true | ✅ |

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| treeNodeClick | 节点被点击时的回调 | 被选中的node | ✅ |
| treeNodeCurrentChange | 当前选中节点变化时触发的事件 | 被选中的node | ✅ |
| treeNodeExpand | 节点被展开时触发的事件 | 被选中的node | ✅ |
| treeNodeCollapse | 节点被关闭时触发的事件 | 被选中的node | ✅ |
| btnClick | 添加按钮被点击时的回调 | 被选中的node | ✅ |
| listGroup | 列举结点的接口 | 被选中的node的id, 回调参数，用于执行获取结果后续操作 | ✅ |
| execCommand | 下拉菜单被点中时回调 | 触发的命令名, 被选中的node, 添加结点及移除结点的两个方法(object类型) | ✅ |
| renderContent | 渲染树结点方法 | - | ✅ |

