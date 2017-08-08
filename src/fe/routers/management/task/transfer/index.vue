<template>
  <layout-four-row>
    <template slot="search-left">存储区</template>
    <template slot="search-right">
      <div class="layout-four-row-search-item" :style="{ width: '78px' }">
        <fj-select placeholder="请选择" v-model="formData.status">
          <fj-option
            v-for="item in status"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div class="layout-four-row-search-item" :style="{ width: '190px' }">
        <fj-input :rows="1" placeholder="请输入存储区名称" v-model="formData.keyword"></fj-input>
      </div>
      <div class="layout-four-row-search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
        <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" @click="addBtnClick">增加</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">变更</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteBtnClick">删除</fj-button>
      </span>
      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editPathClick">配置路径</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editTacticsClick">配置策略</fj-button>
      </span>
      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="setEnableClick">启用</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="setDisableClick">挂起</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态">
          <template scope="props">{{ formatStatus(props.row.status) }}</template>
        </fj-table-column>
        <fj-table-column prop="_id" width="90" label="标识" ></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="type" width="90" label="存储类型">
          <template scope="props">{{ formatType(props.row.type) }}</template>
        </fj-table-column>
        <fj-table-column prop="permission" width="90" label="读写权限">
          <template scope="props">{{ formatPermission(props.row.permission) }}</template>
        </fj-table-column>
        <fj-table-column prop="creator" width="90" label="创建人">
          <template scope="props">{{ props.row.creator.name }}</template>
        </fj-table-column>
        <fj-table-column prop="createdTime" width="160" align="center" label="创建时间">
          <template scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="modifyTime" width="160" align="center" label="修改时间">
          <template scope="props">{{ props.row.modifyTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination
        :page-size="pageSize"
        :total="total"
        :current-page.sync="page"
        @current-change="pageChange">
      </fj-pagination>
    </template>
  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import utils from '../../../../common/utils';

  const api = require('../../../../api/engine');
  const config = require('./config');

  export default {
    components: {
      'layout-four-row': fourRowLayout
    },
    data() {
      return {
        isDisabled: true,
        status: config.config.STATUS,
        formData: {
          keyword: '',
          status: '-1'
        },
        table: {
          currentRowInfo: {}
        },
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0
      };
    },
    created() {
    },
    methods: {
      handleClickSearch(v) {

      },
      addBtnClick() {},
      editBtnClick() {},
      deleteBtnClick() {},
      editPathClick() {},
      editTacticsClick() {},
      setEnableClick() {},
      setDisableClick() {},
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
        this.$emit('engine-select', current); // 将选中的当前引擎信息传到父组件
      },
      formatStatus(v) {
        return v;
      },
      formatType(v) {
        return v;
      },
      formatPermission(v) {
        return v;
      },
      pageChange(val) {
        this.page = val;
      //        this.listEngine();
      }
    }
  };
</script>
