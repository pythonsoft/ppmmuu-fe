<template>
  <fj-tabs
    v-model="activeTabName"
    theme="dark"
    custom-class="workspace-wrap"
    custom-header-class="workspace-header">
    <fj-tab-pane label="我的素材" name="timeline">
      <timeline-panel></timeline-panel>
    </fj-tab-pane>
    <fj-tab-pane label="任务列表" name="taskList">
      <task-list-panel></task-list-panel>
    </fj-tab-pane>
  </fj-tabs>
</template>
<script>
  import TimelinePanel from './timelinePanel';
  import TaskListPanel from './taskListPanel';

  export default {
    data() {
      return {
        activeTabName: 'timeline'
      };
    },
    methods: {
    },
    created() {
    },
    components: {
      TimelinePanel,
      TaskListPanel
    }
  };
</script>
