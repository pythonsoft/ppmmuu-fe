<template>
  <layout-two-column>
    <template slot="left">
      <layout-two-row-tree>
        <template slot="title">引擎分组</template>
        <template slot="button">
          <fj-button size="mini" @click="clickAddGroup">添加组</fj-button>
        </template>
        <template slot="tree">
          <fj-tree
            :data="treeData"
            :node-key="id"
            @node-click="handleTreeNodeClick"
            @current-change="handleTreeNodeCurrentChange"
            @node-expand="handleTreeNodeExpand"
            @node-collapse="handleTreeNodeCollapse">
          </fj-tree>
        </template>
      </layout-two-row-tree>
    </template>
    <template slot="right">right</template>
  </layout-two-column>
</template>
<script>
  import layoutTwoColumn from '../../../component/layout/twoColumn/index.vue';
  import layoutTwoRowTree from '../../../component/layout/twoRowTree/index.vue';

  export default {
    components: {
      'layout-two-column': layoutTwoColumn,
      'layout-two-row-tree': layoutTwoRowTree
    },
    data() {
      const data = {
        id: '',
        treeData: [],
        items: {}
      };

      return data;
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      clickAddGroup() {},
      handleTreeNodeClick() {
        const me = this;
        const param = {
          parentId: '',
          page: 1,
          pageSize: 200,
          fields: ''
        };
      },
      handleTreeNodeCurrentChange() {},
      handleTreeNodeExpand() {},
      handleTreeNodeCollapse() {}
    }
  };
</script>
