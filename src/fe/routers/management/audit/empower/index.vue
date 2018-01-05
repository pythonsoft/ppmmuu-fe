<template>
  <layout-four-row>
    <template slot="search-left">审核授权</template>
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
        <fj-table-column prop="permissionType" width="80" label="权限">
          <template slot-scope="props">{{ getTextByValue(props.row.permissionType, 'AUDIT_RULE_PERMISSTION_TYPE') }}</template>
        </fj-table-column>
        <fj-table-column prop="ownerName" label="资源所属部门"></fj-table-column>
        <fj-table-column prop="auditDepartment" label="审核部门">
          <template slot-scope="props">{{ props.row.auditDepartment.name || '-' }}</template>
        </fj-table-column>
        <fj-table-column prop="creator" width="120" label="创建人">
          <template slot-scope="props">{{ props.row.creator.name || '-' }}</template>
        </fj-table-column>
        <fj-table-column prop="createTime" width="160" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="description" width="240"  label="描述"></fj-table-column>
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

    <fj-dialog title="删除授权" :visible.sync="confirmDialogDisplay" @close="confirmDialogDisplay=false">
      <template>
        <span>确定要删 {{ table.currentRowInfo.name }} 这块模板？</span>
      </template>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="confirmDialogDisplay=false">取消</fj-button><!--
        --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>
    </fj-dialog>

    <dialog-view
      :auditRuleInfo="auditRuleInfo"
      :type="table.type"
      :visible.sync="dialogDisplay"
      @listTemplate="listRuleInfo"
    ></dialog-view>

  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import utils from '../../../../common/utils';
  import dialogView from './component/dialog';

  const api = require('../../../../api/audit');
  const config = require('../config');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'dialog-view': dialogView,
    },
    data() {
      return {
        isDisabled: true,

        table: {
          currentRowInfo: {},
          type: 'add'
        },

        auditRuleInfo: null,

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
      this.listRuleInfo();
    },
    destroyed() {
    },
    methods: {
      getTextByValue(v, st) {
        return config.method.getTextByValue(v, st);
      },
      handleClickSearch() {
        this.listRuleInfo();
      },
      addClick() {
        this.table.type = 'add';
        this.dialogDisplay = true;
        this.auditRuleInfo = null;
      },
      updateClick() {
        this.table.type = 'update';
        this.dialogDisplay = true;
        this.auditRuleInfo = this.table.currentRowInfo;
      },
      deleteClick() {
        this.confirmDialogDisplay = true;
      },
      refreshClick() {
        this.listRuleInfo();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.dialogDisplay = false;
      },
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
      },
      formatType(v) {
        return v;
      },
      formatPermission(v) {
        return v;
      },
      pageChange(val) {
        this.page = val;
        this.listRuleInfo();
      },
      confirmDialog() {
        const me = this;

        api.removeAuditRule({ ids: this.table.currentRowInfo._id }, me).then((res) => {
          me.$message.success('删除成功');
          me.listRuleInfo();
          me.confirmDialogDisplay = false;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      /* api */
      listRuleInfo() {
        const me = this;
        const param = {
          page: this.page,
          pageSize: this.pageSize,
        };

        api.listAuditRule({ params: param }, me).then((res) => {
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
