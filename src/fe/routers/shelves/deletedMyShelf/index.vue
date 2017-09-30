<template>
  <three-row-layout-right-content>
    <template slot="search-left">我的任务(已删除)</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-input placeholder="请输入关键词" v-model="keyword" size="small"></fj-input>
      </div>
      <div class="permission-search-item">
        <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table">
        <fj-table-column prop="name" label="节目名称"></fj-table-column>
        <fj-table-column prop="programNO" label="节目编号" ></fj-table-column>
        <fj-table-column prop="assignee" label="派发人"><template scope="props">{{props.row.assignee.name}}</template></fj-table-column>
        <fj-table-column prop="dealer" label="认领人"><template scope="props">{{props.row.dealer.name}}</template></fj-table-column>
        <fj-table-column prop="operationTime" label="操作时间"><template scope="props">{{formatTime(props.row.operationTime)}}</template></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
  </three-row-layout-right-content>
</template>
<script>
  import { formatQuery, formatTime} from '../../../common/utils';
  import ThreeRowLayoutRightContent from '../../../component/layout/threeRowLayoutRightContent/index';
  import { STATUS } from '../config';

  const api = require('../../../api/shelves');

  export default {
    components: {
      'three-row-layout-right-content': ThreeRowLayoutRightContent,
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        assignDialogVisible: false,
        dialogMessage: '',
        departmentId: '',
        sendBackOrDelete: '',
        keyword: '',
        tableData: [],
        searchOwner: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        selectedIds: [],
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
          status: STATUS.DELETE
        };
        api.listMyselfShelfTask(formatQuery(searchObj, true), me)
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
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

  .permission-btn-mini-margin {
    margin-left: 6px;
    font-size: 12px;
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
    width: 48px;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    text-align:center;
    display: block;
  }
  .permission-enable {
    background: #2EC4B6;
  }

  .permission-disable {
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
