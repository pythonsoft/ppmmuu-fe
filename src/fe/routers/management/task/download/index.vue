<template>
  <layout-four-row>
    <template slot="search-left">下载任务</template>
    <template slot="search-right">
      <div class="layout-four-row-search-item" :style="{ width: '88px' }">
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
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" v-bind:disabled="true" @click="stopClick">停止</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="true" @click="restartClick">重启</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="true" @click="deleteClick">删除</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="taskClick">任务详细</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="true" @click="childTaskClick">子任务详细</fj-button>
        <fj-button type="primary" size="mini" @click="refreshClick">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table highlightKey="id" style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态">
          <template slot-scope="props">
            <div><span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span></div>
          </template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称" width="100"></fj-table-column>
        <fj-table-column prop="current" width="100" label="当前步骤">
        </fj-table-column>
        <fj-table-column prop="next" width="100" label="下个步骤">
        </fj-table-column>
        <fj-table-column prop="userName" width="120" label="用户名">
          <template slot-scope="props">{{ props.row.userName || '-' }}</template>
        </fj-table-column>
        <fj-table-column prop="createdTime" width="140"label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="activedTime" width="140" label="修改时间">
          <template slot-scope="props">{{ props.row.activedTime | formatTime }}</template>
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

    <task-slide-dialog-view
      :parentInfo="table.currentRowInfo"
      :visible.sync="taskDialogVisible"
    ></task-slide-dialog-view>

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
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import childTaskDialogView from './childTaskDialog';
  import taskDialogView from '../../../../component/higherOrder/propsSlideDialog';
  import utils from '../../../../common/utils';

  const api = require('../../../../api/job');
  const config = require('../config');
  const common = require('../common');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'child-task-slide-dialog-view': childTaskDialogView,
      'task-slide-dialog-view': taskDialogView
    },
    data() {
      return {
        isDisabled: true,
        stopDisable: true,
        restartDisable: true,

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
        taskDialogVisible: false,

        runTimer: false
      };
    },
    created() {
      this.listTask();
      this.runTimer = true;
      this.autoRefreshList();
    },
    destroyed() {
      this.runTimer = false;
    },
    methods: {
      formatTaskList: utils.formatTaskList,
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
      taskClick() {
        this.taskDialogVisible = true;
      },
      refreshClick() {
        this.listTask();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.childTaskDialogVisible = false;
        this.taskDialogVisible = false;
      },
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
        this.stopDisable = !common.isDownloadTaskCanStop(current.status);
        this.restartDisable = !common.isDownloadTaskCanRestart(current.status);
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

        /**
        const mock = {
          "status":"0",
          "data":{
            "docs":[
              {
                "id":"b850529d-43fa-47e8-9502-97fad80ad775",
                "tasklist":[
                  {
                    "taskName":"下载",
                    "taskType":"media_download",
                    "taskId":"59ae6ef758b26b017acc2eb2",
                    "status":"dealing",
                    "position":0,
                    "createParams":"{
                      \"objectid\":\"5A73A94C-BA88-5995-4459-4B2F551B5962\",
                      \"inpoint\":0,
                      \"outpoint\":412435,
                      \"fileName\":\"testA.mp4\"}",
                    "queryParams":"jobid\u003d59ae6ef758b26b017acc2eb2",
                    "serialNO":0,
                    "errMsg":"can not stop,task not support",
                    "filePath":"/root/media/2017/09/05/172545447testA.mp4",
                    "fileName":"172545447testA.mp4"}],
                "status":"dealing",
                "currentStep":0,
                "filePath":"/root/media/2017/09/05/172545447testA.mp4",
                "fileName":"172545447testA.mp4",
                "createTime":"2017-09-05T09:25:43.607Z",
                "lastModify":"2017-09-07T08:09:33.727Z"}],
            "page":1,
            "pageCount":1,
            "pageSize":20,
            "total":1
          },
          "statusInfo":{}
        };
         **/

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
