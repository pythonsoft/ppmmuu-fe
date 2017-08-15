<template>
  <four-row-layout-right-content>
    <template slot="search-left">权限</template>
    <template slot="search-right">
      <div class="permission-search-item" :style="{ width: '78px' }">
        <fj-select placeholder="请选择" v-model="status" size="small">
          <fj-option
            v-for="item in options"
            :key="item.value"
            :label="item.label"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div class="permission-search-item">
        <fj-input size="small" placeholder="请输入权限名" v-model="name"></fj-input>
      </div>
      <div class="permission-search-item">
        <fj-button size="small" type="primary" @click="handleClickSearch">搜索</fj-button>
      </div>
    </template>
     <template slot="operation">
       <span class="permission-btn-mini-margin">
         <fj-button type="info" size="mini" v-bind:disabled="enabled" @click="handleClickEnable">启用</fj-button>
       </span>
       <span class="permission-btn-mini-margin">
         <fj-button type="info" size="mini" v-bind:disabled="disabled" @click="handleClickDisable">禁用</fj-button>
       </span>
     </template>
      <template slot="table">
        <fj-table style="font-size: 12px;" :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20" align="center"></fj-table-column>
          <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
          <fj-table-column prop="name" label="名称" ></fj-table-column>
          <fj-table-column prop="description" label="描述"></fj-table-column>
        </fj-table>
      </template>
      <template slot="pagination">
        <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
      </template>
    <fj-dialog
            title="提示"
            :visible.sync="dialogVisible"
            @close="cancelDialog">

      <span>{{dialogMessage}}</span>

      <div slot="footer">
        <fj-button @click="cancelDialog">取消</fj-button>
        <fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>

    </fj-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';

  const api = require('../../../api/role');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent
    },
    data() {
      return {
        defaultRoute: '/',
        status: '',
        dialogVisible: false,
        dialogMessage: '',
        enableOrDisable: '',
        options: [{
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }, {
          value: '',
          label: '全部'
        }],
        name: '',
        enabled: true,
        disabled: true,
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.handleClickSearch();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickSearch() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          keyword: me.name,
          status: me.status
        };
        api.getPermissionList(formatQuery(searchObj, true), me)
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      handleClickEnable() {
        this.dialogMessage = '确定要启用这些权限吗?';
        this.dialogVisible = true;
        this.enableOrDisable = 'enable';
      },
      handleClickDisable() {
        this.dialogMessage = '确定要禁用这些权限吗?';
        this.dialogVisible = true;
        this.enableOrDisable = 'disable';
      },
      resetDialog() {
        this.dialogMessage = '';
        this.dialogVisible = false;
        this.enableOrDisable = '';
      },
      cancelDialog() {
        this.resetDialog();
      },
      confirmDialog() {
        const me = this;
        let postData = {};
        let message = '';
        if (this.enableOrDisable === 'enable') {
          postData = {
            paths: this.selectedEnablePaths.join(','),
            status: '0'
          };
          message = '启用';
        } else if (this.enableOrDisable === 'disable') {
          postData = {
            paths: this.selectedDisablePaths.join(','),
            status: '1'
          };
          message = '禁用';
        } else {
          this.resetDialog();
          return;
        }

        api.postEnablePermission(postData)
          .then((response) => {
            me.showSuccessInfo(`${message}成功!`);
            me.resetDialog();
            me.handleClickSearch();
          })
          .catch((error) => {
            me.showErrorInfo(error);
            me.resetDialog();
          });
      },
      handleSelectionChange(rows) {
        this.selectedDisablePaths = [];
        this.selectedEnablePaths = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            if (row.status === '0') {
              this.selectedDisablePaths.push(row.path);
            } else {
              this.selectedEnablePaths.push(row.path);
            }
          }
        }
        this.enabled = !this.selectedEnablePaths.length;
        this.disabled = !this.selectedDisablePaths.length;
      },
      clearTableSelection() {
        this.$refs.table.clearSelection();
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style>
    .permission-search-item{
      float: left;
      margin-left: 10px;
    }

    .permission-btn-mini-margin {
      margin-left: 6px;
      font-size: 12px;
    }

    .permission-table-pagination {
      margin-top: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      color: #4C637B;
    }

    .permission-status-span {
      font-size: 12px;
      color: #FFFFFF;
      width: 48px;
      height: 20px;
      line-height: 20px;
      border-radius: 2px;
      text-align:center;
      display: block;
    }
    .permission-enable {
      background: #2EC4B6;
    }

    .permission-disable {
      background: #FF3366;
    }
</style>
