<template>
  <li>
    <div
      :class="[
        isFolder ? 'fj-tree-item-expandable' : 'fj-tree-item',
        isCurrentNode ? 'fj-tree-current-item' : ''
      ]"
      @click.stop="handleClick">
      <div :style="{ paddingLeft: indent + 'px' }">
        <span v-if="isFolder">{{ open ? '-' : '+' }}</span>
        {{ node.name }}
      </div>
    </div>
    <ul v-if="isFolder" v-show="open">
      <fj-tree-node
        v-for="(item, index) in node.children"
        :nodeKey="nodeKey"
        :node="item"
        :indent="indent*2"
        :key="getNodeKey(item, index)"></fj-tree-node>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'FjTreeNode',
    props: {
      node: Object,
      nodeKey: String,
      indent: {}
    },
    data() {
      return {
        open: false,
        tree: null
      };
    },
    computed: {
      isFolder() {
        return this.node.children && this.node.children.length;
      },
      isCurrentNode() {
        return this.tree.currentNode === this;
      }
    },
    methods: {
      handleClick() {
        if (this.isFolder) {
          if (!this.open) {
            this.tree.$emit('node-expand', this.node);
          } else {
            this.tree.$emit('node-collapse', this.node);
          }
          this.open = !this.open;
        } else {
          this.tree.currentNode = this;
          this.tree.$emit('current-change', this.node);
        }
        this.tree.$emit('node-click', this.node);
      },
      getNodeKey(node, index) {
        const nodeKey = this.nodeKey;
        if (node[nodeKey]) {
          return node[nodeKey];
        }
        return index;
      }
    },
    created() {
      const parent = this.$parent;
      if (parent.isTree) {
        this.tree = parent;
      } else {
        this.tree = parent.tree;
      }
    }
  };
</script>
