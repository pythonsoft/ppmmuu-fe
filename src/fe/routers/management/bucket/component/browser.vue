<template>
  <fj-dialog
    title="存储区选择器"
    :visible.sync="dialogVisible"
    @close="close">
    <div class="bucket-browser-content">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态" >
          <template slot-scope="props"><div v-html="formatStatus(props.row.status)"></div></template>
        </fj-table-column>
        <fj-table-column prop="_id" width="150" label="标识" ></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="type" label="存储类型">
          <template slot-scope="props">{{ formatType(props.row.type) }}</template>
        </fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import utils from '../../../../common/utils';

  const api = require('../../../../api/storage');
  const config = require('../config');

  export default {
    name: 'bucketBrowserView',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: this.visible,
        tableData: [],
        currentRow: {}
      };
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.list();
        } else {
          this.tableData = [];
        }
      },
      visible(val) {
        this.dialogVisible = val;
      }
    },
    created() {},
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      list() {
        const me = this;

        api.listBucket({ params: me.formData }, me)
          .then((res) => {
            me.tableData = res.data.docs;
            me.total = res.data.total;
          }).catch((error) => {
            me.$message.error(error);
          });

        return false;
      },
      formatType(v) {
        return utils.getTextByValue(config, v, 'TYPE');
      },
      formatStatus(v) {
        if (v === config.STATUS.NORMAL.value) {
          return '<span class="bucket-status-span bucket-enable">正常</span>';
        }
        return '<span class="bucket-status-span bucket-disable">挂起</span>';
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      addOwnerConfirm() {
        this.$emit('confirm', this.currentRow);
        this.close();
      },
      handleCurrentChange(current) {
        this.currentRow = current;
      }
    }
  };
</script>
