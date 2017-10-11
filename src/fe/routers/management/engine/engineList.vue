<template>
  <layout-four-row>
    <template slot="search-left">{{selectedNodeInfo.name}}</template>
    <template slot="search-right">
      <div class="layout-engine-four-row-search-item">
        <fj-input size="small" :rows="1" placeholder="请输入名称、IP或Id" v-model="keyword"></fj-input>
      </div>
      <div class="layout-engine-four-row-search-item">
        <fj-button size="small" type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button type="info" size="mini" @click="addBtnClick">增加</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">变更</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteBtnClick">删除</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="installBtnClick">安装</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="stopBtnClick">停止</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="rebootBtnClick">重启</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="configBtnClick">配置管理</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="statusBtnClick">运行状态</fj-button>
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="monitorBtnClick">服务监控</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button type="info" size="mini" @click="refreshBtnClick">刷新</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="运行状态" >
          <template scope="props">
            <span :class="getRunStatus(props.row.command, props.row.modifyTime).css">{{ getRunStatus(props.row.command, props.row.modifyTime).text }}</span>
          </template>
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
    <fj-dialog
              :title="enterAuthenticationDialogTitle"
              :visible.sync="enterAuthenticationDialogVisible">
      <fj-input
        placeholder="用户名"
        v-model="username"></fj-input></br>
      <fj-input
        placeholder="密码"
        v-model="password"></fj-input>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="enterAuthenticationDialogVisible=false">取消</fj-button>
        <fj-button type="primary" :loading="isEnterAuthenticationBtnLoading" @click="installMonitor">确定</fj-button>
      </div>
    </fj-dialog>
  </layout-four-row>
</template>
<script>

  import './index.css';
  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';
  import utils from '../../../common/utils';

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
        table: {
          currentRowInfo: {}
        },
        /* engine param */
        keyword: '',
        page: 1,
        pageSize: 20,
        total: 0,
        enterAuthenticationDialogTitle: '',
        enterAuthenticationDialogVisible: false,
        isEnterAuthenticationBtnLoading: false,
        username: '',
        password: '',
      };
    },
    created() {
      const me = this;
      let isFetchDataNow = false;

      me.bubble.$on('engine.listEngine', () => {
        if (isFetchDataNow) { return; }
        isFetchDataNow = true;
        me.initParam();
        me.listEngine(() => {
          isFetchDataNow = false;
        });
      });

      me.listEngine(() => {
        isFetchDataNow = false;
      });
    },
    destroyed() {
      this.bubble.$off('engine.listEngine');
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
      installBtnClick() {
        this.enterAuthenticationDialogTitle = '请输入服务器的用户名密码';
        this.enterAuthenticationDialogVisible = true;
      },
      stopBtnClick() {},
      rebootBtnClick() {},
      configBtnClick() {
        this.$emit('display-setting-slide-dialog', true);
      },
      statusBtnClick() {},
      monitorBtnClick() {
        this.$emit('display-service-list-view', true);
      },

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
      refreshBtnClick() {
        this.listEngine();
      },
      /* api */
      listEngine(completeFn) {
        const me = this;

        const param = {
          keyword: me.keyword,
          groupId: me.selectedNodeInfo.id || '',
          page: me.page,
          pageSize: me.pageSize
        };

        api.listEngine({ params: param }, me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
          completeFn && completeFn();
        }).catch((error) => {
          me.showErrorInfo(error.message);
          completeFn && completeFn();
        });
      },
      installMonitor() {
        this.isEnterAuthenticationBtnLoading = true;
        const me = this;
        if (utils.isEmptyObject(me.table.currentRowInfo)) {
          me.$message.error('请先选择需要安装的引擎');
          return false;
        }

        const param = {
          ip: me.table.currentRowInfo.intranetIp
        };
        if (this.username && this.password) {
          param.username = this.username;
          param.password = this.password;
        }

        api.installMonitor(param, me).then((res) => {
          this.isEnterAuthenticationBtnLoading = false;
          this.enterAuthenticationDialogVisible = false;
          me.$message.success('正在安装引擎');
        }).catch((error) => {
          this.isEnterAuthenticationBtnLoading = false;
          me.showErrorInfo(error);
        });

        return false;
      },
      showErrorInfo(message) {
        this.$message.error(message || '');
      }
    }
  };
</script>
