<template>
  <layout-four-row>
    <template slot="search-left">转码模板</template>
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
      <div class="layout-four-row-search-item" :style="{ width: '190px' }">
        <fj-input size="small" :rows="1" placeholder="请输入任务名称" v-model="formData.keyword"></fj-input>
      </div>
      <div class="layout-four-row-search-item">
        <fj-button type="primary" size="small" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" @click="addClick">添加</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="updateClick">变更</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteClick">删除</fj-button>
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
  import dialog from './dialog';
  import utils from '../../../../common/utils';

  const api = require('../../../../api/job');
  const config = require('../config');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'child-task-slide-dialog-view': dialog
    },
    data() {
      return {
        isDisabled: true,

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
      this.listTemplate();
    },
    destroyed() {
    },
    methods: {
      handleClickSearch() {
        this.listTemplate();
      },
      addClick() {
      },
      updateClick() {},
      deleteClick() {
        this.childTaskDialogVisible = true;
      },
      refreshClick() {
        this.listTemplate();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.childTaskDialogVisible = false;
      },
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
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
        this.listTemplate();
      },
      /* api */
      listTemplate() {
        const me = this;

        const param = {
          page: this.page,
          pageSize: this.pageSize
        };

        api.listTemplate({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
        }).catch((error) => {
          me.$message.error(error);
        });
      }
    }
  };
</script>
