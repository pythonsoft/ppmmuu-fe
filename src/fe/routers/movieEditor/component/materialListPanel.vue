<template>
  <div class="material-list-wrap">
    <fj-tabs v-model="activeTabName" @tab-click="handleTabClick" theme="dark">
      <fj-tab-pane label="我的资源" name="source">
        <fj-tree
          :data="sourceTree"></fj-tree>
      </fj-tab-pane>
      <fj-tab-pane label="项目资源" name="project">项目资源</fj-tab-pane>
    </fj-tabs>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        activeTabName: 'source',
        sourceTree: []
      };
    },
    methods: {
      handleTabClick() {}
    },
    created() {

    }
  };
</script>
<style>
  .material-list-wrap {
    padding-left: 20px;
    padding-top: 10px;
  }
</style>
