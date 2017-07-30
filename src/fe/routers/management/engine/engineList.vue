<template>
  <layout-four-row>
    <template slot="search-left">{{selectedNodeInfo.name}}</template>
    <template slot="search-right">
      <div class="layout-engine-four-row-search-item">
        <fj-input :rows="1" placeholder="请输入名称、IP或Id" v-model="keyword"></fj-input>
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
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">变更</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteBtnClick">删除</fj-button>
      </span>
      <span class="layout-engine-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="installBtnClick">安装</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="stopBtnClick">停止</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="rebootBtnClick">重启</fj-button>
      </span>
      <span class="layout-engine-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="configBtnClick">配置管理</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="statusBtnClick">运行状态</fj-button>
      </span>
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="monitorBtnClick">服务监控</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="isInstallMonitor" width="90" align="center" label="是否安装">
          <template scope="props">{{ getTextByValue(props.row.isInstallMonitor, 'isInstallMonitor') }}</template>
        </fj-table-column>
        <fj-table-column prop="status" width="90" align="center" label="运行状态" >
          <template scope="props">{{ getRunStatus(props.row.command, props.row.modifyTime) }}</template>
        </fj-table-column>
        <fj-table-column prop="code" width="100" label="编号"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="intranetIp" width="140" align="center" label="内网IP"></fj-table-column>
        <fj-table-column prop="isTest" width="90" align="center" label="测试机">
          <template scope="props">{{ getTextByValue(props.row.isTest, 'isTest') }}</template>
        </fj-table-column>
        <fj-table-column prop="isVirtual" width="90" align="center" label="虚拟机">
          <template scope="props">{{ getTextByValue(props.row.isVirtual, 'isVirtual') }}</template>
        </fj-table-column>
        <fj-table-column prop="modifyTime" width="160" align="center" label="上次活跃">
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
  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';


  const api = require('../../../api/engine');
  const status = require('./engineStatus');

  export default {
    name: 'engineList',
    components: {
      'layout-four-row': fourRowLayout
    },
    props: {
      vueInstance: { type: Object },
      selectedNodeInfo: { type: Object }
    },
    data() {
      return {
        isDisabled: true,
        tableData: [],
        bubble: this.vueInstance,
        selectEngineInfo: {},
        table: {
          currentRowInfo: {}
        },
        /* engine param */
        keyword: '',
        page: 1,
        pageSize: 20,
        total: 0
      };
    },
    created() {
      const me = this;

      me.bubble.$on('engine.listEngine', () => {
        me.initParam();
        me.listEngine();
      });
    },
    methods: {
      initParam() {
        this.isDisabled = true;
        this.tableData = [];
        this.keyword = '';
        this.page = 1;
        this.table = {
          currentRowInfo: {}
        };
      },
      handleClickSearch() {

      },
      getTextByValue(v, st) {
        return status.getTextByValue(v, st);
      },
      getRunStatus(command, time) {
        return status.getRunStatus(command, time);
      },
      /* btn */
      addBtnClick() {
        const me = this;
        me.$emit('display-slide-dialog', true, 'add');
      },
      editBtnClick() {
        const me = this;
        me.$emit('display-slide-dialog', true, 'edit');
      },
      deleteBtnClick() {
        const me = this;
        me.$emit('display-dialog', true, 'deleteEngine');
      },
      installBtnClick() {},
      stopBtnClick() {},
      rebootBtnClick() {},
      configBtnClick() {
        this.$emit('display-setting-slide-dialog', true);
      },
      statusBtnClick() {},
      monitorBtnClick() {},

      /* table */
      handleCurrentChange(current, prev) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
        this.$emit('engine-select', current); // 将选中的当前引擎信息传到父组件
      },

      pageChange(val) {
        this.page = val;
        this.listEngine();
      },

      /* api */
      listEngine() {
        const me = this;

        const param = {
          keyword: me.keyword,
          groupId: me.selectedNodeInfo.id || '',
          page: me.page,
          pageSize: me.pageSize
        };

        api.listEngine({ params: param }).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
        }).catch((error) => {
          me.showErrorInfo(error.message);
        });
      }
    }
  };
</script>
