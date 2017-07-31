<template>
  <div class="layout-content">
    <div class="layout-top-search">
      <div class="layout-search-title"><slot name="search-left"></slot></div>
      <div class="layout-search-right-content">
          <slot name="search-right"></slot>
      </div>
    </div>
    <div class="layout-operation">
      <slot name="operation"></slot>
    </div>
    <slot name="table"></slot>
    <div class="layout-table-pagination">
      <slot name="pagination"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'fourRowLayoutRightContent'
  };
</script>
<style>
  .layout-content {
    margin-left: 20px;
    margin-top: 10px;
  }

  .layout-top-search {
    height: 40px;
    width: 100%;
    line-height: 38px;
    position: relative;
    min-width: 700px;
  }

  .layout-top-search .layout-search-title{
    font-size: 16px;
    color: #273F57;
    position: absolute;
    left: 20px;
  }

  .layout-top-search .layout-search-right-content{
    position: absolute;
    right: 20px;
  }

  .layout-operation {
    background: #F2F6FA;
    line-height: 46px;
    height: 46px;
    margin-top: 10px;
    padding-left: 14px;
    overflow: hidden;
  }

  .layout-table-pagination {
    margin-top: 30px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    color: #4C637B;
  }
</style>
