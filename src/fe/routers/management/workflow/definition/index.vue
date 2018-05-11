<template>
  <four-row-layout-right-content>
    <template slot="search-left">定义管理</template>
    <template slot="search-right">
      <div :class="$style.searchItem">
        <fj-input size="small" placeholder="请输入关键字" v-model="keyword"></fj-input>
      </div>
      <div :class="$style.searchItem">
        <fj-button size="small" type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div :class="$style.group">
        <fj-button type="primary" size="mini" @click="handleClickCreate">增加</fj-button>
        <fj-button type="primary" size="mini" :disabled="!currentSelectRow" @click="handleClickEdit">修改</fj-button>
        <fj-button type="primary" size="mini" :disabled="!currentSelectRow" @click="isShowDetailDialog=true">详情</fj-button>
      </div>
      <div :class="$style.group">
        <fj-button type="primary" size="mini" @click="refresh">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @current-change="handleCurrentChange">
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="version" label="版本"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
        <fj-table-column prop="createTime" width="160" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="modifiedTime" width="160" label="修改时间">
          <template slot-scope="props">{{ props.row.modifiedTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <edit-dialog
      :type="editDialogType"
      :info="currentSelectRow"
      :visible.sync="isShowEditDialog"
      @update-list="list"></edit-dialog>
    <detail-dialog :visible.sync="isShowDetailDialog" :id="currentSelectRow && currentSelectRow.id"></detail-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery } from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';
  import EditDialog from './component/edit';
  import DetailDialog from './component/detail';

  const api = require('../../../../api/wokflow');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
      EditDialog,
      DetailDialog
    },
    data() {
      return {
        defaultRoute: '/',
        tableData: [],
        total: 0,
        currentPage: 1,
        pageSize: 25,
        currentSelectRow: null,
        isShowEditDialog: false,
        isShowDetailDialog: false,
        editDialogType: 'create',
        keyword: ''
      }
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.list();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleCurrentChange(row) {
        this.currentSelectRow = row;
      },
      handleCurrentPageChange() {
        this.list();
      },
      handleClickCreate() {
        this.isShowEditDialog = true;
        this.editDialogType = 'create';
      },
      handleClickEdit() {
        this.isShowEditDialog = true;
        this.editDialogType = 'edit';
      },
      handleClickSearch() {},
      refresh() {
        this.list();
      },
      list() {
        const postData = {
          page: this.currentPage,
          pageSize: this.pageSize
        };

        api.workflow_definition_list(formatQuery(postData, true), this).then((res) => {
          const data = res.data;
          this.tableData = data ? data : [];
          // this.currentPage = data.page;
          // this.total = data.total;
          this.currentSelectRow = null;
        }).catch((err) => {
          this.$message.error(err);
        });
      }
    }
  }
</script>
<style module>
  .group {
    display: inline-block;
    margin-right: 18px;
  }
  .group button {
    margin-right: 6px;
  }
  .searchItem {
    float: left;
    margin-left: 10px;
    line-height: 100%;
  }
</style>
