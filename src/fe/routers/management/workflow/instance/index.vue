<template>
  <four-row-layout-right-content>
    <template slot="search-left">实例管理</template>
    <template slot="search-right">
      <div :class="$style.searchItem" :style="{ width: '100px' }">
        <fj-select placeholder="请选择" v-model="status" size="small">
          <fj-option
            v-for="item in STATUS"
            :key="item.value"
            :label="item.text"
            :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div :class="$style.searchItem">
        <fj-input size="small" placeholder="请输入关键字" v-model="keyword"></fj-input>
      </div>
      <div :class="$style.searchItem">
        <fj-button size="small" type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div :class="$style.group">
        <fj-button type="primary" size="mini" @click="refresh">刷新</fj-button>
        <fj-button type="primary" size="mini" :disabled="!currentSelectRow" @click="isShowDetailDialog=true">详情</fj-button>
        <fj-button type="primary" size="mini" :disabled="!currentSelectRow" @click="isShowLogDialog=true">执行日志</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @current-change="handleCurrentChange">
        <fj-table-column prop="status" width="90" label="状态">
          <template slot-scope="props">
            <span :class="STATUS[props.row.status].css">{{ STATUS[props.row.status].text }}</span>
          </template>
        </fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="priority" label="优先级"></fj-table-column>
        <fj-table-column prop="engineName" label="定义名"></fj-table-column>
        <fj-table-column prop="createTime" width="160" label="创建时间">
          <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="activedTime" width="160" label="活跃时间">
          <template slot-scope="props">{{ props.row.activedTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="completedTime" width="160" label="完成时间">
          <template slot-scope="props">{{ props.row.completedTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <detail-dialog :visible.sync="isShowDetailDialog" :id="currentSelectRow && currentSelectRow.id"></detail-dialog>
    <log-dialog :visible.sync="isShowLogDialog" :id="currentSelectRow && currentSelectRow.workflowId"></log-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent';
  import DetailDialog from './component/detail';
  import LogDialog from './component/logDialog';
  import { formatQuery } from '../../../../common/utils';
  const api = require('../../../../api/wokflow');
  const STATUS = {
    ALL: { text: '全部', value: 'ALL', key: 'ALL' },
    PENDING: { text: '等待中', value: 'PENDING', key: 'PENDING', css: 'task-status-base task-status-created' },
    INITIALIZE: { text: '已创建', value: 'INITIALIZE', key: 'INITIALIZE', css: 'task-status-base task-status-created' },
    RUNNING: { text: '处理中', value: 'RUNNING', key: 'RUNNING', css: 'task-status-base task-status-dealing' },
    STOPPING: { text: '停止中', value: 'STOPPING', key: 'STOPPING', css: 'task-status-base task-status-dealing' },
    STOPPED: { text: '已停止', value: 'STOPPED', key: 'STOPPED', css: 'task-status-base task-status-dealing' },
    ERROR: { text: '错误', value: 'ERROR', key: 'ERROR', css: 'task-status-base task-status-error' },
    COMPLETED: { text: '已完成', value: 'COMPLETED', key: 'COMPLETED', css: 'task-status-base task-status-complete' }
  };
  export default {
    components: {
      FourRowLayoutRightContent,
      DetailDialog,
      LogDialog
    },
    data() {
      return {
        total: 0,
        currentPage: 1,
        pageSize: 25,
        currentSelectRow: null,
        tableData: [],
        keyword: '',
        status: 'ALL',
        isShowDetailDialog: false,
        isShowLogDialog: false,
        STATUS: STATUS
      };
    },
    created() {
      this.list();
    },
    methods: {
      refresh() {
        this.list();
      },
      list() {
        const postData = {
          page: this.currentPage,
          pageSize: this.pageSize
        };

        api.workflow_instance_list(formatQuery(postData, true), this).then((res) => {
          const data = res.data;
          this.tableData = data ? data : [];
          // this.currentPage = data.page;
          // this.total = data.total;
          this.currentSelectRow = null;
        }).catch((err) => {
          this.$message.error(err);
        });
      },
      handleCurrentChange(val) {
        this.currentSelectRow = val;
      },
      handleCurrentPageChange() {},
      handleClickSearch() {}
    }
  };
</script>
<style module>
  .group {
    display: inline-block;
    margin-right: 18px;
  }
  .group button {
    margin-right: 6px;
  }
  .searchItem {
    float: left;
    margin-left: 10px;
    line-height: 100%;
  }
</style>
<style>
.task-status-base {
  font-size: 12px;
  color: #fff;
  width: 48px;
  height: 20px;
  line-height: 20px;
  border-radius: 2px;
  text-align: center;
  display: block;
}
.task-status-created {
  background: #38B1EB;
}
.task-status-dealing {
  background: #C0C003;
}
.task-status-error {
  background: #FF3366;
}
.task-status-complete {
  background: #2EC4B6;
}

</style>
