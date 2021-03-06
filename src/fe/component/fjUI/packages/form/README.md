# form

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| model | 表单数据对象 | object | - | - | ✅ |
| custom-class | 表单自定义类 | string | - | - | ✅ |
| rules | 表单验证规则 | object | — | - | ✅ |
| label-width | 表单域标签的宽度 | string | — | - | ✅ |
| label-position | 表单域标签的位置 | string | left/top | left | ✅ |

### form methods
| 事件名称 | 说明 | 参数 | 实现 |
|---------|--------|---------|-------- |
| validate | 对表单进行校验的方法 | Function(callback:Function(boolean)) | ✅ |
| clearErrors | 清除表单错误提示 | Function() | ✅ |

## form-item

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现 |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| label | 标签文本 | string | - | - | ✅ |
| label-width | 表单域标签的宽度 | string | — | - | ✅ |
| prop | 表单验证规则的名称 | string | — | - | ✅ |
| required | 是否显示必填图标（若不设置可由验证规则自动生成 | bolean | — | false | ✅ |
