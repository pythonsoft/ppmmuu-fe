<template>
  <div class="layout-two-row-tree">
    <div class="layout-two-row-tree-upper" v-if="showUpper">
      <div class="layout-two-row-tree-upper-title">
        <slot name="title"></slot>
      </div>
      <div class="layout-two-row-tree-upper-button">
        <slot name="button"></slot>
      </div>
    </div>
    <div class="layout-two-row-tree-lower">
      <slot name="tree"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'layoutTwoRowTree',
    props: {
      showUpper: {type: Boolean, default: true}
    }
  };
</script>
<style>
  .layout-two-row-tree {
    padding-top: 10px;
    background-color: #f8fafb;
    height: 100%;
    overflow: auto;
  }
  .layout-two-row-tree-upper {
    padding: 0 16px;
    height: 40px;
    line-height: 40px;
    overflow: auto;
  }
  .layout-two-row-tree-upper-title {
    float: left;
  }
  .layout-two-row-tree-upper-button {
    float: right;
  }
</style>
