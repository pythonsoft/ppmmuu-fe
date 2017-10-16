# select

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| multiple | 是否多选(value为数组，暂不支持键盘事件) | boolean | — | false | ✅ |
| size | 尺寸 | string | large,small,mini | - | (同input) |
| placeholder | 输入框占位 | string | — | - | ✅ |
| disabled | 禁用 | boolean | — | false | ✅ |
| clearable | 是否可以清空 | boolean | — | false | ✅ |
| remote | 是否为远程搜索 | boolean | — | false | ✅ |
| remote-method | 远程搜索的方法 | function | — | - | ✅ |
| history-method | 获取历史记录的方法 | function | — | - | ✅ |
| clear-history-method | 清空历史记录的方法 | function | — | - | ✅ |
| loading | 是否正在从远程获取数据 | boolean | — | false | ✅ |
| theme | 输入框主题样式 | string | stroke, fill, dark | stroke | ✅ |
