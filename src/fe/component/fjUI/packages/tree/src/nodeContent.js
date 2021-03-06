export default {
  props: {
    node: {
      required: true
    }
  },
  render(h) {
    const parent = this.$parent;
    const node = this.node;
    return (
      parent.renderContent
        ? parent.renderContent.call(parent._renderProxy, h, node)
        : <span class="fj-tree-node-content">{node.name}</span>
    );
  }
};
