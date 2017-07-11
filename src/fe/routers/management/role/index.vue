<template>
  <table-list-layout>
    <div slot="search-left">角色</div>
    <div slot="search-right">
      <div class="search-item">
        <fj-input placeholder="请输入名称或标识" v-model="keyword"></fj-input>
      </div>
      <div class="search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </div>
    <div slot="operation">
     <span class="btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="addBtnDisabled" @click="addBtnClick">增加</fj-button>
     </span>
     <span class="btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="editBtnDisabled" @click="editBtnClick">编辑</fj-button>
     </span>
     <span class="btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="configBtnDisabled" @click="configBtnClick">配置</fj-button>
     </span>
      <span class="btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="manageBtnDisabled" @click="manageBtnClick">管理账户及组织</fj-button>
      </span>
      <span class="btn-margin">
        <fj-button type="danger" size="mini" v-bind:disabled="deleteBtnDisabled" @click="deleteBtnClick">删除</fj-button>
      </span>
    </div>
    <div slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
      <div class="table-pagination" slot="pagination">
        <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
      </div>
    </div>
  </table-list-layout>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import TableListLayout from '../../../component/layout/tableListLayout/tableListLayout';

  const api = require('../../../../../build/api/role');

  export default {
    components: {
      'table-list-layout': TableListLayout
    },
    data() {
      return {
        defaultRoute: '/',
        addBtnDisabled: true,
        editBtnDisabled: true,
        configBtnDisabled: true,
        manageBtnDisabled: true,
        deleteBtnDisabled: true,
        keyword: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15
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
          keyword: me.keyword
        };
        api.getRoleList(formatQuery(searchObj))
        .then(function(res){
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
        })
        .catch(function(error){
           me.showErrorInfo(error);
        });
      },
      addBtnClick() {

      },
      editBtnClick() {

      },
      configBtnClick() {

      },
      manageBtnClick() {

      },
      deleteBtnClick() {
      },
      handleSelectionChange(rows) {
        this.selectedDisableIds = [];
        this.selectedEnableIds = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            if (row.status === '0') {
              this.selectedDisableIds.push(row._id);
            } else {
              this.selectedEnableIds.push(row._id);
            }
          }
        }
        this.enabled = !this.selectedEnableIds.length;
        this.disabled = !this.selectedDisableIds.length;
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
    .permission-content {
      margin-left: 20px;
      margin-top: 10px;
    }

    .top-search {
      height: 40px;
      width: 100%;
      line-height: 38px;
      position: relative;
      min-width: 700px;
    }

    .top-search .search-title{
      font-size: 16px;
      color: #273F57;
      position: absolute;
      left: 20px;
    }

    .top-search .search-right-content{
      position: absolute;
      right: 20px;
    }

    .top-search .search-right-content .search-item{
      float: left;
      margin-left: 10px;
    }

    .permission-operation{
      background: #F2F6FA;
      line-height: 46px;
      height: 46px;
      margin-top: 10px;
      padding-left: 20px;
    }

    .btn-mini-margin {
      margin-left: 6px;
      font-size: 12px;
    }

    .btn-margin {
      margin-left: 18px;
      font-size: 12px;
    }

    .table-pagination {
      margin-top: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      color: #4C637B;
    }

    .status-span {
      font-size: 12px;
      color: #FFFFFF;
      width: 48px;
      height: 20px;
      line-height: 20px;
      border-radius: 2px;
      text-align:center;
      display: block;
    }
    .enable {
      background: #2EC4B6;
    }

    .disable {
      background: #FF3366;
    }
</style>
