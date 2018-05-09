<template>
  <four-row-layout-right-content>
    <template slot="search-left">部门任务列表({{ title }})</template>
    <template slot="search-right">
      <div v-if="isShowStatusSelect" class="search-item" :style="{ width: '85px' }">
        <fj-select size="small" v-model="status" theme="fill">
          <fj-option
            v-for="item in TASK_STATUS"
            :key="item.code"
            :label="item.text"
            :value="item.code"></fj-option>
        </fj-select>
      </div>
      <div class="search-item" :style="{ width: '190px' }">
        <fj-input theme="fill" size="small" placeholder="请编目任务名" v-model="keyword"></fj-input>
      </div>
      <div class="search-item">
        <fj-button size="small" type="primary" @click="updateList">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button :loading="isApplyBtnLoading" size="mini" type="primary" :disabled="!canClaim" @click="applyCatalogTask">认领</fj-button>
        <fj-button size="mini" type="primary" :disabled="!canAssign" @click="searchUserDialogVisible = true">派发</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="!canDelete" @click="showEditStatusDialog('deleteTask')">删除</fj-button>
        <fj-button size="mini" type="primary" :disabled="!canRecover" @click="showEditStatusDialog('resumeTask')">恢复</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="selectedItems.length!==1" @click="detailDialogVisible=true">任务详情</fj-button>
        <fj-button size="mini" type="primary" @click="updateList">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="50" align="center"></fj-table-column>
        <fj-table-column prop="status" label="状态" width="50" align="center">
           <template slot-scope="props">
             <span :class="getStatusByCode(props.row.status).css">{{ getStatusByCode(props.row.status).text }}</span>
           </template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="owner" label="认领人">
          <template slot-scope="props">{{ props.row.owner.name || '--' }}</template>
        </fj-table-column>
        <fj-table-column prop="assignee" label="派发人">
          <template slot-scope="props">{{ props.row.assignee.name || '--' }}</template>
        </fj-table-column>
        <fj-table-column prop="createdTime" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination" v-show="tableData.length">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <fj-dialog
      :title="editStatusDialogTitle"
      :visible.sync="editStatusDialogVisible">
      <p>您确定要{{ editStatusDialogTitle }}吗？</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="editStatusDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isEditStatusBtnLoading" @click.stop="editStatusFn">确定</fj-button>
      </div>
    </fj-dialog>
    <search-user-dialog
      :visible.sync="searchUserDialogVisible"
      @add-owner="assignCatalogTask"
      :searchOwner="userList"
      @search-user-api="searchUser"
      title="选择派发对象"></search-user-dialog>
      <task-detail
        :objectId="taskObjectId"
        :visible.sync="detailDialogVisible">
      </task-detail>
  </four-row-layout-right-content>
</template>
<script>
  import { TASK_STATUS, getStatusByCode } from '../config';
  import TaskDetail from '../component/taskDetail';
  import SearchUserDialog from '../../management/role/searchAddUser';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent';
  import { formatQuery } from '../../../common/utils';
  const libraryAPI = require('../../../api/library');
  const userAPI = require('../../../api/user');

  export default {
    data() {
      return {
        userList: [],
        selectedItems: [],
        canClaim: false,
        canAssign: false,
        canDelete: false,
        canRecover: false,
        tableData: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        keyword: '',
        status: 'all',
        title: '全部',
        isShowStatusSelect: true,
        isApplyBtnLoading: false,
        editStatusDialogTitle: '',
        editStatusDialogVisible: false,
        isEditStatusBtnLoading: false,
        editStatusFn: () => {},
        searchUserDialogVisible: false,
        detailDialogVisible: false,
        taskObjectId: ''
      };
    },
    created() {
      this.TASK_STATUS = TASK_STATUS;
      this.EDIT_STATUS_CONFIG = {
        resumeTask: { text: '恢复任务', fn: this.resumeCatalogTask },
        deleteTask: { text: '删除任务', fn: this.deleteCatalogTask }
      };
      if (this.$route.name.indexOf('unassigned') > -1) {
        this.status = TASK_STATUS.PREPARE.code;
        this.title = TASK_STATUS.PREPARE.text;
        this.isShowStatusSelect = false;
      }
      this.updateList();
    },
    watch: {
      '$route.path'(val) {
        if (this.$route.name.indexOf('unassigned') > -1) {
          this.status = TASK_STATUS.PREPARE.code;
          this.title = TASK_STATUS.PREPARE.text;
          this.currentPage = 1;
          this.isShowStatusSelect = false;
        } else {
          this.status = TASK_STATUS.ALL.code;
          this.title = TASK_STATUS.ALL.text;
          this.currentPage = 1;
          this.isShowStatusSelect = true;
        }
        this.updateList();
      },
      selectedItems(val) {
        if (val.length === 1) {
          this.taskObjectId = val[0].objectId;
        }
      }
    },
    methods: {
      getStatusByCode,
      updateList() {
        const data = {
          status: this.status === 'all' ? '' : this.status,
          keyword: this.keyword,
          page: this.currentPage,
          pageSize: this.pageSize
        };
        libraryAPI.listDepartmentCatalogTask(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            this.tableData = responseData.docs;
            this.currentPage = responseData.page;
            this.total = responseData.total;
            this.selectedItems = [];
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
        this.canAssign = false;
        this.canClaim = false;
        this.canDelete = false;
        this.canRecover = false;
        let assignFlag = true;
        let claimFlag = true;
        let deleteFlag = true;
        let recoverFlag = true;

        for(let i = 0, len = val.length; i < len; i ++ ){
          const status = val[i].status;
          if (status === TASK_STATUS.DOING.code) {
            assignFlag = false;
            claimFlag = false;
            recoverFlag = false;
          } else if (status === TASK_STATUS.SUBMITTED.code) {
            assignFlag = false;
            claimFlag = false;
            recoverFlag = false;
          } else if (status === TASK_STATUS.DELETED.code) {
            assignFlag = false;
            claimFlag = false;
            deleteFlag = false;
          }
        }

        this.canAssign = assignFlag;
        this.canClaim = claimFlag;
        this.canDelete = deleteFlag;
        this.canRecover = recoverFlag;
      },
      applyCatalogTask() {
        const taskIdsArr = this.selectedItems.map(item => item._id);
        this.isApplyBtnLoading = true;
        libraryAPI.applyCatalogTask({ taskIds: taskIdsArr.join(',') })
          .then((response) => {
            this.updateList();
            this.$message.success('认领成功');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isApplyBtnLoading = false;
          });
      },
      assignCatalogTask(info) {
        const taskIdsArr = this.selectedItems.map(item => item._id);
        libraryAPI.assignCatalogTask({ taskIds: taskIdsArr.join(','), ownerId: info._id })
          .then((response) => {
            this.updateList();
            this.searchUserDialogVisible = false;
            this.$message.success('派发成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      deleteCatalogTask() {
        this.isEditStatusBtnLoading = true;
        const taskIdsArr = this.selectedItems.map(item => item._id);
        libraryAPI.deleteCatalogTask({ taskIds: taskIdsArr.join(',') })
          .then((response) => {
            this.updateList();
            this.editStatusDialogVisible = false;
            this.$message.success('删除成功');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isEditStatusBtnLoading = false;
          });
      },
      resumeCatalogTask() {
        this.isEditStatusBtnLoading = true;
        const taskIdsArr = this.selectedItems.map(item => item._id);
        libraryAPI.resumeCatalogTask({ taskIds: taskIdsArr.join(',') })
          .then((response) => {
            this.updateList();
            this.editStatusDialogVisible = false;
            this.$message.success('恢复成功');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isEditStatusBtnLoading = false;
          });
      },
      showEditStatusDialog(type) {
        this.editStatusDialogVisible = true;
        this.editStatusDialogTitle = this.EDIT_STATUS_CONFIG[type].text;
        this.editStatusFn = this.EDIT_STATUS_CONFIG[type].fn;
      },
      handleCurrentPageChange(newPage, oldPage) {
        if (oldPage !== 0 && newPage > 0) {
          this.updateList();
        }
      },
      searchUser(query) {
        userAPI.listUserByDepartment(formatQuery(query, true))
          .then((response) => {
            this.userList = response.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
    components: {
      FourRowLayoutRightContent,
      SearchUserDialog,
      TaskDetail
    }
  };
</script>
<style>
  .search-item {
    float: left;
    margin-left: 10px;
    line-height: 100%;
  }
  .task-status-base {
    font-size: 12px;
    color: #fff;
    width: 48px;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    text-align: center;
    display: block;
  }
  .task-status-base.prepare {
    background: #38B1EB;
  }
  .task-status-base.doing {
    background: #C0C003;
  }
  .task-status-base.submitted {
    background: #AAA;
  }
  .task-status-base.delete {
    background: #2EC4B6;
  }
</style>
