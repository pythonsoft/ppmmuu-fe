<template>
  <four-row-layout-right-content>
    <template slot="search-left">上架管理(已下架)</template>
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
        <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length !== 1" @click="handleClickEdit">查看详情</fj-button>
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
        <fj-table-column prop="dealer" label="编目人" width="100"><template slot-scope="props">{{props.row.dealer.name}}</template></fj-table-column>
        <fj-table-column prop="lastModifyTime" label="操作时间" width="160"><template slot-scope="props">{{formatTime(props.row.lastModifyTime)}}</template></fj-table-column>
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
    <shelf-detail
            btnText="再编辑"
            btnType="info"
            :showPackageInfo="false"
            :title="videoTitle"
            :programNO="programNO"
            :id="editId"
            :objectId="objectId"
            :visible.sync="detailDialogVisible"
            @operation-click="editShelfAgain">
    </shelf-detail>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime} from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import ShelfDetail from '../component/shelfDetail';
  import { STATUS } from '../config';

  const api = require('../../../api/shelves');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'shelf-detail': ShelfDetail
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        detailDialogVisible: false,
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
        videoTitle: '',
        programNO: '',
        editId: '',
        objectId: '',
        formatTime: formatTime
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
          keyword: me.keyword,
          status: STATUS.OFFLINE
        };
        api.listLineShelfTask(formatQuery(searchObj, true), me)
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
      handleClickEdit() {
        this.detailDialogVisible = true;
        this.objectId = this.selectedObjectIds[0];
        this.programNO = this.selectedRows[0].programNO;
        this.videoTitle = this.selectedRows[0].name;
        this.editId = this.selectedIds[0];
      },
      handleClickDelete() {
        this.dialogMessage = '您确定要删除这些节目吗?';
        this.dialogVisible = true;
        this.operation = 'delete';
      },
      resetDialog() {
        this.dialogMessage = '';
        this.dialogVisible = false;
      },
      cancelDialog() {
        this.resetDialog();
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
        apiFunc = api.deleteShelfTask;

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
      editShelfAgain(){
        const me = this;
        api.editShelfTaskAgain({_id: me.editId})
          .then((response) => {
            me.showSuccessInfo('已处理,请前往处理中查看');
            me.detailDialogVisible = false;
            me.handleClickSearch();
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      handleSelectionChange(rows) {
        this.selectedIds = [];
        this.selectedObjectIds = [];
        this.selectedRows = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            this.selectedIds.push(row._id);
            this.selectedObjectIds.push(row.objectId);
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
      }
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

  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }
</style>
