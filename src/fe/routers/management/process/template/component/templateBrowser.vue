<template>
  <fj-dialog
    :title="title"
    :visible.sync="dialogVisible"
    @close="closeDialog">
    <div class="transcode-browser-content">
      <fj-table style="font-size: 12px;" :data="tableData" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名字"><template slot-scope="props">{{getName(props.row)}}</template></fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click.stop.prevent="closeDialog">取消</fj-button><!--
      --><fj-button type="info" @click.stop.prevent="addTemplate">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import { TYPE_MAP } from '../config';
  const templateAPI = require('../../../../../api/processTemplate');

  export default {
    name: 'processTemplateBrowserView',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      type: { type: String },
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        currentRow: {},
        title: '模板',
      };
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.title = TYPE_MAP[this.type] + '模板';
          this.listTemplate();
          this.selectedRows = [];
        }
      },
      visible(val) {
        this.dialogVisible = val;
      },
    },
    methods: {
      listTemplate() {
        const param = {
          type: this.type
        };
        templateAPI.getTemplateListByType({ params: param }, this).then((res) => {
          this.tableData = res.data.docs;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      addTemplate() {
        if(!this.currentRow || !this.currentRow._id){
          this.$message.error('请先选中一个模板');
        }else {
          this.$emit('confirm', this.currentRow);
          this.closeDialog();
        }
      },
      getName(row) {
        if (row.name) {
          return row.name;
        }

        if (row.department && row.department.name) {
          row.name = row.department.name;
          return row.department.name;
        }

        return '';
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
