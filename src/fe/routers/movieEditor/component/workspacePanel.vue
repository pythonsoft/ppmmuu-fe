<template>
  <div
    :class="['workspace-panel-wrap', {'active-panel': activePanel === 'workspacePanel'}]"
    @click="()=>{this.$emit('update:activePanel', 'workspacePanel')}">
    <fj-tabs
      v-model="activeTabName"
      custom-class="workspace-wrap"
      custom-header-class="workspace-header">
      <fj-tab-pane label="我的素材" name="timeline">
        <timeline-panel :importSourceInfo="importSourceInfo" :size="size" :projectBus="projectBus" :theme="theme"></timeline-panel>
      </fj-tab-pane>
      <fj-tab-pane label="任务列表" name="taskList">
        <task-list-panel :size="size" :visible="activeTabName==='taskList'" :theme="theme"></task-list-panel>
      </fj-tab-pane>
    </fj-tabs>
  </div>
</template>
<script>
  import TimelinePanel from './timelinePanel';
  import TaskListPanel from './taskListPanel';

  export default {
    props: {
      projectBus: {},
      size: {
        type: Object,
        default() {
          return { width: 0, height: 0 };
        }
      },
      importSourceInfo: {},
      activePanel: String,
      theme: String
    },
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
