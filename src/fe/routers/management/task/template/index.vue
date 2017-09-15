<template>
  <layout-four-row>
    <template slot="search-left">模板管理</template>
    <template slot="search-right">
      <div class="layout-four-row-search-item" :style="{ width: '100px' }">
        <fj-select size="small" placeholder="请选择" v-model="formData.type">
          <fj-option
            v-for="item in type"
            :key="item.value"
            :label="item.text"
            :value="item.value"
          ></fj-option>
        </fj-select>
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
        <fj-table-column prop="_id" width="260" label="标识"></fj-table-column>
        <fj-table-column prop="name" width="400" label="名称"></fj-table-column>
        <fj-table-column prop="createTime" width="160" align="center" label="创建时间">
          <template scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
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

    <dialog-view
      :templateInfo="templateInfo"
      :visible.sync="dialogDisplay"
      :type="table.type"
      @listTemplate="listTemplate"
    ></dialog-view>

    <fj-dialog title="删除模板" :visible.sync="confirmDialogDisplay" @close="confirmDialogDisplay=false">
      <template>
        <span>确定要删 {{ table.currentRowInfo.name }} 这块模板？</span>
      </template>
      <div slot="footer">
        <fj-button @click="confirmDialogDisplay=false">取消</fj-button>
        <fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>
    </fj-dialog>

  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import dialog from './dialog';
  import utils from '../../../../common/utils';

  const templateAPI = require('../../../../api/template');
  const config = require('../config');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'dialog-view': dialog
    },
    data() {
      return {
        isDisabled: true,

        table: {
          currentRowInfo: {},
          type: 'add'
        },

        templateInfo: null,

        formData: {
          type: ''
        },

        type: config.getConfig('TEMPLATE_TYPE'),

        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,

        /* child task */
        dialogDisplay: false,
        confirmDialogDisplay: false,
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
        this.table.type = 'add';
        this.dialogDisplay = true;
        this.templateInfo = null;
      },
      updateClick() {
        this.table.type = 'update';
        this.dialogDisplay = true;
        this.templateInfo = this.table.currentRowInfo;
      },
      deleteClick() {
        this.confirmDialogDisplay = true;
      },
      refreshClick() {
        this.listTemplate();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.dialogDisplay = false;
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
      confirmDialog() {
        const me = this;

        templateAPI.remove({ id: this.table.currentRowInfo._id }, me).then((res) => {
          me.$message.success('删除成功');
          me.listTemplate();
          me.confirmDialogDisplay = false;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      /* api */
      listTemplate() {
        const me = this;
        const templateType = config.getConfig('NODE_TEMPLATE');

        const param = {
          page: this.page,
          pageSize: this.pageSize,
          type: templateType.DOWNLOAD.value
        };

        templateAPI.list({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
    }
  };
</script>
