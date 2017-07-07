<template>
    <div class="permission-content">
      <div class="top-search">
        <div class="search-title">权限</div>
        <div class="search-right-content">
          <div class="search-item">
            <fj-select placeholder="请选择" v-model="select" size="mini">
              <fj-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </fj-option>
            </fj-select>
          </div>
          <div class="search-item">
            <fj-input placeholder="请输入账户名" v-model="accountName"></fj-input>
          </div>
          <div class="search-item">
            <fj-button type="primary" @click="handleClickSearch">搜索</fj-button>
          </div>
        </div>
      </div>
       <div class="permission-operation">
          <fj-button type="info" size="mini" v-bind:disabled="enabled" @click="handleClickEnable">启用</fj-button>
          <fj-button type="info" size="mini" v-bind:disabled="disabled" @click="handleClickDisable">禁用</fj-button>
       </div>
        <div>
          <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
            <fj-table-column type="selection" width="20" align="center"></fj-table-column>
            <fj-table-column prop="status" label="状态"></fj-table-column>
            <fj-table-column prop="name" label="名称" ></fj-table-column>
            <fj-table-column prop="address" label="描述"></fj-table-column>
          </fj-table>
          <div class="table-pagination">
            <fj-pagination :page-size="10" :total="100" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
          </div>
        </div>
    </div>
</template>
<script>
  export default {
    data() {
      return {
        defaultRoute: '/',
        select: '启用',
        options: [{
          value: '0',
          label: '启用'
        }, {
          value: '1',
          label: '禁用'
        }, {
          value: '',
          label: '全部'
        }],
        accountName: "",
        enabled: true,
        disabled: true,
        tableData: []
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickSearch(){

      },
      handleClickEnable(){

      },
      handleClickDisable(){

      }
    }
  };
</script>
<style>
    .permission-content {
      margin-top: 15px;
      margin-left: 20px;
    }

    .top-search {
      height: 40px;
      width: 100%;
      line-height: 40px;
      position: relative;
      min-width: 700px;
    }

    .top-search .search-title{
      font-size: 16px;
      color: #273F57;
      position: absolute;
      left: 20px;
      top: 15px;
    }

    .top-search .search-right-content{
      position: absolute;
      top: 15px;
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
      margin-top: 25px;
      padding-left: 20px;
    }

    .table-pagination {
      margin-top: 30px;
      text-align: center;
      height: 28px;
      line-height: 28px;
      color: #4C637B;
    }
</style>
