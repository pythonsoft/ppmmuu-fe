<template>
  <div class="layout-content">
    <div class="three-layout-top-search">

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
    margin-top: 10px;
    min-width: 700px;
    margin-left: 20px;
  }

  .three-layout-top-search {
    height: 40px;
    line-height: 40px;
    margin-bottom: 10px;
    width: 100%;
    position: relative;
  }

  .three-layout-top-search .layout-search-title-color {
    color: #273F57;
  }

  .three-layout-top-search .layout-search-title{
    font-size: 14px;
    float: left;
  }

  .three-layout-top-search .title-left {
    margin-left:4px;
  }

  .three-layout-top-search .arrow-left {
    cursor: default;
    color: #9fb3ca;
  }

  .three-layout-top-search .arrow-left:hover{
    color: #4c637b;
  }

  .three-layout-top-search .layout-search-right-content{
    /*position: absolute;*/
    float: right;
    margin-top: 5px;
    margin-right: 20px;
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
