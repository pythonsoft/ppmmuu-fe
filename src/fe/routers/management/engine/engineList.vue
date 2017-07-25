<template>
  <layout-four-row>
    <template slot="search-left">{{selectedNodeInfo.name}}</template>
    <template slot="search-right">
      <div class="layout-engine-four-row-search-item">
        <fj-input placeholder="请输入名称、IP或Id" v-model="keyword"></fj-input>
      </div>
      <div class="layout-engine-four-row-search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" @click="addBtnClick">增加</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="editBtnClick">变更</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="deleteBtnClick">删除</fj-button>
      </span>
      <span class="layout-engine-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="installBtnClick">安装</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="stopBtnClick">停止</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="rebootBtnClick">重启</fj-button>
      </span>
      <span class="layout-engine-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="configBtnClick">配置管理</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="statusBtnClick">运行状态</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="monitorBtnClick">服务监控</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="isInstallMonitor" width="90" align="center" label="是否安装"></fj-table-column>
        <fj-table-column prop="status" width="90" align="center"  label="运行状态" ></fj-table-column>
        <fj-table-column prop="code" width="100" label="编号"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="intranetIp" width="140" align="center" label="内网IP"></fj-table-column>
        <fj-table-column prop="isTest" width="90" align="center" label="测试机"></fj-table-column>
        <fj-table-column prop="isVirtual" width="90" align="center" label="虚拟机"></fj-table-column>
        <fj-table-column prop="modifyTime" width="140" align="center" label="上次活跃"></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination"></template>
  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';

  const api = require('../../../api/engine');

  export default {
    name: 'engineList',
    components: {
      'layout-four-row': fourRowLayout
    },
    props: ['vueInstance'],
    data() {
      return {
        isSelected: true,
        tableData: [],
        title: '',
        selectedNodeInfo: {},
        bubble: this.vueInstance,
        selectEngineInfo: {},
        /* engine param */
        keyword: '',
        page: 1,
      };
    },
    created() {
      const me = this;

      me.bubble.$on('engine.selectedNodeInfo', (node) => {
        me.selectedNodeInfo = node;
        me.keyword = '';
        me.page = 1;
        me.selectEngineInfo = {};
      });

      me.bubble.$on('engine.getSelectedNodeInfo.callback', (node) => {
        me.selectedNodeInfo = node;
      });

      this.bubble.$emit('engine.getSelectedNodeInfo');
    },
    methods: {
      handleClickSearch() {

      },
      /* btn */
      addBtnClick() {},
      editBtnClick() {},
      deleteBtnClick() {},
      installBtnClick() {},
      stopBtnClick() {},
      rebootBtnClick() {},
      configBtnClick() {},
      statusBtnClick() {},
      monitorBtnClick() {},

      /* table */
      handleCurrentChange() {

      },

      /* api */
      listEngine() {
        const me = this;

        const param = {
          keyword: me.keyword,
          groupId: me.selectedNodeInfo.id || '',
          page: me.page,
          pageSize: 20,
        };

        api.listGroup({ params: param }).then((res) => {
          me.tableData = res.data.docs;
        }).catch((error) => {
          me.showErrorInfo(error.message);
        });
      }
    }
  };
</script>
