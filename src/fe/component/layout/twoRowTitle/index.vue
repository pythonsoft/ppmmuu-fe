<template>
  <div class="layout-two-row-title">
    <h1><slot name="title"></slot></h1>
    <div class="layout-two-row-title-content">
      <slot name="content"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'layoutTwoRowTitle'
  };
</script>
<style>
  .layout-two-row-title {
    margin-left: 20px;
    margin-bottom: 20px;
    color: #2A3E52;
  }
  .layout-two-row-title h1 {
    font-size: 16px;
    line-height: 62px;
    border-bottom: 1px solid #EBF3FB;
  }
  .layout-two-row-title-content{
    width: 80%;
  }
</style>
