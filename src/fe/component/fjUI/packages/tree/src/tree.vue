<template>
  <ul class="fj-tree" :class="[{'theme-dark': theme === 'dark'}]">
    <fj-tree-node
      v-for="(item, index) in data"
      :node="item"
      :node-key="nodeKey"
      :default-expanded-key="defaultExpandedKey"
      :node-style="nodeStyle"
      :node-level="1"
      :indent="indent"
      :autoExpand="autoExpand"
      :lazy="lazy"
      :load="load"
      :render-content="renderContent"
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
        default: '_id'
      },
      defaultExpandedKey: String,
      nodeStyle: Object,
      indent: {
        type: String,
        default: '10'
      },
      renderContent: Function,
      theme: {
        type: String,
        default: 'normal'
      },
      size: String,
      autoExpand: {
        type: Boolean,
        default: true
      },
      lazy: {
        type: Boolean,
        default: false
      },
      load: Function
    },
    data() {
      return {
        currentNode: ''
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
