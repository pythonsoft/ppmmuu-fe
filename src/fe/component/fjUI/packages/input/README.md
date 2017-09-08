# input

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| size | 尺寸 | string | large,small,mini | - | ❌(small✅) |
| type | 类型 | string | text,textarea | text | ✅ |
| placeholder | 输入框占位 | string | — | - | ✅ |
| disabled | 禁用 | boolean | — | false | ✅ |
| readonly | 是否只读 | boolean | — | false | ✅ |
| rows | 输入框行数 | number | — | 2 | ✅ |
| icon | 输入框尾部图标 | string | — | - | ✅ |
| theme | 输入框主题样式 | string | stroke, fill, drak | stroke | ✅ |

...原生属性

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| blur |  | event | ✅ |
| focus |  | event | ✅ |
| change |  | value | ✅ |
| on-icon-click | 点击input内的图标的钩子函数 | event | ✅ |
