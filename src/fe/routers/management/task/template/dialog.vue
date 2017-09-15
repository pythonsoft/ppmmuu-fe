<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    :width="width"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog">
    <div class="task-slide-dialog-item-title">
      <div class="task-slide-dialog-item-bar">
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" :disabled="stopBtn.disabled" :loading="stopBtn.loading" @click="stopClick">停止</fj-button>
        </span>
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" :disabled="restartBtn.disabled" :loading="restartBtn.loading" @click="restartClick">重启</fj-button>
        </span>
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" :disabled="detailBtn.disabled" :loading="detailBtn.loading" @click="detailClick">详细</fj-button>
        </span>
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" :disabled="refreshBtn.disabled" :loading="refreshBtn.loading" @click="refreshClick">刷新</fj-button>
        </span>
      </div>
    </div>

    <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
      <fj-table-column prop="_type" width="100" align="center" label="类型">
        <template scope="props">
          {{ getCurrentStepConfig(props.row._type).text }}
        </template>
      </fj-table-column>
      <fj-table-column prop="status" width="50" align="center" label="状态">
        <template scope="props">
          <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
        </template>
      </fj-table-column>
      <fj-table-column prop="_path" width="220" label="路径">
        <template scope="props">
          <div class="task-wrap">{{ props.row._path }}</div>
        </template>
      </fj-table-column>
      <fj-table-column prop="_totalTime" label="时长"></fj-table-column>
      <fj-table-column prop="processRate" width="80" label="进度(%)" align="center"></fj-table-column>
      <fj-table-column prop="createTime" width="140" align="center" label="创建时间">
        <template scope="props">{{ props.row.createTime | formatTime }}</template>
      </fj-table-column>
    </fj-table>

    <fj-slide-dialog
      :title="childTaskTitle"
      :visible.sync="childSlideDialogVisible"
      :width="width"
      @open="handleChildTaskOpen"
      @close="handleChildTaskClose">
      <fj-table style="font-size: 12px;" :data="childTaskData" name="table" ref="table">
        <fj-table-column prop="key" width="100" label="key"></fj-table-column>
        <fj-table-column prop="value" label="value"></fj-table-column>
      </fj-table>
    </fj-slide-dialog>

  </fj-slide-dialog>

</template>
<script>
  import utils from '../../../../common/utils';

  const api = require('../../../../api/transcode');
  const config = require('../config');
  const common = require('../common');

  export default {
    name: 'engineBaseSlideDialogView',
    props: {
      parentInfo: { type: Object },
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible(v) {
        this.display = v;
        if (this.display) {
          this.listChildTask();
          this.runTimer = true;
          this.autoRefreshList();
        } else {
          this.tableData = [];
          this.childTaskData = [];
          this.runTimer = false;
        }
      }
    },
    data() {
      return {
        title: '所有子任务',
        display: false,
        width: '740px',

        tableData: [],

        stopBtn: {
          disabled: true,
          loading: false
        },
        restartBtn: {
          disabled: true,
          loading: false
        },
        detailBtn: {
          disabled: true,
          loading: false
        },

        refreshBtn: {
          disabled: false,
          loading: false
        },

        table: {
          currentRowInfo: {}
        },

        childSlideDialogVisible: false,
        childTaskData: [],
        childTaskTitle: '',

        runTimer: false
      };
    },
    created() {
      this.resetBtnStatus();
    },
    methods: {
      resetBtnStatus() {
        this.stopBtn = {
          disabled: true,
          loading: false
        };
        this.restartBtn = {
          disabled: true,
          loading: false
        };
        this.detailBtn = {
          disabled: true,
          loading: false
        };
        this.refreshBtn = {
          disabled: false,
          loading: false
        };
      },
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.stopBtn.disabled = !common.isTaskCanStop(current.status);
        this.restartBtn.disabled = !common.isTaskCanRestart(current.status);
        this.detailBtn.disabled = false;
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      handleOpenSlideDialog() {
      },
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      handleChildTaskOpen() {},
      handleChildTaskClose() {

      },
      cancelClick() {
        this.$emit('update:visible', false);
      },
      confirmFn() {

      },
      getStatus(v) {
        return config.getConfig('STATUS', v);
      },
      getCurrentStepConfig(v) {
        return config.getConfig('CURRENT_STEP', v);
      },
      formatData(data) {
        const order = data.order;
        const arr = [];
        let temp = null;

        for (let i = 0, len = order.length; i < len; i++) {
          temp = data[order[i]];
          if (temp) {
            for (let j = 0, l = temp.length; j < l; j++) {
              temp[j]._type = order[i];
              temp[j]._path = temp[j].filePath || temp[j].orgFilePath || temp[j].mergerdFilePath || '-';
              temp[j]._totalTime = temp[j].totalTime ? utils.formatDuration(temp[j].totalTime) : '-';
              arr.push(temp[j]);
            }
          }
        }

        return arr;
      },

      stopClick() {
        this.stop();
      },
      restartClick() {
        this.restart();
      },
      refreshClick() {
        this.refreshBtn.loading = true;
        this.listChildTask();
      },
      detailClick() {
        const childTaskData = [];
        const keys = Object.keys(this.table.currentRowInfo);
        this.childTaskTitle = this.getCurrentStepConfig(this.table.currentRowInfo._type).text;
        let tempValue = '';

        for (let i = 0, len = keys.length; i < len; i++) {
          if (keys[i].indexOf('_') === 0 && keys[i] !== '_id') { continue; }

          tempValue = this.table.currentRowInfo[keys[i]];

          if (['createTime', 'lastModify'].indexOf(keys[i]) !== -1) {
            tempValue = utils.formatTime(this.table.currentRowInfo[keys[i]]);
          } if (keys[i] === 'totalTime') {
            tempValue = utils.formatDuration(tempValue);
          }

          childTaskData.push({ key: config.getConfig('FIELD_NAME', keys[i]).cn || keys[i], value: tempValue });
        }
        this.childTaskData = childTaskData;
        this.childSlideDialogVisible = true;
      },
      autoRefreshList() {
        const me = this;
        if (!me.runTimer) {
          return false;
        }
        setTimeout(() => {
          me.listChildTask(true, () => {
            me.autoRefreshList();
          });
        }, 5000);

        return false;
      },
      /* api */
      listChildTask(notNeedProcess, completeFn) {
        const me = this;

        const param = {
          parentId: this.parentInfo.id
        };

        api.listChildTask({ params: param }, notNeedProcess ? '' : me).then((res) => {
          if (!notNeedProcess) {
            me.refreshBtn.loading = false;
            me.resetBtnStatus();
          }
          me.tableData = me.formatData(res.data);
          completeFn && completeFn();
        }).catch((error) => {
          if (!notNeedProcess) {
            me.refreshBtn.loading = false;
            me.$message.error(error);
          }
          completeFn && completeFn();
        });
      },
      stop() {
        const me = this;

        const param = {
          parentId: this.parentInfo.id,
          childTaskId: this.table.currentRowInfo.id,
          type: this.table.currentRowInfo._type
        };

        if (!param.childTaskId) {
          this.$message.error('请输入子任务id');
          return false;
        }

        if (this.stopBtn.loading) { return false; }
        this.stopBtn.loading = true;

        api.stop({ params: param }).then((res) => {
          me.$message.success('任务已成功停止');
          me.stopBtn.loading = false;
          me.listChildTask();
        }).catch((error) => {
          me.stopBtn.loading = false;
          me.$message.error(error);
        });

        return false;
      },

      restart() {
        const me = this;

        const param = {
          parentId: this.parentInfo.id,
          childTaskId: this.table.currentRowInfo.id,
          type: this.table.currentRowInfo._type
        };

        if (!param.childTaskId) {
          this.$message.error('请输入子任务id');
          return false;
        }

        if (this.restartBtn.loading) { return false; }
        this.restartBtn.loading = true;

        api.restart({ params: param }).then((res) => {
          me.$message.success('任务已成功重启');
          me.restartBtn.loading = false;
          me.listChildTask();
        }).catch((error) => {
          me.restartBtn.loading = false;
          me.$message.error(error);
        });

        return false;
      }
    }
  };
</script>
