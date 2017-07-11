<template>
    <table-list-layout>
        <div slot="search-left">权限</div>
        <div slot="search-right">
          <div class="search-item">
            <fj-select placeholder="请选择" v-model="status" size="mini">
              <fj-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </fj-option>
            </fj-select>
          </div>
          <div class="search-item">
            <fj-input placeholder="请输入权限名" v-model="name"></fj-input>
          </div>
          <div class="search-item">
            <fj-button type="primary" @click="handleClickSearch">搜索</fj-button>
          </div>
        </div>
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
       <div class="permission-operation" slot="operation">
          <fj-button type="info" size="mini" v-bind:disabled="enabled" @click="handleClickEnable">启用</fj-button>
          <fj-button type="info" size="mini" v-bind:disabled="disabled" @click="handleClickDisable">禁用</fj-button>
       </div>
        <div slot="table">
          <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
            <fj-table-column type="selection" width="20" align="center"></fj-table-column>
            <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'status-span enable': 'status-span disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
            <fj-table-column prop="name" label="名称" ></fj-table-column>
            <fj-table-column prop="description" label="描述"></fj-table-column>
          </fj-table>
          <div class="table-pagination" slot="pagination">
            <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
          </div>
        </div>
    </table-list-layout>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import TableListLayout from '../../../component/layout/tableListLayout/tableListLayout';

  const api = require('../../../../../build/api/role');

  export default {
    components: {
      'table-list-layout': TableListLayout
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
          name: me.name,
          status: me.status
        };
        api.getPermissionList(searchObj)
        .then(function(res){
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
        })
        .catch(function(error){
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
            _ids: this.selectedEnableIds.join(','),
            status: '0'
          };
          message = '启用';
        } else if (this.enableOrDisable === 'disable') {
          postData = {
            _ids: this.selectedDisableIds.join(','),
            status: '1'
          };
          message = '禁用';
        } else {
          this.resetDialog();
          return;
        }

        api.postEnablePermission(postData)
        .then(function(response){
          me.showSuccessInfo(message + "成功!");
          me.handleClickSearch();
        })
        .catch(function(error){
          me.showErrorInfo(error);
          me.resetDialog();
        });
      },
      handleSelectionChange(rows) {
        this.selectedDisableIds = [];
        this.selectedEnableIds = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            if (row.status === '0') {
              this.selectedDisableIds.push(row._id);
            } else {
              this.selectedEnableIds.push(row._id);
            }
          }
        }
        this.enabled = !this.selectedEnableIds.length;
        this.disabled = !this.selectedDisableIds.length;
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
    .permission-content {
      margin-left: 20px;
      margin-top: 10px;
    }

    .top-search {
      height: 40px;
      width: 100%;
      line-height: 38px;
      position: relative;
      min-width: 700px;
    }

    .top-search .search-title{
      font-size: 16px;
      color: #273F57;
      position: absolute;
      left: 20px;
    }

    .top-search .search-right-content{
      position: absolute;
      right: 20px;
    }

    .top-search .search-right-content .search-item{
      float: left;
      margin-left: 10px;
    }

    .permission-operation{
      background: #F2F6FA;
      line-height: 46px;
      height: 46px;
      margin-top: 10px;
      padding-left: 20px;
    }

    .table-pagination {
      margin-top: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      color: #4C637B;
    }

    .status-span {
      font-size: 12px;
      color: #FFFFFF;
      width: 48px;
      height: 20px;
      line-height: 20px;
      border-radius: 2px;
      text-align:center;
      display: block;
    }
    .enable {
      background: #2EC4B6;
    }

    .disable {
      background: #FF3366;
    }
</style>
