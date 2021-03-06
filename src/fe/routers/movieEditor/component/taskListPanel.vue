<template>
  <div>
    <div class="task-list-controller-wrap">
      <div class="player-control-item-wrap select-wrap">
        <fj-select size="small" v-model="taskListType" :theme="theme">
          <fj-option
            v-for="item in status"
            :key="item.value"
            :label="item.text"
            :value="item.value"></fj-option>
        </fj-select>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="restart" :class="{'disabled-control-item': !currentRow.id}">
          <i class="iconfont icon-play"></i>
        </div>
        <div class="player-control-tooltip">开始</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="stop" :class="{'disabled-control-item': !currentRow.id}">
          <i class="iconfont icon-pause"></i>
        </div>
        <div class="player-control-tooltip">暂停</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="showDeleteDialog" :class="{'disabled-control-item': !currentRow.id}">
          <i class="iconfont icon-delete"></i>
        </div>
        <div class="player-control-tooltip">删除</div>
      </div>
    </div>
    <div class="task-list">
      <div :style="taskListStyle">
        <fj-table :data="taskList" @current-change="handleCurrentChange" highlightKey="id" :theme="theme" style="width:99%">
          <fj-table-column prop="status" width="90" label="状态">
            <template slot-scope="props">
              <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
            </template>
          </fj-table-column>
          <fj-table-column prop="name" label="名称" width="100"></fj-table-column>
          <fj-table-column prop="current" width="100" label="当前步骤">
          </fj-table-column>
          <fj-table-column prop="next" width="100" label="下个步骤">
          </fj-table-column>
          <fj-table-column prop="createdTime" width="160" label="创建时间">
            <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
          </fj-table-column>
        </fj-table>
      </div>
      <div class="task-list-pagination">
        <fj-pagination
          :theme="theme"
          :page-size="pageSize"
          :total="total"
          :current-page.sync="page"
          @current-change="listTask">
        </fj-pagination>
      </div>
    </div>
    <fj-dialog
      title="提示"
      :visible.sync="dialogVisible"
      @close="dialogVisible=false"
    >
      <span>确定要删除此任务 {{ currentRow.fileName }} 吗?</span>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="dialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" @click="deleteJob">确定</fj-button>
      </div>
    </fj-dialog>
  </div>
</template>
<script>
  import config from '../../management/task/config';
  import jobAPI from '../../../api/user';

  export default {
    props: {
      visible: Boolean,
      size: {
        type: Object,
        default() {
          return { width: 0, height: 0 };
        }
      },
      theme: {
        type: String,
        default: 'stroke'
      }
    },
    data() {
      return {
        taskListType: '',
        status: config.getConfig('DOWNLOAD_STATUS'),
        taskList: [],
        currentRow: {},
        dialogVisible: false,
        timer: null,
        pageSize: 20,
        total: 0,
        page: 1
      };
    },
    computed: {
      taskListStyle() {
        return { height: `${this.size.height - 90}px`, overflow: 'auto' };
      }
    },
    methods: {
      showDeleteDialog() {
        this.dialogVisible = true;
      },
      deleteJob() {
        const param = {
          jobId: this.currentRow.id
        };
        jobAPI.deleteJob({ params: param }).then((res) => {
          this.$message.success('任务已成功删除');
          this.dialogVisible = true;
          this.listTask();
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      stop() {
        const param = {
          jobId: this.currentRow.id
        };
        jobAPI.stopJob({ params: param }).then((res) => {
          this.$message.success('任务已成功停止');
          this.listTask();
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      restart() {
        const param = {
          jobId: this.currentRow.id
        };

        jobAPI.restartJob({ params: param }).then((res) => {
          this.$message.success('任务已成功重启');
          this.listTask();
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      handleCurrentChange(val) {
        this.currentRow = val;
      },
      getStatus(v) {
        return config.getConfig('DOWNLOAD_STATUS', v);
      },
      listTask() {
        const param = {
          page: this.page,
          pageSize: this.pageSize
        };
        if (this.taskListType) {
          param.status = this.taskListType;
        }
        jobAPI.listJob({ params: param }).then((res) => {
          this.taskList = res.data.docs;
          this.page = res.data.page;
          this.total = res.data.total;
        }).catch((error) => {
          this.$message.error(error);
        });
      }
    },
    created() {
      // this.listTask();
    },
    beforeDestroy() {
      if (this.timer) {
        clearInterval(this.timer);
      }
    },
    watch: {
      taskListType(val) {
        this.listTask();
      },
      visible(val) {
        if (val) {
          this.listTask();
          this.timer = setInterval(this.listTask, 5000);
        } else {
          if (this.timer) clearInterval(this.timer);
          this.timer = null;
        }
      }
    }
  };
</script>
