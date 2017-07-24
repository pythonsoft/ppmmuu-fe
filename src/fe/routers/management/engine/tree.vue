<template>
  <layout-two-row-tree>
    <template slot="title">引擎分组</template>
    <template slot="button">
      <fj-button size="mini" @click="clickAddGroup">添加组</fj-button>
    </template>
    <div class="empty-line" v-if="data.length === 0">无分组数据</div>
    <template v-else slot="tree" v-for="(item, index) in data">
      <fj-tree
        :data="item"
        node-key="id"
        @node-click="treeNodeClick"
        @current-change="treeNodeCurrentChange"
        @node-expand="treeNodeExpand"
        @node-collapse="treeNodeCollapse">
      </fj-tree>
    </template>
  </layout-two-row-tree>
</template>
<script>
  import './index.css';

  import layoutTwoRowTree from '../../../component/layout/twoRowTree/index';

  const api = require('../../../api/engine');

  export default {
    name: 'treeView',
    components: {
      'layout-two-row-tree': layoutTwoRowTree
    },
    data() {
      return {
        id: '',
        data: [],
        items: {},
        selectedNodeInfo: {},
        myBus: this.vueInstance,
      }
    },
    props: ['vueInstance'],
    created() {
      this.treeNodeClick();
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      treeNodeClick(node) {
        const me = this;
        const param = {
          parentId: '',
          page: 1,
          pageSize: 200,
          fields: ''
        };
        api.listGroup(param).then((res) => {
          me.data = res.data.docs || [];
        }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      treeNodeCurrentChange(node) {},
      treeNodeExpand(node) {},
      treeNodeCollapse(node) {},

      clickAddGroup() {
        this.myBus.$emit('engine.addGroup');
      },
    },
  }
</script>
