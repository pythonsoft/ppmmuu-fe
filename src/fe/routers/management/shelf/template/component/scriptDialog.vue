<template>
  <fj-dialog
    title="脚本说明"
    :visible.sync="display"
    width="800px"
    @close="close">
    <div class="template-script-content">
      <ul>
        <li>
          <div class="title">1.paths变量使用方法${paths.变量名}</div>
        </li>
        <li>
          <div class="title">2.可使用的全局变量为</div>
          <fj-table style="font-size: 12px;" :data="tableData" name="table">
            <fj-table-column prop="name" label="变量"></fj-table-column>
            <fj-table-column prop="description" label="说明"></fj-table-column>
          </fj-table>
        </li>
        <li>
          <div class="title">3、脚本最终结果需进行如下赋值</div>
          <pre>
            result = ? // result是数组，他的元素的值和转码模板数组一一对应
          </pre>
        </li>
        <li>
          <div class="title">4、示例</div>
          <pre>
            const pathA = ${paths.A};
            const result = [];

            let storagePath = [
              pathA.windowsStoragePath,
              userInfo.name,
              year,
              month,
              day
            ].join('/');

            result.push(storagePath);
            result.push(storagePath);
          </pre>
        </li>
      </ul>
    </div>
  </fj-dialog>
</template>
<script>
  export default {
    name: 'scriptDialogView',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        display: false,
        tableData: [
          { name: 'userInfo', description: '运行脚本的用户信息，如：userInfo.name' },
          { name: 'bucketInfo', description: '当前存储区信息，如：bucketInfo.name' },
          { name: 'paths', description: '可以全到当前存储区下所有的路径信息，如：${paths.路径ID}' },
          { name: 'year', description: '脚本运行时的年份，如:2017' },
          { name: 'month', description: '脚本运行时的月份，如:09' },
          { name: 'day', description: '脚本运行时的日期，如:15' }
        ]
      };
    },
    watch: {
      visible(v) {
        this.display = v;
      }
    },
    created() {},
    methods: {
      close() {
        this.$emit('update:visible', false);
      }
    }
  };
</script>
<style>
  .template-script-content li{
    padding: 4px 0;
  }
  .template-script-content .title{
    padding: 4px 0;
  }
  .template-script-content pre{
    padding: 4px;
    border: 1px solid #E3EAF3;
    border-radius: 2px;
    background: #F8FAFB;
  }
</style>
