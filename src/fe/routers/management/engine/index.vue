<template>
  <layout-two-column>
    <template slot="left">
      <tree-view :vueInstance="vueInstance"></tree-view>
    </template>
    <template slot="right">
      <engine-list-view v-if="viewRouter === 'engineListView'" :vueInstance="vueInstance"></engine-list-view>
    </template>
    <engine-dialog-view :vueInstance="vueInstance"></engine-dialog-view>
    <engine-base-slide-dialog-view :vueInstance="vueInstance"></engine-base-slide-dialog-view>
  </layout-two-column>
</template>
<style>
</style>
<script>
  import Vue from 'vue';

  import layoutTwoColumn from '../../../component/layout/twoColumn/index';
  import treeView from './tree';
  import dialogView from './dialog';
  import engineListView from './engineList';
  import engineBaseSlideDialogView from './engineBaseSlideDialog';

  export default {
    components: {
      'layout-two-column': layoutTwoColumn,
      'tree-view': treeView,
      'engine-dialog-view': dialogView,
      'engine-list-view': engineListView,
      'engine-base-slide-dialog-view': engineBaseSlideDialogView
    },
    data() {
      return {
        vueInstance: null,
        viewRouter: ''
      };
    },
    created() {
      const me = this;
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.vueInstance = new Vue();

      this.vueInstance.$on('engine.setViewRouter', (router) => {
        me.viewRouter = router;
      });
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      }
    }
  };
</script>
