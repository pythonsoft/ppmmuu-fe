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
        {{ nodes[id].name }}
      </div>
    </div>
    <ul v-if="isFolder" v-show="open">
      <fj-tree-node
        v-for="(item, index) in nodes[id].children"
        v-if="nodes[item]"
        :node-key="nodeKey"
        :id="item"
        :nodes="nodes"
        :indent="indent*2"
        :key="item"></fj-tree-node>
    </ul>
  </li>
</template>
<script>
  export default {
    name: 'FjTreeNode',
    props: {
      id: String,
      nodes: Object,
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
        const node = this.nodes[this.id]
        return node.children && node.children.length;
      },
      isCurrentNode() {
        return this.tree.currentNode === this;
      }
    },
    methods: {
      handleClick() {
        const node = this.nodes[this.id]
        if (this.isFolder) {
          if (!this.open) {
            this.tree.$emit('node-expand', node);
          } else {
            this.tree.$emit('node-collapse', node);
          }
          this.open = !this.open;
        } else {
          this.tree.currentNode = this;
          this.tree.$emit('current-change', node);
        }
        this.tree.$emit('node-click', node);
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
