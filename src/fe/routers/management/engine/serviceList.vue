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
        <fj-button type="info" size="mini" @click="showProperty">属性</fj-button>
      </span>
    </template>
    <template slot="table">
      <!--<fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>-->
        <!--<fj-table-column prop="isInstallMonitor" width="90" align="center" label="是否安装">-->
          <!--<template scope="props">{{ getTextByValue(props.row.isInstallMonitor, 'isInstallMonitor') }}</template>-->
        <!--</fj-table-column>-->
        <!--<fj-table-column prop="status" width="90" align="center" label="运行状态" >-->
          <!--<template scope="props">{{ getRunStatus(props.row.command, props.row.modifyTime) }}</template>-->
        <!--</fj-table-column>-->
        <!--<fj-table-column prop="code" width="100" label="编号"></fj-table-column>-->
        <!--<fj-table-column prop="name" label="名称"></fj-table-column>-->
        <!--<fj-table-column prop="intranetIp" width="140" align="center" label="内网IP"></fj-table-column>-->
        <!--<fj-table-column prop="isTest" width="90" align="center" label="测试机">-->
          <!--<template scope="props">{{ getTextByValue(props.row.isTest, 'isTest') }}</template>-->
        <!--</fj-table-column>-->
        <!--<fj-table-column prop="isVirtual" width="90" align="center" label="虚拟机">-->
          <!--<template scope="props">{{ getTextByValue(props.row.isVirtual, 'isVirtual') }}</template>-->
        <!--</fj-table-column>-->
        <!--<fj-table-column prop="modifyTime" width="160" align="center" label="上次活跃">-->
          <!--<template scope="props">{{ props.row.modifyTime | formatTime }}</template>-->
        <!--</fj-table-column>-->
      <!--</fj-table>-->
    </template>
    <template slot="pagination">
      <!--<fj-pagination-->
        <!--:page-size="pageSize"-->
        <!--:total="total"-->
        <!--:current-page.sync="page"-->
        <!--@current-change="pageChange">-->
      <!--</fj-pagination>-->
    </template>
  </layout-four-row>
</template>
<script>
  import './index.css';

  import fourRowLayout from '../../../component/layout/fourRowLayoutRightContent/index';

  export default {
    name: 'serviceList',
    components: {
      'layout-four-row': fourRowLayout
    },
    props: {
      vueInstance: { type: Object },
      selectedNodeInfo: { type: Object },
      title: { type: String, default: '服务监控' },
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible(v) {

      }
    },
    data() {
      return {
        formData: {
          keyword: ''
        }
      };
    },
    methods: {
      handleClickSearch() {},
      showProperty() {},
      back() {
        this.$emit('cancel');
      }
    }
  };
</script>
