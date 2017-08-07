<template>
  <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
    <fj-table-column prop="status" width="50" align="center" label="状态">
      <template scope="props">
        <span :class="getStatus(props.row.status).css">{{ getStatus(props.row.status).text }}</span>
      </template>
    </fj-table-column>
    <fj-table-column prop="mergerdFilePath" width="310" label="合成文件路径">
      <template scope="props">
        <div class="task-merge-wrap">{{ props.row.mergerdFilePath }}</div>
      </template>
    </fj-table-column>
    <fj-table-column prop="processRate" label="进度" align="center"></fj-table-column>
    <fj-table-column prop="createTime" width="140" align="center" label="创建时间">
      <template scope="props">{{ props.row.createTime | formatTime }}</template>
    </fj-table-column>
  </fj-table>
</template>
<style>
  .task-merge-wrap{
    width: 300px;
    word-wrap: break-word;
    word-break: normal;
  }
</style>
<script>
  const config = require('./config');

  export default {
    name: 'taskTranscodeMergeFileView',
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
