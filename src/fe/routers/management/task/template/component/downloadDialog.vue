<template>
  <fj-dialog
    title="下载地址选择列表"
    :visible.sync="dialogVisible"
    @close="close">
    <div class="bucket-browser-content">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" width="160" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" @click="dialogConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const api = require('../../../../../api/template');
  const config = require('../../config');

  export default {
    name: 'mediaCenterDownloadDialogView',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) {
          this.listTemplate();
        } else {
          this.tableData = [];
        }
      }
    },
    data() {
      return {
        tableData: [],
        currentRow: {},
        dialogVisible: this.visible
      };
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      handleCurrentChange(current) {
        this.currentRow = current;
      },
      dialogConfirm() {
        this.$emit('confirm', this.currentRow);
        this.close();
      },
      listTemplate() {
        const me = this;
        const templateType = config.getConfig('NODE_TEMPLATE');

        const param = {
          page: 1,
          pageSize: 100,
          type: templateType.DOWNLOAD.value
        };

        api.list({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
        }).catch((error) => {
          me.$message.error(error);
        });
      }
    }
  };
</script>
