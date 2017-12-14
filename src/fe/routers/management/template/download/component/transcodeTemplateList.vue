<template>
  <div>
    <div :style="{ lineHeight: '36px' }">
      <fj-button type="primary" size="mini" @click.stop.prevent="dialogVisible = true">增加</fj-button>
      <fj-button type="danger" size="mini" @click.stop.prevent="deleteTemplate" :disabled="!deletable">删除</fj-button>
    </div>
    <div :style="{ borderTop: '1px solid #EBF3FB', marginTop: '20px' }">
      <fj-table :data="data" @selection-change="selectedTableSelectionChange">
        <fj-table-column type="selection" width="20"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="code" label="模板编码"></fj-table-column>
      </fj-table>
    </div>
    <fj-dialog
      title="转码模版"
      :visible.sync="dialogVisible"
      @close="closeDialog">
      <div :style="{ maxHeight: '300px', overflow: 'auto', border: '1px solid #CED9E5' }">
        <fj-table :data="tableData" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20"></fj-table-column>
          <fj-table-column prop="name" label="名称"></fj-table-column>
          <fj-table-column prop="code" label="模板编码"></fj-table-column>
        </fj-table>
      </div>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop.prevent="closeDialog">取消</fj-button><!--
        --><fj-button type="primary" @click.stop.prevent="addTemplate">添加</fj-button>
      </div>
    </fj-dialog>
  </div>
</template>
<script>
  const templateAPI = require('../../../../../api/job');

  export default {
    props: {
      data: Array
    },
    data() {
      return {
        dialogVisible: false,
        deletable: false,
        tableData: [],
        selectedRows: [],
        selectedTableSelectedRows: []
      };
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.listTemplate();
          this.selectedRows = [];
        }
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
        this.$emit('add-template', this.selectedRows);
        this.dialogVisible = false;
      },
      deleteTemplate() {
        this.$emit('delete-template', this.selectedTableSelectedRows);
      },
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      selectedTableSelectionChange(rows) {
        if (rows.length) {
          this.deletable = true;
        } else {
          this.deletable = false;
        }
        this.selectedTableSelectedRows = rows;
      },
      closeDialog() {
        this.dialogVisible = false;
      }
    }
  };
</script>
