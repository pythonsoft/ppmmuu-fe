<template>
  <four-row-layout-right-content>
    <template slot="search-left">工作流定义</template>
    <template slot="operation">
      <div :class="$style.group">
        <fj-button type="primary" size="mini" @click="handleClickAdd">增加</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="currentSelectRow" @click="handleClickEdit">修改</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="currentSelectRow" @click="handleClickEdit">详情</fj-button>
      </div>
      <div :class="$style.group">
        <fj-button type="primary" size="mini" @click="refresh">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="version" label="版本"></fj-table-column>
        <fj-table-column prop="createTime" width="160" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="modifiedTime" width="160" label="修改时间">
          <template slot-scope="props">{{ props.row.modifiedTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery } from '../../../../common/utils';
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent/index';

  const api = require('../../../../api/wokflow');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
    },
    data() {
      return {
        defaultRoute: '/',
        tableData: [],
        total: 0,
        currentPage: 1,
        pageSize: 25,
        currentSelectRow: null
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
      handleSelectionChange(rows) {
        console.log('rows -->', rows);
      },
      handleCurrentPageChange() {
        this.list();
      },
      handleClickAdd() {

      },
      handleClickEdit() {

      },
      refresh() {
        this.list();
      },
      list() {
        const me = this;
        const postData = {
          page: me.currentPage,
          pageSize: me.pageSize,
        };

        api.workflow_definition_list(formatQuery(postData, true), me).then((res) => {
          const data = res.data;
          me.tableData = data ? data.docs : [];
          me.currentPage = data.page;
          me.total = data.total;
        }).catch((err) => {
          me.$message.error(err);
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
</style>
