<template>
  <div>
    <four-row-layout-right-content v-if="!showEdit">
      <template slot="search-left">下载审核</template>
      <template slot="search-right">
        <div class="audit-download-search-item" :style="{ width: '100px' }">
          <fj-select placeholder="请选择" v-model="status" size="small">
            <fj-option
              v-for="item in options"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </fj-option>
          </fj-select>
        </div>
        <div class="audit-download-search-item">
          <fj-input placeholder="请输入关键词" v-model="keyword" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
        </div>
        <div class="audit-download-search-item">
          <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
        </div>
      </template>
      <template slot="operation">
        <div class="operation-btn-group">
          <fj-button type="info" size="mini" v-bind:disabled="canPassIds.length < 1" @click="handleClickPass">通过</fj-button>
          <fj-button type="info" size="mini" v-bind:disabled="canRejectIds.length < 1" @click="handleClickReject">拒绝</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="info" size="mini" @click="refreshClick">刷新</fj-button>
        </div>
      </template>
      <template slot="table">
        <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20" align="center"></fj-table-column>
          <fj-table-column prop="status" label="状态" width="90"><template scope="props"><div  v-html="formatStatus[props.row.status]"></div></template></fj-table-column>
          <fj-table-column prop="name" label="名称"></fj-table-column>
          <fj-table-column prop="applicant" label="申请人"><template scope="props">{{props.row.applicant.companyName + '-' + props.row.applicant.name}}</template></fj-table-column>
          <fj-table-column prop="verifier" label="审核人"><template scope="props">{{props.row.verifier.companyName + '-' + props.row.verifier.name}}</template></fj-table-column>
          <fj-table-column prop="createTime" label="创建时间" width="160"><template scope="props">{{formatTime(props.row.createTime)}}</template></fj-table-column>
        </fj-table>
      </template>
      <template slot="pagination">
        <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
      </template>
      <fj-dialog title="提示" :visible.sync="dialogVisible" @close="cancelDialog">
        <span>{{ dialogMessage }}</span>
        <div slot="footer" class="dialog-footer">
          <fj-button @click="cancelDialog">取消</fj-button><!--
          --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
        </div>
      </fj-dialog>
    </four-row-layout-right-content>
  </div>
</template>
<script>
  import './index.css';
  import { formatQuery, formatTime} from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';
  import { config } from '../config';

  const api = require('../../../../api/audit');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        showEdit: false,
        options: config.AUDIT_STATUS,
        dialogMessage: '',
        departmentId: '',
        sendBackOrDelete: '',
        keyword: '',
        status: '',
        tableData: [],
        searchOwner: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        sendBackDisable: true,
        deleteDisable: true,
        selectedIds: [],
        canEditRows: [],
        canRejectIds: [],
        canPassIds: [],
        selectedRows: [],
        editRow: {},
        formatStatus: config.formatStatus,
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
      refreshClick() {
        this.listAudit();
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickSearch() {
        this.listAudit();
      },
      listAudit() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          keyword: me.keyword,
          status: me.status
        };

        api.listAudit(formatQuery(searchObj, true), me).then((res) => {
          const data = res.data;
          me.tableData = data ? data.docs : [];
          me.currentPage = data.page;
          me.total = data.total;
          me.pageSize = data.pageSize;
          me.handleSelectionChange();
        }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      handleClickPass(){
        this.dialogMessage = '您确定要审核通过这些任务吗';
        this.dialogVisible = true;
        this.sendBackOrDelete = 'pass';
      },
      handleClickReject(){
        this.dialogMessage = '您确定要拒绝这些任务吗';
        this.dialogVisible = true;
        this.sendBackOrDelete = 'reject';
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
        if (this.sendBackOrDelete === 'pass') {
          postData = {
            ids: this.canPassIds.join(','),
            status: '2'
          };
          message = '审核通过';
          apiFunc = api.auditPass;
        } else if (this.sendBackOrDelete === 'reject') {
          postData = {
            ids: this.canRejectIds.join(','),
            status: '3'
          };
          message = '拒绝';
          apiFunc = api.auditPass;
        } else {
          this.resetDialog();
          return;
        }

        apiFunc(postData).then((response) => {
          me.showSuccessInfo(`${message}成功!`);
          me.resetDialog();
          me.handleClickSearch();
        }).catch((error) => {
          me.showErrorInfo(error);
          me.resetDialog();
        });
      },
      handleSelectionChange(rows) {
        this.selectedIds = [];
        this.canPassIds = [];
        this.canRejectIds = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            this.selectedIds.push(row._id);
            if(row.status === '1'){
              this.canPassIds.push(row._id);
              this.canRejectIds.push(row._id);
            }
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
<style scope>
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
  .deleted {
    background: #AAAAAA;
  }

  .prepare {
    background: #38B1EB;
  }

  .doing {
    background: #C0C003;
  }
</style>

