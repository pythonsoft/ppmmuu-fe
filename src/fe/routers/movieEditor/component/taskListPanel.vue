<template>
  <div>
    <div class="task-list-controller-wrap">
      <div class="player-control-item-wrap select-wrap">
        <fj-select size="small" v-model="taskListType" theme="drak">
          <fj-option
            v-for="item in TASK_LIST_TYPE"
            :key="`task-list-type-${item.value}`"
            :label="item.label"
            :value="item.value"></fj-option>
        </fj-select>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="">
          <i class="iconfont icon-play"></i>
        </div>
        <div class="player-control-tooltip">开始</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="">
          <i class="iconfont icon-pause"></i>
        </div>
        <div class="player-control-tooltip">暂停</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="">
          <i class="iconfont icon-delete"></i>
        </div>
        <div class="player-control-tooltip">删除</div>
      </div>
    </div>
    <div class="task-list">
      <fj-table :data="taskList" @selection-change="" theme="dark">
        <fj-table-column type="selection" width="50" align="center"></fj-table-column>
        <fj-table-column prop="" label="状态"></fj-table-column>
        <fj-table-column prop="" label="名称"></fj-table-column>
        <fj-table-column prop="" label="总时长"></fj-table-column>
        <fj-table-column prop="" label="进度"></fj-table-column>
        <fj-table-column prop="" label="速度"></fj-table-column>
        <fj-table-column prop="" label="已传输量 | 文件大小"></fj-table-column>
      </fj-table>
    </div>
  </div>
</template>
<script>
  const TASK_LIST_TYPE = [
    { value: 'all', label: '全部' },
    { value: 0, label: '正在下载' },
    { value: 1, label: '暂停' },
    { value: 2, label: '已完成' }
  ];
  export default {
    data() {
      return {
        taskListType: 'all',
        taskList: []
      };
    },
    methods: {
    },
    created() {
      this.TASK_LIST_TYPE = TASK_LIST_TYPE;
    }
  };
</script>
