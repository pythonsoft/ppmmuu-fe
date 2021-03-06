<template>
  <four-row-layout-right-content>
    <template slot="search-left">订阅信息</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-select placeholder="请选择" v-model="status" size="small" multi>
          <fj-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div class="permission-search-item">
        <fj-input placeholder="请输入公司名称" v-model="keyword" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
      </div>
      <div class="permission-search-item">
        <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" @click="handleClickAdd">增加</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="selectedRows.length !== 1" @click="handleClickEdit">修改</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" v-bind:disabled="selectedIds < 1" @click="handleClickDelete">删除</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20" align="center"></fj-table-column>
        <fj-table-column prop="status" label="状态" width="90">
          <template slot-scope="props"><div  v-html="formatStatus[props.row.status]"></div></template>
        </fj-table-column>
        <fj-table-column prop="companyName" label="公司名称"></fj-table-column>
        <fj-table-column prop="downloadSeconds" label="下载时长" width="120">
          <template slot-scope="props">{{transformSecondsToHours(props.row.downloadSeconds)}}</template>
        </fj-table-column>
        <fj-table-column prop="remainDownloadSeconds" label="剩余时长" width="120">
          <template slot-scope="props">{{transformSecondsToHours(props.row.remainDownloadSeconds)}}</template>
        </fj-table-column>
        <fj-table-column prop="startTime" label="使用期限" width="340">
          <template slot-scope="props">{{formatTime(props.row.startTime) + '-' + formatTime(props.row.expiredTime)}}</template>
        </fj-table-column>
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

      <div slot="footer" class="dialog-footer">
        <fj-button @click="cancelDialog">取消</fj-button><!--
        --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>

    </fj-dialog>
    <edit
            :title="editTitle"
            :type="type" :id="editId"
            :status="currentStatus"
            :visible.sync="editDialogVisible"
            @updateList="handleClickSearch">
    </edit>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime, transformSecondsToHours} from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';
  import { STATUS, STATUS_OPTIONS, formatStatus, formatRows } from './config';
  import Edit from './component/editSubscribe';

  const api = require('../../../../api/subscribeManagement');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'edit': Edit
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        options: STATUS_OPTIONS,
        dialogMessage: '',
        keyword: '',
        status: '',
        tableData: [],
        searchOwner: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        editDialogVisible: false,
        type: '',
        editTitle: '',
        editId: '',
        currentStatus: '',
        selectedIds: [],
        selectedRows: [],
        canDelete: false,
        formatStatus: formatStatus,
        formatTime: formatTime
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.handleClickSearch();
    },
    watch: {
      status(val) {
        this.currentPage = 1;
        this.handleClickSearch();
      }
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
          keyword: me.keyword,
          status: me.status
        };
        api.listSubscribeInfo(formatQuery(searchObj, true), me)
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            formatRows(me.tableData);
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      handleClickAdd() {
        this.type = 'add';
        this.editTitle = '增加订阅信息';
        this.currentStatus = '';
        this.editId = '';
        this.editDialogVisible = true;
      },
      handleClickEdit() {
        const currentRow = this.selectedRows[0];
        this.type = 'edit';
        this.editTitle = '修改订阅信息';
        this.currentStatus = currentRow.status;
        this.editId = currentRow._id;
        this.editDialogVisible = true;
      },
      handleClickDelete() {
        this.dialogMessage = '删除订阅信息后账号将不能使用，您确定要删除吗?';
        this.dialogVisible = true;
      },
      resetDialog() {
        this.dialogMessage = '';
        this.dialogVisible = false;
      },
      cancelDialog() {
        this.resetDialog();
      },
      handleShowBack() {
        this.showEdit = false;
      },
      confirmDialog() {
        const me = this;
        let postData = {};
        let message = '';
        let apiFunc = '';

        postData = {
          _ids: this.selectedIds.join(','),
        };
        message = '删除';
        apiFunc = api.deleteSubscribeInfo;

        apiFunc(postData)
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
        this.selectedIds = [];
        this.selectedRows = [];
        if (rows && rows.length) {
          let flag = true;
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            this.selectedIds.push(row._id);
            this.selectedRows.push(row);
          }
        }
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
      },
      transformSecondsToHours
    }
  };
</script>
<style>
  .permission-search-item{
    float: left;
    margin-left: 10px;
    line-height: 100%;
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
    width: 60px;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    text-align:center;
    display: block;
  }
  .not-use {
    background: #AAAAAA;
  }

  .using {
    background: #C0C003;
  }

  .expired {
    background: #FF3366;
  }

  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }
</style>
