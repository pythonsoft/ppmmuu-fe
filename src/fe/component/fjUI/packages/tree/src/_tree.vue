<template>
  <ul class="fj-tree">
    <fj-tree-node
      v-for="(id, index) in topNodeIdArr"
      :id="id"
      :nodes="data"
      :node-key="nodeKey"
      :node-style="nodeStyle"
      :indent="indent"
      :render-content="renderContent"
      :key="id"></fj-tree-node>
  </ul>
</template>
<script>
  import FjTreeNode from './treeNode';

  export default {
    name: 'FjTree',
    props: {
      data: {},
      topNodeIdArr: Array,
      nodeKey: {
        type: String,
        default: '_id'
      },
      nodeStyle: Object,
      indent: {
        type: String,
        default: '10'
      },
      renderContent: Function
    },
    data() {
      return {
        currentNode: null
      };
    },
    methods: {
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (node[nodeKey]) {
          return node[nodeKey];
        }
        return index;
      }
    },
    components: {
      FjTreeNode
    },
    created() {
      this.isTree = true;
    }
  };
</script>
