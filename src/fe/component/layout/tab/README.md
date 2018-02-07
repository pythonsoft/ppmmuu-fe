# panel

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| menus | 菜单 | Array | [{key: '0', label: '全部', active: false}] 其中active如果为true表示选中 | null  | ✅ |


### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| tab-click | tab 被选中时触发 | 被选中的menus的index | ✅ |