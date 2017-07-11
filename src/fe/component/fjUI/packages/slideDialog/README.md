# slide-dialog

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| visible | 是否显示, 支持.sync修饰符 | boolean | - | false | ✅ |
| title | 标题 | string | - | - | ✅ |
| width | slide-dialog的width值 | string | - | 468px | ✅ |
| show-close | 是否显示关闭按钮 | boolean | - | true | ✅ |

### slot
| name | 说明 | 实现 |
|---------|--------|--------|
| - | slide-dialog内容 | ✅ |
| title | slide-dialog标题区内容 | ✅ |
| footer | slide-dialog底部按钮操作区 | ✅ |


### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| close | slide-dialog关闭时的回调函数 | - | ✅ |
| open | slide-dialog打开时的回调函数 | - | ✅ |
