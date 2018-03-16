<template>
  <div>
    <four-row-layout-right-content v-if="!showEdit">
      <template slot="search-left">上架任务</template>
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
          <fj-button type="primary" size="mini" v-bind:disabled="selectedIds.length !== 1" @click="handleClickDetail">查看详情</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="deleteDisable" @click="handleClickDelete">删除</fj-button>
        </div>
      </template>
      <template slot="table">
        <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20" align="center"></fj-table-column>
          <fj-table-column prop="status" label="状态" width="90"><template slot-scope="props"><div  v-html="formatStatus[props.row.status]"></div></template></fj-table-column>
          <fj-table-column prop="name" label="节目名称"></fj-table-column>
          <fj-table-column prop="programNO" label="节目编号" width="260"></fj-table-column>
          <fj-table-column prop="packageStatus" label="打包状态" width="50"><template slot-scope="props"><div v-html="getPackageStatus(props.row)"></div></template></fj-table-column>
          <fj-table-column prop="dealer" label="认领人" width="100"><template slot-scope="props">{{props.row.dealer.name}}</template></fj-table-column>
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
          --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
        </div>

      </fj-dialog>
      <shelf-detail
              :btnShow="false"
              :title="videoTitle"
              :programNO="programNO"
              :id="editId"
              :objectId="objectId"
              :visible.sync="detailDialogVisible">
      </shelf-detail>
    </four-row-layout-right-content>
    <edit v-else :shelfInfo="editRows" @show-back="handleShowBack" @update-list="handleClickSearch"></edit>
  </div>
</template>
<script>
  import { formatQuery, formatTime} from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';
  import { STATUS, formatStatus, formatPacakgeStatus } from '../../../shelves/config';
  import Edit from '../../../shelves/component/edit.vue';
  import ShelfDetail from '../../../shelves/component/shelfDetail';
  import '../../../shelves/index.css';

  const api = require('../../../../api/shelfManage');
  const OPTIONS = [
    {value: '', label: '全部'},
    {value: '1', label: '处理中'},
    {value: '2', label: '已提交'},
    {value: '3', label: '已删除'}
  ];

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
        showEdit: false,
        options: OPTIONS,
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
        canSendBackIds: [],
        canDeleteIds: [],
        selectedRows: [],
        editRows: [],
        formatStatus: formatStatus,
        formatTime: formatTime,
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
          status: me.status
        };
        api.listShelfManageTask(formatQuery(searchObj, true), me)
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
      },
      handleClickSendBack() {
        this.dialogMessage = '您确定要退回这些任务吗?';
        this.dialogVisible = true;
        this.sendBackOrDelete = 'sendBack';
      },
      handleClickEdit() {
        this.editRows = this.canEditRows;
        this.showEdit = true;
      },
      handleClickDelete() {
        this.dialogMessage = '您确定要删除这些任务吗?';
        this.dialogVisible = true;
        this.sendBackOrDelete = 'delete';
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
        if (this.sendBackOrDelete === 'sendBack') {
          postData = {
            _ids: this.canSendBackIds.join(','),
          };
          message = '退回';
          apiFunc = api.sendBackShelf;
        } else if (this.sendBackOrDelete === 'delete') {
          postData = {
            _ids: this.selectedIds.join(','),
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
        this.selectedIds = [];
        this.canEditRows = [];
        this.canSendBackIds = [];
        this.canDeleteIds = [];
        this.selectedRows = rows;
        if (rows && rows.length) {
          let flag1 = true;
          let flag2 = true;
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            if(row.status === STATUS.DOING){
              this.canEditRows.push(row);
            }
            if(row.status !== STATUS.DOING){
              flag1 = false;
            }
            if(row.status === STATUS.DOING){
              this.canSendBackIds.push(row._id);
            }
            if(row.status !== STATUS.DELETE){
              this.canDeleteIds.push(row._id)
            }else{
              flag2 = false;
            }
            this.selectedIds.push(row._id);
          }
          this.sendBackDisable = !flag1;
          this.deleteDisable = !flag2;
        }
      },
      clearTableSelection() {
        this.$refs.table.clearSelection();
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
      },
      handleClickEdit() {
        this.detailDialogVisible = true;
        const row = this.selectedRows[0];
        this.objectId = row.objectId;
        this.programNO = row.programNO;
        this.videoTitle = row.name;
        this.editId = row._id;
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
