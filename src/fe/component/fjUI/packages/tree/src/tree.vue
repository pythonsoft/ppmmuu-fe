<template>
  <ul class="fj-tree">
    <fj-tree-node
      v-for="(item, index) in data"
      :node="item"
      :nodeKey="nodeKey"
      :indent="indent"
      :key="getNodeKey(item, index)"></fj-tree-node>
  </ul>
</template>
<script>
  import FjTreeNode from './treeNode';

  export default {
    name: 'FjTree',
    props: {
      data: Array,
      nodeKey: {
        type: String,
        default: 'id'
      },
      indent: {
        type: String,
        default: '10'
      }
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
