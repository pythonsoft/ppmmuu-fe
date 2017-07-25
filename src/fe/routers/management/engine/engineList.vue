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
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="statusBtnClick">运行状态</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isSelected" @click="monitorBtnClick">服务监控</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination"></template>
  </layout-four-row>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';

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
        keyword: '',
      };
    },
    created() {
      const me = this;

      me.bubble.$on('engine.selectedNodeInfo', (node) => {
        me.selectedNodeInfo = node;
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
      statusBtnClick() {},
      monitorBtnClick() {},

      /* table */
      handleCurrentChange() {

      }
    }
  };
</script>
