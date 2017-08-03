<template>
  <layout-four-row
    :isIncludeArrow="true"
    @back="back"
  >
    <template slot="search-left">
      {{title}}
    </template>
    <template slot="search-right">
      <div class="layout-engine-four-row-search-item">
        <fj-input :rows="1" placeholder="请输入名称、IP或Id" v-model="formData.keyword"></fj-input>
      </div>
      <div class="layout-engine-four-row-search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <span class="layout-engine-btn-mini-margin">
        <fj-button type="info" size="mini" @click="showProperty" v-bind:disabled="isDisabled">属性</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="pid" width="90" align="center" label="进程号"></fj-table-column>
        <fj-table-column prop="status" width="90" align="center" label="运行状态" >
          <template scope="props">{{ getRunStatus(props.row.status) }}</template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="cpu" label="CPU使用"></fj-table-column>
        <fj-table-column prop="memory" label="内存使用"></fj-table-column>
        <fj-table-column prop="disk" label="磁盘使用"></fj-table-column>
        <fj-table-column prop="net" label="网络使用"></fj-table-column>
        <fj-table-column prop="runTime" label="已运行时间"></fj-table-column>
      </fj-table>
    </template>
  </layout-four-row>
</template>
<script>
  import './index.css';

  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';

  const api = require('../../../api/engine');

  export default {
    name: 'serviceList',
    components: {
      'layout-four-row': fourRowLayout
    },
    props: {
      vueInstance: { type: Object },
      selectedNodeInfo: { type: Object },
      engineInfo: { type: Object },
      title: { type: String, default: '服务监控' },
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible(v) {

      }
    },
    data() {
      return {
        isDisabled: true,
        formData: {
          keyword: ''
        },
        tableData: [],
        currentProcessInfo: null
      };
    },
    created() {
      this.listProcess();
    },
    destroyed() {},
    methods: {
      handleClickSearch() {},
      showProperty() {
        this.$emit('display-process-slide-dialog', true);
      },
      back() {
        this.$emit('cancel');
      },
      /* table */
      handleCurrentChange(current) {
        this.currentProcessInfo = current;
        this.isDisabled = false;
        this.$emit('select', this.currentProcessInfo);
      },
      getRunStatus(v) {
        return v;
      },
      /* api */
      listProcess(completeFn) {
        const me = this;

        const param = {
          ip: me.engineInfo.intranetIp
        };

        api.listProcess({ params: param }).then((res) => {
          me.tableData = res.data;
          completeFn && completeFn();
        }).catch((error) => {
          me.$message.error(error);
          completeFn && completeFn();
        });
      }
    }
  };
</script>
