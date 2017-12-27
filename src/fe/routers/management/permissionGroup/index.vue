<template>
  <three-row-layout-right-content>
    <template slot="search-left">权限组</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-input placeholder="请输入权限组或主菜单" v-model="name" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
      </div>
      <div class="permission-search-item">
        <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table">
        <fj-table-column prop="index" label="名称" width="200"></fj-table-column>
        <fj-table-column prop="name" label="中文名称" width="200"></fj-table-column>
        <fj-table-column prop="topParentMenu" label="主菜单" width="200"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
  </three-row-layout-right-content>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import ThreeRowLayoutRightContent from '../../../component/layout/threeRowLayoutRightContent/index';

  const api = require('../../../api/role');

  export default {
    components: {
      'three-row-layout-right-content': ThreeRowLayoutRightContent
    },
    data() {
      return {
        defaultRoute: '/',
        name: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 20
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
          keyword: me.name,
        };
        api.listPermissionGroup(formatQuery(searchObj, true), me)
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
</style>
