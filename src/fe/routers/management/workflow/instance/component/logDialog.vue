<template>
  <fj-slide-dialog
    title="执行日志"
    :visible.sync="dialogVisible"
    width="740px"
    @close="close">
    <div :class="$style.btn">
      <fj-button type="primary" size="mini" @click="updateDetail">刷新</fj-button>
    </div>
    <fj-table :data="tableData">
      <fj-table-column prop="status" width="90" align="center" label="状态">
        <template slot-scope="props"><div v-html="formatStatus(props.row.status)"></div></template>
      </fj-table-column>
      <fj-table-column prop="name" label="名称"></fj-table-column>
      <fj-table-column prop="parms" label="参数" width="126">
        <template slot-scope="props">
          <i :class="['iconfont icon-global', $style.iconfont]" @click="updateParms('global', props.row)"></i>
          <i :class="['iconfont icon-in', $style.iconfont]" @click="updateParms('in', props.row)"></i>
          <i :class="['iconfont icon-out', $style.iconfont]" @click="updateParms('out', props.row)"></i>
        </template>
      </fj-table-column>
      <fj-table-column prop="createTime" width="160" label="创建时间">
        <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
      </fj-table-column>
      <fj-table-column prop="completedTime" width="160" label="完成时间">
        <template slot-scope="props">{{ props.row.completedTime | formatTime }}</template>
      </fj-table-column>
    </fj-table>
    <parms-dialog :visible.sync="isShowParmsDialog" :info="parms"></parms-dialog>
  </fj-slide-dialog>
</template>
<script>
  import ParmsDialog from './parmsDialog';
  import { formatQuery } from '../../../../../common/utils';
  const api = require('../../../../../api/wokflow');
  export default {
    components: {
      ParmsDialog
    },
    props: {
      id: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        tableData: [],
        isShowParmsDialog: false,
        parms: {}
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) this.updateDetail();
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      formatStatus(status) {
        return status;
      },
      updateDetail() {
        api.workflow_instance_log_list(formatQuery({ workflowInstanceId: this.id }, true), this).then((res) => {
          this.tableData = res.data;
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      updateParms(type, row) {
        this.parms = row[type];
        this.isShowParmsDialog = true;
      }
    }
  };
</script>
<style module>
  .btn {
    text-align: right;
    margin-bottom: 10px;
  }
  .iconfont {
    color: #9FB3CA;
    font-size: 14px;
  }
  .iconfont:hover {
    color: #4C637B;
  }
  .iconfont:active {
    color: #38B1EB;
  }
  .iconfont+.iconfont {
    margin-left: 20px;
  }
</style>
