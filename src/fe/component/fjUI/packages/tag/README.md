# tag

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| type | 主题 | string | primary/success/warning/danger | - | ✅ |
| closable | 是否可关闭 | boolean | — | false | ✅ |
| clickable | 是否可点击 | boolean | — | false | ✅ |

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| close | 关闭tag时触发的事件 | - | ✅ |
| click | clickable为true的tag点击时触发的事件 | - | ✅ |
