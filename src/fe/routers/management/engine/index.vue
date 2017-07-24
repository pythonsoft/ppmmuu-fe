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
            :data="item"
            :node-key="id"
            @node-click="treeNodeClick"
            @current-change="treeNodeCurrentChange"
            @node-expand="treeNodeExpand"
            @node-collapse="treeNodeCollapse">
          </fj-tree>
        </template>
      </layout-two-row-tree>
    </template>
    <template slot="right">right</template>
  </layout-two-column>
</template>
<script>
  import layoutTwoColumn from '../../../component/layout/twoColumn/index';
  import layoutTwoRowTree from '../../../component/layout/twoRowTree/index';

  const api = require('../../../api/engine');

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
      this.treeNodeClick();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      clickAddGroup() {},
      treeNodeClick(node) {
        console.log('click -->', node);
        const me = this;
        const param = {
          parentId: '',
          page: 1,
          pageSize: 200,
          fields: ''
        };

        api.listGroup(param).then((res) => {
          me.treeData = res.data || [];
        }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      treeNodeCurrentChange(node) {},
      treeNodeExpand(node) {},
      treeNodeCollapse(node) {}
    }
  };
</script>
