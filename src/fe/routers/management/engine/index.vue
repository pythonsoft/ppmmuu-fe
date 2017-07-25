<template>
  <layout-two-column>
    <template slot="left">
      <tree-view :vueInstance="vueInstance"></tree-view>
    </template>
    <template slot="right">right</template>
    <engine-dialog-view :vueInstance="vueInstance"></engine-dialog-view>
  </layout-two-column>
</template>
<style>
</style>
<script>
  import Vue from 'vue';

  import layoutTwoColumn from '../../../component/layout/twoColumn/index';
  import treeView from './tree';
  import dialogView from './dialog';

  export default {
    components: {
      'layout-two-column': layoutTwoColumn,
      'tree-view': treeView,
      'engine-dialog-view': dialogView,
    },
    data() {
      return {
        vueInstance: null,
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.vueInstance = new Vue();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      }
    }
  };
</script>
