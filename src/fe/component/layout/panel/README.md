# panel

### attributes
| 参数      | 说明          | 类型      | 可选值                           | 默认值  | 实现  |
|---------- |-------------- |---------- |--------------------------------  |-------- |-------- |
| parentSize | 当前容器的width和height | object | { width: 0, height: 0 } | { width: 0, height: 0  | ✅ |
| panels | 布局表达式 | string | #:parentSize参数中的height或是width,根据direction决定，如果是x, 那么为width, p0-n:代表区块，如果表达式为: '31,#-p0',如果为y方向，那么第一部门的高为31px, #-p0代表着，parentSize.height - 31, 31为第一个区块的值 | false | ✅ |
| direction | 布局方向 | string | x:水平布局,y:垂直布局 | x | ✅ |
| canResize | 是否可以改变拖动 | boolean | - | true | ✅ |

