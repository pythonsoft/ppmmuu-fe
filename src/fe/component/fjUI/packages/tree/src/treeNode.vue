<template>
  <li>
    <div
      :class="[
        isFolder ? 'fj-tree-item-expandable' : 'fj-tree-item',
        isCurrentNode ? 'fj-tree-current-item' : ''
      ]"
      @click.stop="handleClick">
      <div :style="innerNodeStyle">
        <template v-if="isFolder">
          <span :style="{ position: 'absolute', left: indent + 'px' }">{{ open ? '-' : '+' }}</span>
          <div :style="{ marginLeft: '13px' }"><node-content :node="node"></node-content></div>
        </template>
        <node-content v-else :node="node"></node-content>
      </div>
    </div>
    <ul v-if="isFolder" v-show="open">
      <fj-tree-node
        v-for="(item, index) in node.children"
        :node-key="nodeKey"
        :node-style="nodeStyle"
        :node="item"
        :indent="indent*2"
        :render-content="renderContent"
        :key="getNodeKey(item, index)"></fj-tree-node>
    </ul>
  </li>
</template>
<script>
  import NodeContent from './nodeContent';

  export default {
    name: 'FjTreeNode',
    props: {
      node: Object,
      nodeKey: String,
      nodeStyle: Object,
      indent: {},
      renderContent: Function
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
      },
      innerNodeStyle() {
        return Object.assign({}, this.nodeStyle, { paddingLeft: `${this.indent}px`, position: 'relative' });
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
          // this.tree.currentNode = this;
          // this.tree.$emit('current-change', this.node);
        }
        this.tree.currentNode = this;
        this.tree.$emit('current-change', this.node);
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
    },
    components: {
      NodeContent: NodeContent
    }
  };
</script>
