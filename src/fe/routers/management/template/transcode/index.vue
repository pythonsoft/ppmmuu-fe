<template>
  <layout-four-row>
    <template slot="search-left">转码模板管理</template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" @click="addClick">添加</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="updateClick">变更</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="deleteClick">删除</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" @click="refreshClick">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <template v-for="item in fields">
          <fj-table-column v-if="item.show" :prop="item.field" width="260" :label="item.text"></fj-table-column>
        </template>
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
      <div slot="footer" class="dialog-footer">
        <fj-button @click="confirmDialogDisplay=false">取消</fj-button><!--
        --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>
    </fj-dialog>

  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import dialog from './dialog';
  import utils from '../../../../common/utils';
  import { fields } from './config';

  const templateAPI = require('../../../../api/job');
  const config = require('../../task/config');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'dialog-view': dialog
    },
    data() {
      return {
        isDisabled: true,
        fields: fields,

        table: {
          currentRowInfo: {},
          type: 'add'
        },

        templateInfo: null,

        formData: {
          type: ''
        },

        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,

        /* child task */
        dialogDisplay: false,
        confirmDialogDisplay: false
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
        this.templateInfo = this.table.currentRowInfo;
        this.dialogDisplay = true;
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

        templateAPI.deleteTemplate({params:{ templateId: this.table.currentRowInfo._id }}, me).then((res) => {
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

        const param = {
          page: this.page,
          pageSize: this.pageSize,
        };

        templateAPI.listTemplate({ params: param }, me).then((res) => {
          const docs = res.data.docs;
          for(let i = 0, len = docs.length; i < len; i++){
            docs[i].wh = docs[i].w + 'x' + docs[i].h;
            docs[i]._id = docs[i].id;
          }
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
