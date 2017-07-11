# dialog

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| visible | 是否显示dialog, 支持.sync修饰符 | boolean | - | false | ✅ |
| title | 标题 | string | - | - | ✅ |
| top | dialog的top值 | string | - | 200px | ✅ |
| width | dialog的width值 | string | - | 460px | ✅ |
| modal | 是否需要遮罩层 | boolean | - | true | ✅ |
| show-close | 是否显示关闭按钮 | boolean | - | true | ✅ |
| close-on-click-modal | 是否通过点击遮罩层关闭dialog | boolean | - | false | ✅ |

### slot
| name | 说明 | 实现 |
|---------|--------|--------|
| - | dialog内容 | ✅ |
| title | dialog标题区内容 | ✅ |
| footer | dialog底部按钮操作区 | ✅ |


### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| close | dialog关闭时的回调函数 | - | ✅ |
| open | dialog打开时的回调函数 | - | ✅ |
