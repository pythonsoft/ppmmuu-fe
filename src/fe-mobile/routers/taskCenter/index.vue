<template>
  <div class="page-wrap">
    <div class="return-bar">
      <i class="iconfont icon-arrow-left icon-return" @click="linkToPersonalCenter"></i>
      <h3 class="category-title has-return-btn">任务</h3>
    </div>
    <fj-navbar v-model="navIndex">
      <fj-tab-item v-for="item in MENU_CONFIG" :key="item.index" :id="item.index">{{ item.text }}</fj-tab-item>
    </fj-navbar>
    <ul v-if="navIndex === 'task_download_audit'">
      <li v-for="item in tableData" :key="item.id" class="task-item">
        <div class="task-item-left-content">
          <p class="task-item-name">{{ item.name }}</p>
          <span class="task-item-info"><i class="iconfont icon-email"></i>{{item.applicant ? item.applicant.companyName + '-' + item.applicant.name : ''}}</span>
          <span class="task-item-info"><i class="iconfont icon-clock"></i>{{ item.createTime | formatTime }}</span>
        </div>
      </li>
      <li
        class="search-history-button"
        v-show="total > currentPage * pageSize"
        @click="currentPage += 1">
        {{ loadListBtnText }}
      </li>
    </ul>
    <ul v-else>
      <li v-for="item in tableData" :key="item.id" class="task-item">
        <div class="task-item-left-content">
          <p class="task-item-name">{{ item.name }}</p>
          <span class="task-item-info">{{ item.createTime | formatTime }}</span>
          <span :class="getStatus(item.status).css">{{ getStatus(item.status).text }}</span>
        </div>
        <div class="task-item-right">
          <fj-progress
            :percentage="parseInt(formatTaskList(item.currentStep, item.tasklist).total)"
            :status="item.status"
            @click.native="isTaskCanStop(item.status) ? stop(item): restart(item)"></fj-progress>
          {{ formatTaskList(item.currentStep, item.tasklist).total }}
        </div>
      </li>
      <li
        class="search-history-button"
        v-show="total > currentPage * pageSize"
        @click="currentPage += 1">
        {{ loadListBtnText }}
      </li>
    </ul>
  </div>
</template>
<script>
  import FjProgress from './progress';
  import utils from '../../../fe/common/utils';
  const userAPI = require('../../../fe/api/user');
  const common = require('../../../fe/routers/management/task/common');
  const config = require('../../../fe/routers/management/task/config');
  const MENU_CONFIG = [
    { text: '全部', index: 'task_download_all', route: 'task_download_all' },
    { text: '待审核', index: 'task_download_audit', route: 'task_download_audit' },
    { text: '已完成', index: 'task_download_complete', route: 'task_download_complete' },
    { text: '错误', index: 'task_download_error', route: 'task_download_error' }
  ];
  export default {
    data() {
      return {
        loadListBtnText: '加载更多',
        navIndex: 'task_download_all',
        MENU_CONFIG: MENU_CONFIG,
        currentPage: 1,
        pageSize: 24,
        status: config.getConfig('DOWNLOAD_STATUS'),
        formData: {
          keyword: '',
          status: '',
          currentStep: ''
        },
        tableData: [],
        runTimer: false,
        total: 0
      };
    },
    created() {
      if (this.$route.params.type) {
        this.navIndex = this.$route.params.type;
      }
      this.updateStatus();
      if (this.navIndex === 'task_download_all') {
        this.runTimer = true;
        this.autoRefreshList();
      }
    },
    destroyed() {
      this.runTimer = false;
    },
    watch: {
      navIndex(val) {
        if (val !== 'task_download_all') {
          this.runTimer = false;
        } else {
          this.runTimer = true;
          this.autoRefreshList();
        }
        this.updateStatus();
        this.$router.push({ name: 'taskCenter', params: { type: val } });
      },
      currentPage(val) {
        if (this.navIndex.indexOf('task_download_audit') > -1) {
          this.listAuditTask();
        } else {
          this.loadListBtnText = '加载中...';
          this.listTask();
        }
      }
    },
    methods: {
      formatTaskList: utils.formatTaskList,
      isTaskCanStop: common.isTaskCanStop,
      linkToPersonalCenter() {
        this.$router.push({ name: 'personalCenter' });
      },
      getStatus(v) {
        return config.getConfig('DOWNLOAD_STATUS', v);
      },
      autoRefreshList() {
        if (!this.runTimer) {
          return false;
        }
        setTimeout(() => {
          this.listTask(true, () => {
            this.autoRefreshList();
          });
        }, 5000);
        return false;
      },
      updateStatus() {
        const keys = Object.keys(this.status);
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (this.navIndex.indexOf(key.toLowerCase()) > -1) {
            this.formData.status = this.status[key].value;
            this.currentPage = 1;
            this.tableData = [];
            this.listTask();
            break;
          }
        }
        if (this.navIndex.indexOf('task_download_audit') > -1) {
          this.tableData = [];
          this.currentPage = 1;
          this.listAuditTask();
        }
      },
      listAuditTask() {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        const param = {
          page: this.currentPage,
          pageSize: this.pageSize,
          status: 1
        };
        userAPI.listMyAuditJob({ params: param }, this)
          .then((res) => {
            this.loadListBtnText = '加载更多';
            const data = res.data;
            this.tableData = data ? this.tableData.concat(data.docs) : [];
            this.total = data.total;
          })
          .catch((error) => {
            this.loadListBtnText = '加载更多';
            this.$toast.error(error);
          });
      },
      listTask(notNeedProcess = false, completeFn) {
        const param = {
          page: 1,
          pageSize: this.pageSize * this.currentPage,
          processType: 'download',
        };

        if (this.formData.status) {
          param.status = this.formData.status;
        }

        if (this.formData.currentStep) {
          param.currentStep = this.formData.currentStep;
        }
        if (this.navIndex.indexOf('task_download_audit') < 0) {
          userAPI.listJob({ params: param }, notNeedProcess ? null : this).then((res) => {
            this.loadListBtnText = '加载更多';
            this.tableData = res.data.docs;
            this.total = res.data.total;
            completeFn && completeFn();
          }).catch((error) => {
            this.loadListBtnText = '加载更多';
            completeFn && completeFn();
          });
        } else {
          completeFn && completeFn();
        }
      },
      stop(item) {
        const param = {
          jobId: item.id
        };
        userAPI.stopJob({ params: param }).then((res) => {
          this.$toast.success('任务已成功停止');
          this.listTask();
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      restart(item) {
        if (item.status === 'complete') return;
        const param = {
          jobId: item.id
        };

        userAPI.restartJob({ params: param }).then((res) => {
          this.$toast.success('任务已成功重启');
          this.listTask();
        }).catch((error) => {
          this.$toast.error(error);
        });
      }
    },
    components: {
      FjProgress
    }
  };
</script>
<style>
  .page-wrap {
    position: relative;
    padding-top: 45px;
    padding-bottom: 55px;
    background: #F8FAFB;
  }
  .return-bar {
    display: flex;
    position: relative;
    height: 49px;
    line-height: 49px;
    padding: 0 15px;
    background-color: #fff;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .return-bar .icon-return {
    position: absolute;
    top: 0;
    left: 15px;
    padding: 0 5px;
    font-size: 18px;
    color: #767676;
  }
  .category-title {
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    color: #333333;
  }
  .category-title.has-return-btn {
    text-align: center;
  }
  .task-item {
    position: relative;
    display: flex;
    padding: 15px;
    margin-bottom: 4px;
    background: #fff;
    align-items: center;
  }
  .task-item:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .task-item:after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .task-item-left-content {
    flex: 1;
  }
  .task-item-name {
    margin-bottom: 4px;
    font-size: 14px;
    word-break: break-all;
    color: #333333;
  }
  .task-item-info {
    display: block;
    margin-bottom: 4px;
    font-size: 13px;
    color: #767676;
  }
  .task-item-info .iconfont {
    font-size: 13px;
    padding-right: 8px;
  }
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
  .task-item-right {
    padding-left: 7.5px;
    margin: 0 9px;
    width: 60px;
    font-size: 12px;
    color: #767676;
    text-align: center;
  }
</style>
