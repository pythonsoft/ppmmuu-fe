<template>
  <div>
    <four-row-layout-right-content v-if="!showEdit">
      <template slot="search-left">我的任务(处理中)</template>
      <template slot="search-right">
        <div class="permission-search-item">
          <fj-input theme="fill" placeholder="请输入关键词" v-model="keyword" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
        </div>
        <div class="permission-search-item">
          <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
        </div>
      </template>
      <template slot="operation">
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length !== 1" @click="handleClickDetail">查看详情</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length < 1" @click="handleClickEdit">编辑</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="!canSubmit" @click="handleClickSubmit">提交</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length < 1" @click="handleClickSendBack">退回</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length < 1" @click="handleClickDelete">删除</fj-button>
        </div>
      </template>
      <template slot="table">
        <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20" align="center"></fj-table-column>
          <fj-table-column prop="name" label="节目名称(中文)"></fj-table-column>
          <fj-table-column prop="editorInfo" label="文件名"><template slot-scope="props">{{props.row.editorInfo.fileName}}</template></fj-table-column>
          <fj-table-column prop="programNO" label="节目编号" width="260"></fj-table-column>
          <fj-table-column prop="packageStatus" label="打包状态" width="50"><template slot-scope="props"><div v-html="getPackageStatus(props.row)"></div></template></fj-table-column>
          <fj-table-column prop="assignee" label="派发人" width="100"><template slot-scope="props">{{props.row.assignee.name}}</template></fj-table-column>
          <fj-table-column prop="operationTime" label="操作时间" width="160"><template slot-scope="props">{{formatTime(props.row.operationTime)}}</template></fj-table-column>
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
          --><fj-button type="primary" :loading="isBtnLoading" @click="confirmDialog">确定</fj-button>
        </div>

      </fj-dialog>
      <shelf-detail
              :btnShow="canBtnShow"
              btnText="提交"
              btnType="info"
              @operation-click="submitShelf"
              :title="videoTitle"
              :programNO="programNO"
              :id="editId"
              :objectId="objectId"
              :visible.sync="detailDialogVisible">
      </shelf-detail>
    </four-row-layout-right-content>
    <edit v-else :shelfInfo="editRow" @show-back="handleShowBack" @update-list="handleClickSearch"></edit>
  </div>
</template>
<script>
  import { formatQuery, formatTime} from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import { STATUS, formatPacakgeStatus } from '../config';
  import Edit from '../component/edit.vue';
  import ShelfDetail from '../component/shelfDetail';
  import '../index.css';

  const api = require('../../../api/shelves');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'edit': Edit,
      ShelfDetail
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        dialogMessage: '',
        departmentId: '',
        operation: '',
        keyword: '',
        tableData: [],
        searchOwner: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        selectedIds: [],
        selectedRows: [],
        editRow: {},
        formatTime: formatTime,
        showEdit: false,
        videoTitle: '',
        programNO: '',
        editId: '',
        objectId: '',
        detailDialogVisible: false,
        canSubmit: false,
        isBtnLoading: false,
        canBtnShow: false
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
      getPackageStatus(row) {
        const packageStatus = row.packageStatus || '2';
        return formatPacakgeStatus[packageStatus];
      },
      handleClickSearch() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          keyword: me.keyword,
          status: STATUS.DOING
        };
        api.listMyselfShelfTask(formatQuery(searchObj, true), me)
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
      handleClickDetail() {
        this.detailDialogVisible = true;
        const row = this.selectedRows[0];
        this.objectId = row.objectId;
        this.programNO = row.programNO;
        this.videoTitle = row.name;
        this.editId = row._id;
        if (row.packageStatus && row.packageStatus !== '' && row.packageStatus !== '2') {
          this.canBtnShow = false;
        } else {
          this.canBtnShow = true;
        }
      },
      handleClickSendBack() {
        this.dialogMessage = '您确定要退回这些任务吗?';
        this.dialogVisible = true;
        this.operation = 'sendBack';
      },
      handleClickEdit() {
        this.editRow = this.selectedRows;
        this.showEdit = true;
      },
      handleClickDelete() {
        this.dialogMessage = '您确定要删除这些任务吗?';
        this.dialogVisible = true;
        this.operation = 'delete';
      },
      resetDialog() {
        this.dialogMessage = '';
        this.dialogVisible = false;
        this.isBtnLoading = false;
      },
      cancelDialog() {
        this.resetDialog();
      },
      handleShowBack() {
        this.showEdit = false;
      },
      handleClickSubmit() {
        this.dialogMessage = '您确定要提交这些任务吗?';
        this.dialogVisible = true;
        this.operation = 'submitMany';
      },
      confirmDialog() {
        const me = this;
        let postData = {};
        let message = '';
        let apiFunc = '';
        if (this.operation === 'sendBack') {
          postData = {
            _ids: this.selectedIds.join(','),
          };
          message = '退回';
          apiFunc = api.sendBackShelf;
        } else if (this.operation === 'delete') {
          postData = {
            _ids: this.selectedIds.join(','),
          };
          message = '删除';
          apiFunc = api.deleteShelfTask;
        } else if (this.operation === 'submitMany') {
          postData = {
            _ids: this.selectedIds.join(','),
          };
          message = '提交';
          apiFunc = api.batchSubmitByIds;
        } else if (this.operation === 'submitOne') {
          postData = {
            _ids: this.editId,
          };
          message = '提交';
          apiFunc = api.batchSubmitByIds;
        } else {
          this.resetDialog();
          return;
        }

        this.isBtnLoading = true;

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
      submitShelf(){
        const editorInfo = this.selectedRows[0].editorInfo;

        if (!editorInfo.name || !editorInfo.cover || !editorInfo.subscribeType || !editorInfo.limit) {
          this.$message.error('编目信息没有填写完整不能提交');
        } else {
          this.operation = 'submitOne';
          this.dialogMessage = '您确定要提交这个任务吗?';
          this.dialogVisible = true;
        }
      },
      handleSelectionChange(rows) {
        this.selectedIds = [];
        this.selectedRows = [];
        this.canSubmit = false;
        if (rows && rows.length) {
          let flag = true;
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            this.selectedIds.push(row._id);
            this.selectedRows.push(row);
            if (row.packageStatus && row.packageStatus !== '' && row.packageStatus !== '2') {
              flag = false;
            }
          }
          if (flag) {
            this.canSubmit = true;
          } else {
            this.canSubmit = false;
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
      }
    }
  };
</script>
