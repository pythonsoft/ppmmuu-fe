<template>
  <fj-dialog
    title="模版选择"
    :visible.sync="dialogVisible"
    @close="closeDialog">
    <div class="transcode-browser-content">
      <fj-table style="font-size: 12px;" :data="tableData" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20"></fj-table-column>
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click.stop.prevent="closeDialog">取消</fj-button><!--
      --><fj-button type="info" @click.stop.prevent="addTemplate">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const templateAPI = require('../../../api/processTemplate');

  export default {
    name: 'transcodeBrowserView',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        currentRows: [],
      };
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.listTemplate();
          this.selectedRows = [];
        }
      },
      visible(val) {
        this.dialogVisible = val;
      }
    },
    methods: {
      listTemplate() {
        const param = {
          page: 1,
          pageSize: 999,
          groupName: '入库'
        };
        templateAPI.list({ params: param }, this).then((res) => {
          this.tableData = res.data.docs;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      addTemplate() {
        if(!this.currentRows || !this.currentRows.length){
          this.$message.error('请先选中一个模板');
        }else {
          this.$emit('confirm', this.currentRows);
          this.closeDialog();
        }
      },
      handleSelectionChange(rows) {
        if (rows.length > 0) {
          this.currentRows = rows;
        }
      },
      closeDialog() {
        this.$emit('update:visible', false);
      }
    }
  };
</script>
<style>
  .transcode-browser-content {
    overflow: scroll;
    max-height: 500px;
  }
</style>
