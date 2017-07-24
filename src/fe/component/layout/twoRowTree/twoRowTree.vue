<template>
  <div class="tworowtree-content">
    <div class="tworowtree-upper">
      <div class="tworowtree-upper-title">
        <slot name="tworowtree-upper-title"></slot>
      </div>
      <div class="tworowtree-upper-button">
        <slot name="tworowtree-upper-button"></slot>
      </div>
    </div>
    <div class="tworowtree-lower">
      <slot name="tree"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'twoRowTree'
  };
</script>
<style>
  .tworowtree-content {
    margin-left: 22px;
    margin-right: 18px;
    margin-top: 10px;
  }
  .tworowtree-upper {
    height: 40px;
    line-height: 38px;
  }
  .tworowtree-upper-title {
    float: left;
    position: relative;
  }
  .tworowtree-upper-button {
    float: right;
    position: relative;
  }
</style>
