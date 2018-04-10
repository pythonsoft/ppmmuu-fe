# datePicker

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| type | 显示类型 | string | date/datetime/daterange/datetimerange | datetime | ✅(datetime) |
| direction | 输入框方向（仅在type为datetimerange时生效 | string | vertical/horizontal | vertical | ✅ |
| size | 输入框尺寸 | string | large, small, mimi | - | ✅ |
| clearable | 是否显示清除按钮 | boolean | true/false | true | ✅ |
| placeholder | 占位内容 | string | - | - | ✅ |
| theme | 输入框主题样式 | string | stroke, fill | fill | ✅ |
| pickerPosition | 选择器位置 | string | left/right | left | ✅ |
| format | 时间日期格式化 | string | 年YYYY, 月MM, 日DD, 小时HH, 分钟mm, 秒ss | YYYY-MM-DD HH:mm:ss | ✅ |


### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
|  |  |  |  |
