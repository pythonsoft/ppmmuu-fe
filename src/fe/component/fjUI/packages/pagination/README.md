# pagination

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| page-size | 每页显示条目个数 | number | - | 20 | ✅ |
| total | 总条目数 | number | - | - | ✅ |
| current-page | 当前页数 | number | - | - | ✅ |


### events
| 事件名称 | 说明 | 回调参数 | 实现 |
|---------|--------|---------|-------- |
| current-change | currentPage改变时触发 | 当前页currentPage | ✅ |
