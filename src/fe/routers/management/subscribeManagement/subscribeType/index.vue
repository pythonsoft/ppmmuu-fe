<template>
  <four-row-layout-right-content>
    <template slot="search-left">类型管理</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-input placeholder="请输入类型名称" v-model="keyword" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
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
        <fj-button type="primary" size="mini" v-bind:disabled="selectedRows.length < 1" @click="handleClickDelete">删除</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20" align="center"></fj-table-column>
        <fj-table-column prop="photo" label="图标" width="50">
          <template slot-scope="props"><img class="subscribe-type-photo" :src="props.row.photo"></template>
        </fj-table-column>
        <fj-table-column prop="_id" label="标识" width="300"></fj-table-column>
        <fj-table-column prop="name" label="类型名" width="200"></fj-table-column>
        <fj-table-column prop="description" label="描述">
          <template slot-scope="props"><div class="subscribe-type-description">{{props.row.description}}</div></template>
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
            :type="type"
            :id="editId"
            :visible.sync="editDialogVisible"
            @updateList="handleClickSearch">
    </edit>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime} from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';
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
        dialogMessage: '',
        keyword: '',
        tableData: [],
        searchOwner: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        editDialogVisible: false,
        type: '',
        editTitle: '',
        editId: '',
        isUsing: false,
        selectedIds: [],
        selectedRows: [],
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
          keyword: me.keyword
        };
        api.listSubscribeType(formatQuery(searchObj, true), me)
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
      handleClickAdd() {
        this.type = 'add';
        this.editTitle = '增加订阅类型';
        this.isUsing = false;
        this.editId = '';
        this.editDialogVisible = true;
      },
      handleClickEdit() {
        const currentRow = this.selectedRows[0];
        this.type = 'edit';
        this.editTitle = '修改订阅类型';
        this.editId = currentRow._id;
        this.editDialogVisible = true;
      },
      handleClickDelete() {
        this.dialogMessage = '您确定要删除这些订阅类型吗?';
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
        apiFunc = api.deleteSubscribeType;

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

  .subscribe-type-photo {
    width: 25px;
    height: 25px;
  }

  .subscribe-type-description {
    width: 200px;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    box-sizing: border-box;
    text-align: left;
  }

  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }
</style>
