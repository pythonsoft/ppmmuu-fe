<template>
  <fj-dialog
    title="转码模版"
    :visible.sync="dialogVisible"
    @close="closeDialog">
    <div class="transcode-browser-content">
      <fj-table style="font-size: 12px;" :data="tableData" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="code" label="模板编码"></fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click.stop.prevent="closeDialog">取消</fj-button><!--
      --><fj-button type="info" @click.stop.prevent="addTemplate">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const templateAPI = require('../../../../../api/job');

  export default {
    name: 'transcodeBrowserView',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        currentRow: {},
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
        };
        templateAPI.listTemplate({ params: param }, this).then((res) => {
          this.tableData = res.data.docs.map(item => {
            return { _id: item.id, name: item.templateName, code: item.templateCode };
          });
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      addTemplate() {
        if(!this.currentRow || !this.currentRow._id){
          this.$message.error('请先选中一个转码模板');
        }else {
          this.$emit('confirm', this.currentRow);
          this.closeDialog();
        }
      },
      handleCurrentChange(row) {
        this.currentRow = row;
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
