<template>
  <div class="layout-content">
    <div class="layout-top-search">

      <div v-if="isIncludeArrow"  class="layout-search-title title-left">
        <span class="iconfont icon-arrow-left arrow-left" @click="back">
          <span class="layout-search-title-color"><slot name="search-left"></slot></span>
        </span>
      </div>

      <div class="layout-search-title layout-search-title-color" v-else>
        <slot name="search-left"></slot>
      </div>

      <div class="layout-search-right-content">
          <slot name="search-right"></slot>
      </div>
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
    name: 'fourRowLayoutRightContent',
    props: {
      isIncludeArrow: { type: Boolean, default: false }
    },
    data() {
      return {
      };
    },
    methods: {
      back() {
        this.$emit('back');
      }
    }
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
    margin-bottom: 10px;
  }

  .layout-top-search .layout-search-title-color {
    color: #273F57;
  }

  .layout-top-search .layout-search-title{
    font-size: 14px;
    position: absolute;
    left: 20px;
  }

  .layout-top-search .title-left {
    left:4px;
  }

  .layout-top-search .arrow-left {
    cursor: default;
    color: #9fb3ca;
  }

  .layout-top-search .arrow-left:hover{
    color: #4c637b;
  }

  .layout-top-search .layout-search-right-content{
    position: absolute;
    right: 20px;
  }

  .layout-table-pagination {
    margin-top: 30px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    color: #4C637B;
  }
</style>
