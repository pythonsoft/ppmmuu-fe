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
      <fj-table-column prop="taskName" width="100" align="center" label="类型"></fj-table-column>
      <fj-table-column prop="status" width="50" align="center" label="状态">
        <template scope="props">
          <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
        </template>
      </fj-table-column>
      <fj-table-column prop="filePath" label="路径">
        <template scope="props">
          <span class="task-slide-dialog-item-word-break">{{ props.row.filePath }}</span>
        </template>
      </fj-table-column>
      <fj-table-column prop="position" width="80" label="进度(%)" align="center"></fj-table-column>
      <fj-table-column prop="createTime" width="140" align="center" label="创建时间">
        <template scope="props">{{ parentInfo.createTime | formatTime }}</template>
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

  const api = require('../../../../api/job');
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
          this.formatParentInfoMap(this.parentInfo);
        } else {
          this.tableData = [];
          this.childTaskData = [];
          this.parentInfoMap = [];
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
        parentInfoMap: [],

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
      formatParentInfoMap(info) {
        const arr = [];

        for(let k in info) {
          arr.push({ key: k, value: JSON.stringify(info[k]) });
        }

        this.parentInfoMap = arr;
      },
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
        return config.getConfig('TASK_STATUS', v);
      },
      getTaskType(v) {
        return config.getConfig('TASK_TYPE', v);
      },
      formatData(data) {
        /*
        *
        * taskName: "下载",
        * taskType: "media_download",
        * taskId: "59ae6ef758b26b017acc2eb2",
        * status: "dealing",…}
          createParams: "{
          "objectid":"5A73A94C-BA88-5995-4459-4B2F551B5962",
          "inpoint":0,
          "outpoint":412435,
          "fileName":"testA.mp4"}"
          errMsg: "can not stop,task not support"
          fileName: "172545447testA.mp4"
          filePath: "/root/media/2017/09/05/172545447testA.mp4"
          position: 0
          queryParams: "jobid=59ae6ef758b26b017acc2eb2"
          serialNO: 0
          status: "dealing"
          taskId: "59ae6ef758b26b017acc2eb2"
          taskName: "下载"
          taskType: "media_download"
        *
        * */

        for (let i = 0, len = data.length; i < len; i++) {
          data[i]._type = data[i].taskType;
        }

        return data;
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
        this.childTaskTitle = this.getTaskType(this.table.currentRowInfo._type).text;
        let tempValue = '';

        for (let i = 0, len = keys.length; i < len; i++) {
          if (keys[i].indexOf('_') === 0 && keys[i] !== '_id') { continue; }

          tempValue = this.table.currentRowInfo[keys[i]];

          if (['createTime', 'lastModify'].indexOf(keys[i]) !== -1) {
            tempValue = utils.formatTime(this.table.currentRowInfo[keys[i]]);
          } if (keys[i] === 'totalTime') {
            tempValue = utils.formatDuration(tempValue);
          }

          childTaskData.push({
            key: config.getConfig('FIELD_NAME', keys[i]).cn || keys[i],
            value: tempValue
          });
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
          jobId: this.parentInfo.id
        };

        api.queryJob({ params: param }, notNeedProcess ? '' : me).then((res) => {
          if (!notNeedProcess) {
            me.refreshBtn.loading = false;
            me.resetBtnStatus();
          }

          me.tableData = me.formatData(res.data.tasklist);
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
          jobId: this.parentInfo.id
        };

        if (!param.jobId) {
          this.$message.error('请输入子任务id');
          return false;
        }

        if (this.stopBtn.loading) { return false; }
        this.stopBtn.loading = true;

        api.stopJob({ params: param }).then((res) => {
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
          jobId: this.parentInfo.id
        };

        if (!param.jobId) {
          this.$message.error('请输入子任务id');
          return false;
        }

        if (this.restartBtn.loading) { return false; }
        this.restartBtn.loading = true;

        api.restartJob({ params: param }).then((res) => {
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
