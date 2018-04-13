<template>
  <four-row-layout-right-content>
    <template slot="search-left">我的任务列表({{ title }})</template>
    <template slot="search-right">
      <div class="search-item" :style="{ width: '190px' }">
        <fj-input theme="fill" size="small" placeholder="请编目任务名" v-model="keyword"></fj-input>
      </div>
      <div class="search-item">
        <fj-button size="small" type="primary" @click="updateList">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="isEditBtnDisabled" @click="showCatalog">编辑</fj-button>
        <fj-button :loading="isSubmitBtnLoading" size="mini" type="primary" :disabled="TASK_STATUS['SUBMITTED'].code === status || isBtnDisabled" @click="submitCatalogTask">提交</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="TASK_STATUS['DELETED'].code === status || isBtnDisabled" @click="showEditStatusDialog('deleteTask')">删除</fj-button>
        <fj-button size="mini" type="primary" :disabled="isBtnDisabled" @click="showEditStatusDialog('sendBackTask')">退回</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="isBtnDisabled" @click="detailDialogVisible=true">任务详情</fj-button>
        <fj-button size="mini" type="primary" @click="updateList">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" @current-change="handleSelectionChange">
        <fj-table-column prop="status" label="状态" width="60" align="center">
           <template slot-scope="props">
             <span :class="getStatusByCode(props.row.status).css">{{ getStatusByCode(props.row.status).text }}</span>
           </template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="assignee" label="派发人">
          <template slot-scope="props">{{ props.row.assignee.name || '--' }}</template>
        </fj-table-column>
        <fj-table-column prop="lastModifyTime" label="更新时间">
          <template slot-scope="props">{{ props.row.lastModifyTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="createdTime" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination" v-show="tableData.length">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="updateList"></fj-pagination>
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
    <task-detail
      :objectId="taskObjectId"
      :visible.sync="detailDialogVisible">
    </task-detail>
  </four-row-layout-right-content>
</template>
<script>
  import { TASK_STATUS, getStatusByCode } from '../config';
  import TaskDetail from '../component/taskDetail';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent';
  import { formatQuery } from '../../../common/utils';
  const libraryAPI = require('../../../api/library');

  export default {
    data() {
      return {
        selectedItem: {},
        tableData: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        keyword: '',
        status: 'all',
        title: '全部',
        isSubmitBtnLoading: false,
        editStatusDialogTitle: '',
        editStatusDialogVisible: false,
        isEditStatusBtnLoading: false,
        editStatusFn: () => {},
        detailDialogVisible: false,
        taskObjectId: ''
      };
    },
    computed: {
      isBtnDisabled() {
        return !this.selectedItem._id;
      },
      isEditBtnDisabled() {
        if (this.selectedItem && this.selectedItem.status == TASK_STATUS.DOING.code) return false;
        return true;
      }
    },
    created() {
      this.TASK_STATUS = TASK_STATUS;
      this.EDIT_STATUS_CONFIG = {
        sendBackTask: { text: '退回任务', fn: this.sendBackCatalogTask },
        deleteTask: { text: '删除任务', fn: this.deleteCatalogTask }
      };
      this.updateStatus();
    },
    watch: {
      '$route.path'(val) {
        this.updateStatus();
      },
      selectedItem(val) {
        if (val) {
          this.taskObjectId = val.objectId;
        }
      }
    },
    methods: {
      showCatalog() {
        if (!this.selectedItem._id) return;
        const fromWhere = this.selectedItem.fromWhere || 'HK_RUKU';
        this.$router.push({
          name: 'catalog',
          params: { objectId: this.selectedItem.objectId, taskId: this.selectedItem._id, fromWhere: fromWhere }
        });
      },
      showEditStatusDialog(type) {
        this.editStatusDialogVisible = true;
        this.editStatusDialogTitle = this.EDIT_STATUS_CONFIG[type].text;
        this.editStatusFn = this.EDIT_STATUS_CONFIG[type].fn;
      },
      sendBackCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.sendBackCatalogTask({ taskIds: this.selectedItem._id })
          .then((response) => {
            this.updateList();
            this.editStatusDialogVisible = false;
            this.$message.success('退回成功');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isEditStatusBtnLoading = false;
          });
      },
      deleteCatalogTask() {
        this.isEditStatusBtnLoading = true;
        libraryAPI.deleteCatalogTask({ taskIds: this.selectedItem._id })
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
      submitCatalogTask() {
        this.isSubmitBtnLoading = true;
        libraryAPI.submitCatalogTask({ taskIds: this.selectedItem._id })
          .then((response) => {
            this.updateList();
            this.$message.success('提交成功');
          })
          .catch((error) => {
            this.$message.error(error);
          })
          .then(() => {
            this.isSubmitBtnLoading = false;
          });
      },
      updateStatus() {
        const keys = Object.keys(TASK_STATUS);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (this.$route.name.indexOf(key.toLowerCase()) > -1) {
            this.status = TASK_STATUS[key].code;
            this.title = TASK_STATUS[key].text;
            this.currentPage = 1;
            this.updateList();
            break;
          }
        }
      },
      getStatusByCode,
      updateList() {
        const data = {
          status: this.status === 'all' ? '' : this.status,
          keyword: this.keyword,
          page: this.currentPage,
          pageSize: this.pageSize
        };
        libraryAPI.listMyCatalogTask(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            this.tableData = responseData.docs;
            this.currentPage = responseData.page;
            this.total = responseData.total;
            this.selectedItem = {};
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSelectionChange(val) {
        this.selectedItem = val;
      }
    },
    components: {
      FourRowLayoutRightContent,
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
    background: #2EC4B6;
  }
  .task-status-base.delete {
    background: #aaa;
  }
</style>
