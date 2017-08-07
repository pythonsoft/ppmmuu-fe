<template>
  <layout-four-row>
    <template slot="search-left">转码任务</template>
    <template slot="search-right">
      <div class="layout-four-row-search-item" :style="{ width: '88px' }">
        <fj-select placeholder="请选择" v-model="formData.status">
          <fj-option
            v-for="item in status"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div class="layout-four-row-search-item" :style="{ width: '190px' }">
        <fj-input :rows="1" placeholder="请输入任务名称" v-model="formData.keyword"></fj-input>
      </div>
      <div class="layout-four-row-search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="stopDisable" @click="stopClick">停止</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="restartDisable" @click="restartClick">重启</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="childTaskClick">任务详细</fj-button>
      </span>
      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" @click="refreshClick">刷新</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态">
          <template scope="props">
            <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
          </template>
        </fj-table-column>
        <fj-table-column prop="filePath" label="名称"></fj-table-column>
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

  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import childTaskDialogView from './childTaskDialog';
  import utils from '../../../../common/utils';

  const api = require('../../../../api/transcode');
  const config = require('./config');

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

        status: config.getConfig('STATUS'),
        formData: {
          keyword: '',
          status: '',
          currentStep: '',
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
      };
    },
    created() {
      this.listTask();
    },
    methods: {
      handleClickSearch() {
        this.listTask();
      },
      stopClick() {},
      restartClick() {},
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
        const st = config.getConfig('STATUS');
        if(st[current.status].value.indexOf([ 'created', 'dealing' ]) !== -1) {
          this.stopDisable = false;
          this.restartDisable = false;
        }else if( st[current.status].value.indexOf(['error', 'complete']) !== -1) {
          this.stopDisable = true;
          this.restartDisable = true;
        }
//        this.$emit('engine-select', current); // 将选中的当前引擎信息传到父组件
      },
      getStatus(v) {
        return config.getConfig('STATUS', v);
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

      /* api */
      listTask() {
        const me = this;

        const param = {
          page: this.page,
          pageSize: this.pageSize,
        };

        if(this.formData.status) {
          param.status = this.formData.status
        }

        if(this.formData.currentStep) {
          param.currentStep = this.formData.currentStep
        }

        api.list({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
    }
  }
</script>
