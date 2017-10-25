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
            result = ?
          </pre>
        </li>
        <li>
          <div class="title">4、示例</div>
          <pre>
      if(fileInfo.ext === '.mxf') {
            const keys = Object.keys(transcodeTemplates);
            result = keys.length ? keys[0] : '';
          }

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
          { name: 'downloadTemplate', description: '当前下载模板的信息' },
          { name: 'transcodeTemplates', description: '当前转码模板信息，如：transcodeTemplates.转码模板ID.属性' },
          { name: 'fileInfo', description: '文件信息，{ ext: "后缀", name: "文件名" }，如：fileInfo.ext' },
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
