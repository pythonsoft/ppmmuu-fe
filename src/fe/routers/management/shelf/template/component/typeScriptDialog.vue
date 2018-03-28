<template>
  <fj-dialog
    title="脚本说明"
    :visible.sync="display"
    width="800px"
    @close="close">
    <div class="template-script-content">
      <ul>
        <li>
          <div class="title">转码后的文件格式</div>
        </li>
        <li>
          <div class="title">2.文件格式说明</div>
          <fj-table style="font-size: 12px;" :data="tableData" name="table">
            <fj-table-column prop="name" label="文件格式"></fj-table-column>
            <fj-table-column prop="value" label="对应值"></fj-table-column>
          </fj-table>
        </li>
        <li>
          <div class="title">3、脚本最终结果需进行如下赋值</div>
          <pre>
            result = ? // result是数组，他的元素的值和转码模板数组一一对应
          </pre>
        </li>
        <li>
          <div class="title">4、示例(意思是转码后三种格式(1080P,360P,音频))</div>
          <pre>
            const result = ['6','7','8'];
          </pre>
        </li>
      </ul>
    </div>
  </fj-dialog>
</template>
<script>
  export default {
    name: 'typeScriptDialogView',
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
          { name: '高码流', value: '0' },
          { name: '低码流', value: '1' },
          { name: '字幕', value: '2' },
          { name: '缩略图', value: '3' },
          { name: '文档', value: '4' },
          { name: '其他', value: '5' },
          { name: '1080P', value: '6' },
          { name: '360P', value: '7' },
          { name: '音频', value: '8' },
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
