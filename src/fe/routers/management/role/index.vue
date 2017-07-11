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
      <fj-table :data="tableData" name="table1" ref="table" @current-change="handleCurrentChange">
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
      <div class="table-pagination" slot="pagination">
        <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
      </div>
    </div>
    <fj-slide-dialog
            :title="slideDialogTitle"
            :visible.sync="slideDialogVisible"
            @open="handleOpenSlideDialog"
            @close="handleCloseSlideDialog">

      <fj-form :model="formData" :rules="rules" ref="form" label-width="80px">
        <fj-form-item label="标识" prop="_id">
          <fj-input v-model="formData._id"></fj-input>
        </fj-form-item>
        <fj-form-item label="名称" prop="name">
          <fj-input v-model="formData.name"></fj-input>
        </fj-form-item>
        <fj-form-item label="描述" prop="description">
          <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
        </fj-form-item>
      </fj-form>

      <div slot="footer">
        <fj-button @click="slideDialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="saveClick">保存</fj-button>
      </div>

    </fj-slide-dialog>
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
        addBtnDisabled: false,
        editBtnDisabled: true,
        configBtnDisabled: true,
        manageBtnDisabled: true,
        deleteBtnDisabled: true,
        keyword: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        slideDialogTitle: '添加角色',
        slideDialogVisible: false,
        formData: {}
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
        api.getRoleList(formatQuery(searchObj, true))
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
      saveClick(){

      },
      resetSlideDialog(){
        this.slideDialogTitle = "";
        this.slideDialogVisible = false;
        this.formData = {};
      },
      handleCurrentChange(row) {
        console.log("row===>", row);
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
    .top-search .search-right-content .search-item{
      float: left;
      margin-left: 10px;
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
