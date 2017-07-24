<template>
  <div class="layout-two-column">
    <div class="layout-two-column-left">
      <slot name="left"></slot>
    </div>
    <div class="layout-two-column-right">
      <slot name="right"></slot>
    </div>
  </div>
</template>
<style>
  .layout-two-column {
    width: 100%;
    height: 100%;
  }

  .layout-two-column-left {
    width: 192px;
    height: 100%;
    overflow: hidden;
  }

  .layout-two-column-right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 192px;
    overflow: hidden;
  }
</style>
<script>
  export default {
    name: 'layoutTwoColumn'
  };
</script>
