<template>
  <layout-four-row>
    <template slot="search-left">下载任务({{ title }})</template>
    <template slot="search-right">
      <div v-if="isShowSelect" class="layout-four-row-search-item" :style="{ width: '88px' }">
        <fj-select size="small" placeholder="请选择" v-model="formData.status">
          <fj-option
            v-for="item in status"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></fj-option>
        </fj-select>
      </div>
      <!--<div class="layout-four-row-search-item" :style="{ width: '190px' }">-->
        <!--<fj-input size="small" :rows="1" placeholder="请输入任务名称" v-model="formData.keyword"></fj-input>-->
      <!--</div>-->
      <!--<div class="layout-four-row-search-item">-->
        <!--<fj-button type="primary" size="small" @click="handleClickSearch">查询</fj-button>-->
      <!--</div>-->
    </template>
    <template slot="operation">
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="stopDisable" @click="stopClick">停止</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="restartDisable" @click="restartClick">重启</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteClick">删除</fj-button>
      </span>
      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="childTaskClick">任务详细</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" @click="refreshClick">刷新</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row highlightKey="id">
        <fj-table-column prop="status" width="90" align="center" label="状态">
          <template scope="props">
            <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
          </template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="createTime" width="160" align="center" label="创建时间">
          <template scope="props">{{ props.row.createTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="lastModify" width="160" align="center" label="修改时间">
          <template scope="props">{{ props.row.lastModify | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination
        :page-size="pageSize"
        :total="total"
        :current-page.sync="page"
        @current-change="pageChange">
      </fj-pagination>
    </template>

    <child-task-slide-dialog-view
      :parentInfo="table.currentRowInfo"
      :visible.sync="childTaskDialogVisible"
    ></child-task-slide-dialog-view>

    <fj-dialog
      title="提示"
      :visible.sync="dialog.visible"
      @close="dialog.visible=false"
    >
      <span>确定要删除此任务 {{ table.currentRowInfo.fileName }} 吗?</span>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="dialog.visible=false">取消</fj-button><!--
        --><fj-button type="primary" @click="dialogConfirm">确定</fj-button>
      </div>
    </fj-dialog>

  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';
  import childTaskDialogView from './childTaskDialog';
  import utils from '../../../common/utils';

  const api = require('../../../api/user');
  const config = require('../../management/task/config');
  const common = require('../../management/task/common');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'child-task-slide-dialog-view': childTaskDialogView
    },
    data() {
      return {
        isDisabled: true,
        stopDisable: true,
        restartDisable: true,
        title: '',
        isShowSelect: true,

        status: config.getConfig('DOWNLOAD_STATUS'),
        formData: {
          keyword: '',
          status: '',
          currentStep: ''
        },

        dialog: {
          visible: false
        },

        table: {
          currentRowInfo: {}
        },
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,

        /* child task */
        childTaskDialogVisible: false,

        runTimer: false
      };
    },
    created() {
      this.updateStatus();
      // this.listTask();
      this.runTimer = true;
      this.autoRefreshList();
    },
    watch: {
      '$route.path'(val) {
        this.updateStatus();
      },
    },
    destroyed() {
      this.runTimer = false;
    },
    methods: {
      updateStatus() {
        const keys = Object.keys(this.status);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (this.$route.name.indexOf(key.toLowerCase()) > -1) {
            if (key === 'all') {
              this.isShowSelect = true;
            } else {
              this.isShowSelect = false;
            }
            this.formData.status = this.status[key].value;
            this.title = this.status[key].text;
            this.page = 1;
            this.listTask();
            break;
          }
        }
      },
      handleClickSearch() {
        this.listTask();
      },
      stopClick() {
        this.stop();
      },
      restartClick() {
        this.restart();
      },
      childTaskClick() {
        this.childTaskDialogVisible = true;
      },
      refreshClick() {
        this.listTask();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.childTaskDialogVisible = false;
      },
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
        this.stopDisable = !common.isTaskCanStop(current.status);
        this.restartDisable = !common.isTaskCanRestart(current.status);
      },
      getStatus(v) {
        return config.getConfig('DOWNLOAD_STATUS', v);
      },
      formatType(v) {
        return v;
      },
      formatPermission(v) {
        return v;
      },
      pageChange(val) {
        this.page = val;
        this.listTask();
      },
      autoRefreshList() {
        const me = this;
        if (!me.runTimer) {
          return false;
        }
        setTimeout(() => {
          me.listTask(true, () => {
            me.autoRefreshList();
          });
        }, 5000);

        return false;
      },
      deleteClick() {
        this.dialog.visible = true;
      },
      dialogConfirm() {
        this.deleteJob();
      },
      /* api */
      listTask(notNeedProcess, completeFn) {
        const me = this;

        const param = {
          page: this.page,
          pageSize: this.pageSize,
          processType: 'download',
        };

        if (this.formData.status) {
          param.status = this.formData.status;
        }

        if (this.formData.currentStep) {
          param.currentStep = this.formData.currentStep;
        }

        api.listJob({ params: param }, notNeedProcess ? '' : me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
          completeFn && completeFn();
        }).catch((error) => {
          if (!notNeedProcess) {
            me.$message.error(error);
          }
          completeFn && completeFn();
        });
      },
      stop() {
        const me = this;

        const param = {
          jobId: this.table.currentRowInfo.id
        };

        api.stopJob({ params: param }).then((res) => {
          me.$message.success('任务已成功停止');
          me.listTask();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },

      deleteJob() {
        const me = this;

        const param = {
          jobId: this.table.currentRowInfo.id
        };

        api.deleteJob({ params: param }).then((res) => {
          me.$message.success('任务已成功停止');
          me.listTask();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },

      restart() {
        const me = this;

        const param = {
          jobId: this.table.currentRowInfo.id
        };

        api.restartJob({ params: param }).then((res) => {
          me.$message.success('任务已成功重启');
          me.listTask();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      }
    }
  };
</script>
