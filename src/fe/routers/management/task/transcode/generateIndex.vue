<template>
  <div class="task-slide-dialog-item">
    <div class="task-slide-dialog-item-title">
      {{ title }}
      <div class="task-slide-dialog-item-bar">
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" v-bind:disabled="stopDisable" @click="stopClick">停止</fj-button>
        </span>
        <span class="layout-btn-mini-margin">
          <fj-button type="info" size="mini" v-bind:disabled="restartDisable" @click="restartClick">重启</fj-button>
        </span>
      </div>
    </div>

    <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
      <fj-table-column prop="status" width="50" align="center" label="状态">
        <template scope="props">
          <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
        </template>
      </fj-table-column>
      <fj-table-column prop="filePath" width="220" label="文件路径">
        <template scope="props">
          <div class="task-wrap">{{ props.row.filePath }}</div>
        </template>
      </fj-table-column>
      <fj-table-column prop="totalTime" label="时长"></fj-table-column>
      <fj-table-column prop="processRate" label="进度" align="center"></fj-table-column>
      <fj-table-column prop="createTime" width="140" align="center" label="创建时间">
        <template scope="props">{{ props.row.createTime | formatTime }}</template>
      </fj-table-column>
    </fj-table>
  </div>
</template>
<style>
  .task-wrap{
    width: 210px;
    word-wrap: break-word;
    word-break: normal;
  }
</style>
<script>
  const config = require('./config');

  export default {
    name: 'taskTranscodeGenerateIndexView',
    props: {
      title: { type: String, default: '' },
      tableData: { type: Array, default: [] }
    },
    data() {
      return {
        stopDisable: true,
        restartDisable: true,

      };
    },
    created() {},
    methods: {
      handleCurrentChange() {},
      getStatus(v) {
        return config.getConfig('STATUS', v);
      },
      getCurrentStepConfig(v) {
        return config.getConfig('CURRENT_STEP', v);
      },
      stopClick() {},
      restartClick() {},
    },
  }
</script>
