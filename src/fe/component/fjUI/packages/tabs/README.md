# tabs

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| vulue | 绑定值，选项卡中的name | string | - | - | ✅ |
| theme | tab主题 | string | normal, dark | normal | ✅ |
| custom-class, custom-header-class | 自定义类 | string | - | - | ✅ |


### tab-pane attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| label | 选项卡标题 | string | - | - | ✅ |
| disabled | 是否禁用 | boolean | - | false | ❌ |
| name | 选项卡标识符 | string | - | - | ✅ |

### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| tab-click | tab 被选中时触发 | 被选中的tab实例, index | ✅ |
