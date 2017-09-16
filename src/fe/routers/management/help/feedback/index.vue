<template>
  <div>ss</div>
</template>
<script>
  import './index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import utils from '../../../../common/utils';

  const api = require('../../../../api/transcode');

  export default {
    components: {
      'layout-four-row': fourRowLayout
    },
    data() {
      return {
        isDisabled: true,
        stopDisable: true,
        restartDisable: true,

        formData: {
          keyword: '',
          status: '',
          currentStep: ''
        },
        table: {
          currentRowInfo: {}
        },
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,

        /* child task */
        childTaskDialogVisible: false,

        runTimer: false
      };
    },
    created() {
      this.listTask();
      this.runTimer = true;
      this.autoRefreshList();
    },
    destroyed() {
      this.runTimer = false;
    },
    methods: {
      handleClickSearch() {
        this.listTask();
      },
      stopClick() {
        this.stop();
      },
      restartClick() {
        this.restart();
      },
      childTaskClick() {
        this.childTaskDialogVisible = true;
      },
      refreshClick() {
        this.listTask();
        this.isDisabled = true;
        this.table.currentRowInfo = {};
        this.childTaskDialogVisible = false;
      },
      /* table */
      handleCurrentChange(current) {
      },
      getStatus(v) {
      },
      formatType(v) {
        return v;
      },
      formatPermission(v) {
        return v;
      },
      pageChange(val) {
        this.page = val;
        this.listTask();
      },
      autoRefreshList() {
        const me = this;
        if (!me.runTimer) {
          return false;
        }
        setTimeout(() => {
          me.listTask(true, () => {
            me.autoRefreshList();
          });
        }, 3000);

        return false;
      },
      /* api */
      listTask(notNeedProcess, completeFn) {
        const me = this;

        const param = {
          page: this.page,
          pageSize: this.pageSize
        };

        if (this.formData.status) {
          param.status = this.formData.status;
        }

        if (this.formData.currentStep) {
          param.currentStep = this.formData.currentStep;
        }

        api.list({ params: param }, notNeedProcess ? '' : me).then((res) => {
          me.tableData = res.data.docs;
          me.page = res.data.page;
          me.total = res.data.total;
          completeFn && completeFn();
        }).catch((error) => {
          if (!notNeedProcess) {
            me.$message.error(error);
          }
          completeFn && completeFn();
        });
      },
      stop() {
        const me = this;

        const param = {
          parentId: this.table.currentRowInfo.id
        };

        api.stop({ params: param }).then((res) => {
          me.$message.success('任务已成功停止');
          me.listTask();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },

      restart() {
        const me = this;

        const param = {
          parentId: this.table.currentRowInfo.id
        };

        api.restart({ params: param }).then((res) => {
          me.$message.success('任务已成功重启');
          me.listTask();
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      }
    }
  };
</script>
