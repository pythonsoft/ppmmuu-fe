# table

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| showThead | 是否显示表头 | boolean | - | true | ✅ |
| data | 显示的数据 | array | - | - | ✅ |
| empty-text | 空数据时显示的文本内容，也可以通过slot="empty"设置 | string | - | 暂无数据 | ✅ |


### table-column attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| type | 列的类型（selection多选框／expand可展开的按钮 | string | selection/expand | - | ✅(selection) |
| prop | 列内容的字段名 | string | - | - | ✅ |
| label | 显示的标题 | string | - | - | ✅ |
| width | 列的宽度 | string | - | - | ✅ |
| align | 对齐方式 | string | left/center/right | left | ✅ |

scope字段数据：{row, column, rowIndex, store}

### table methods
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| clearSelection | 用于多选表格清空用户选择 | - | ✅ |

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| selection-change | 当选择项发生变化时 | selection | ✅ |
| current-change | 当单选表格的选择项发生变化时，如果要高亮当前行，则需要打开表格的highlight-current-row属性 | currentRow, oldCurrentRow | ✅ |
