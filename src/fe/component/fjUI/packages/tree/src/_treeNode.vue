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
          <div :style="{ marginLeft: '13px' }"><node-content :node="nodes[id]"></node-content></div>
        </template>
        <node-content v-else :node="nodes[id]"></node-content>
      </div>
    </div>
    <ul v-if="isFolder" v-show="open">
      <fj-tree-node
        v-for="(item, index) in nodes[id].children"
        v-if="nodes[item]"
        :node-key="nodeKey"
        :node-style="nodeStyle"
        :id="item"
        :nodes="nodes"
        :indent="indent*2"
        :render-content="renderContent"
        :key="item"></fj-tree-node>
    </ul>
  </li>
</template>
<script>
  import NodeContent from './nodeContent';

  export default {
    name: 'FjTreeNode',
    props: {
      id: String,
      nodes: Object,
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
        const node = this.nodes[this.id];
        return node.children && node.children.length;
      },
      isCurrentNode() {
        return this.tree.currentNode === this;
      },
      innerNodeStyle() {
        return Object.assign(
          {},
          this.nodeStyle,
          { paddingLeft: `${this.indent}px`, position: 'relative' }
        );
      }
    },
    methods: {
      handleClick() {
        const node = this.nodes[this.id];
        if (this.isFolder) {
          if (!this.open) {
            this.tree.$emit('node-expand', node);
          } else {
            this.tree.$emit('node-collapse', node);
          }
          this.open = !this.open;
        } else {
          // this.tree.currentNode = this;
          // this.tree.$emit('current-change', node);
        }
        this.tree.currentNode = this;
        this.tree.$emit('current-change', node);
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
    },
    components: {
      NodeContent: NodeContent
    }
  };
</script>
