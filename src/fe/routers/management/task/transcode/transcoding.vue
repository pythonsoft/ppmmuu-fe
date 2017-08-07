<template>
  <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
    <fj-table-column prop="status" width="50" align="center" label="状态">
      <template scope="props">
        <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
      </template>
    </fj-table-column>
    <fj-table-column prop="serialNO" width="220" label="serialNO"></fj-table-column>
    <fj-table-column prop="totalTime" label="时长"></fj-table-column>
    <fj-table-column prop="processRate" label="进度" align="center"></fj-table-column>
    <fj-table-column prop="createTime" width="140" align="center" label="创建时间">
      <template scope="props">{{ props.row.createTime | formatTime }}</template>
    </fj-table-column>
  </fj-table>
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
    name: 'taskTranscodeView',
    props: {
      tableData: { type: Array, default: [] }
    },
    data() {
      return {

      };
    },
    created() {},
    methods: {
      handleCurrentChange() {},
      getStatus(v) {
        return config.getConfig('STATUS', v);
      },
    },
  }
</script>
