<template>
  <four-row-layout-right-content>
    <template slot="search-left">部门任务(全部)</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-select theme="fill" placeholder="请选择" v-model="status" size="small">
          <fj-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </fj-option>
        </fj-select>
      </div>
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
        <fj-button type="primary" size="mini" v-bind:disabled="claimDisable" @click="handleClickClaim">认领</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="assignDisable" @click="handleClickAssign">派发</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" v-bind:disabled="deleteDisable" @click="handleClickDelete">删除</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20" align="center"></fj-table-column>
        <fj-table-column prop="status" label="状态" width="90"><template slot-scope="props"><div v-html="formatStatus[props.row.status]"></div></template></fj-table-column>
        <fj-table-column prop="name" label="节目名称"></fj-table-column>
        <fj-table-column prop="programNO" label="节目编号" width="260"></fj-table-column>
        <fj-table-column prop="assignee" label="派发人" width="100"><template slot-scope="props">{{props.row.assignee.name}}</template></fj-table-column>
        <fj-table-column prop="dealer" label="认领人" width="100"><template slot-scope="props">{{props.row.dealer.name}}</template></fj-table-column>
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
        --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>

    </fj-dialog>
    <shelf-detail
            :btnShow="false"
            :showEditInfo="false"
            :title="videoTitle"
            :programNO="programNO"
            :id="editId"
            :objectId="objectId"
            :visible.sync="detailDialogVisible">
    </shelf-detail>
    <add-user :visible.sync="assignDialogVisible" @add-owner="addOwner" :searchOwner="searchOwner" @search-user-api="searchOwnerClick" title="选择用户"></add-user>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime } from '../../../common/utils';
  import { formatStatus, STATUS } from '../config';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import AddUser from '../../management/role/searchAddUser';
  import ShelfDetail from '../component/shelfDetail';

  const api = require('../../../api/shelves');
  const OPTIONS = [
    {value: '', label: '全部'},
    {value: '0', label: '待认领'},
    {value: '1', label: '处理中'},
    {value: '2', label: '已提交'},
    {value: '3', label: '已删除'}
  ];

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'add-user': AddUser,
      ShelfDetail
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        assignDialogVisible: false,
        dialogMessage: '',
        departmentId: '',
        formatStatus: formatStatus,
        status: '',
        options: OPTIONS,
        claimOrDelete: '',
        keyword: '',
        tableData: [],
        searchOwner: [],
        canDeleteIds: [],
        canClaimIds: [],
        canAssignIds: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        formatTime: formatTime,
        claimDisable: true,
        assignDisable: true,
        deleteDisable: true,
        selectedIds: [],
        selectedRows: [],
        videoTitle: '',
        programNO: '',
        editId: '',
        objectId: '',
        detailDialogVisible: false
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
        api.listDepartmentShelfTask(formatQuery(searchObj, true), me)
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
        const row = this.selectedRows[0];
        this.objectId = row.objectId;
        this.programNO = row.programNO;
        this.videoTitle = row.name;
        this.editId = row._id;
      },
      handleClickClaim() {
        this.dialogMessage = '您确定要认领这些任务吗?';
        this.dialogVisible = true;
        this.claimOrDelete = 'claim';
      },
      handleClickAssign() {
        this.assignDialogVisible = true;
      },
      handleClickDelete() {
        this.dialogMessage = '您确定要删除这些任务吗?';
        this.dialogVisible = true;
        this.claimOrDelete = 'delete';
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
        if (this.claimOrDelete === 'claim') {
          postData = {
            _ids: this.canClaimIds.join(','),
          };
          message = '认领';
          apiFunc = api.claimShelfTask;
        } else if (this.claimOrDelete === 'delete') {
          postData = {
            _ids: this.canDeleteIds.join(','),
          };
          message = '删除';
          apiFunc = api.deleteShelfTask;
        } else {
          this.resetDialog();
          return;
        }

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
        this.canDeleteIds = [];
        this.canClaimIds = [];
        this.canAssignIds = [];
        this.selectedIds = [];
        this.selectedRows = rows;
        if (rows && rows.length) {
          let flag = true;
          let flag1 = true;
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            this.selectedIds.push(row._id);
            if(row.status !== STATUS.PREPARE){
              flag = false;
            }
            if(row.status === STATUS.PREPARE){
              this.canClaimIds.push(row._id);
              this.canAssignIds.push(row._id);
            }

            if(row.status !== STATUS.DELETE){
              this.canDeleteIds.push(row._id);
            }else{
              flag1 = false;
            }
          }
          this.claimDisable = !flag;
          this.assignDisable = !flag;
          this.deleteDisable = !flag1;
        }
      },
      clearTableSelection() {
        this.$refs.table.clearSelection();
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
      },
      addOwner(row) {
        row = row.info ? row.info : row;
        const postData = {
          _ids: this.canAssignIds.join(','),
          dealer: {
            _id: row._id,
            name: row.name
          }
        }
        api.assignShelfTask(postData)
          .then((res) => {
            this.showSuccessInfo('派发成功');
            this.assignDialogVisible = false;
            this.handleClickSearch();
          }).catch((error) => {
          this.showErrorInfo(error);
        });
      },
      searchOwnerClick(query) {
        const me = this;
        api.searchUser(formatQuery(query, true))
          .then((res) => {
            me.searchOwner = res.data;
          }).catch((error) => {
          me.showErrorInfo(error);
        });
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
<style scope>
  .permission-search-item{
    float: left;
    margin-left: 10px;
    line-height: 100%;
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

  .deleted {
    background: #AAAAAA;
  }

  .prepare {
    background: #38B1EB;
  }

  .doing {
    background: #C0C003;
  }

  .submitted {
    background: #2EC4B6;
  }

</style>
