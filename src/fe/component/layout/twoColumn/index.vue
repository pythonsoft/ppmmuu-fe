<template>
  <div class="layout-two-column">
    <div class="layout-two-column-left" :style="leftStyle">
      <slot name="left"></slot>
    </div>
    <div class="layout-two-column-right" :style="rightStyle">
      <slot name="right"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<style>
  .layout-two-column {
    width: 100%;
    height: 100%;
  }

  .layout-two-column-left {
    height: 100%;
    overflow: hidden;
    border-right: 2px solid #F2F6FA;
  }

  .layout-two-column-right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
</style>
<script>
  export default {
    name: 'layoutTwoColumn',
    props: {
      leftWidth: {
        type: Number,
        default: 192
      }
    },
    computed: {
      leftStyle(){
        const style = {};
        style.width = this.leftWidth + 'px';
        return style;
      },
      rightStyle(){
        const style = {};
        style.left = this.leftWidth + 'px';
        return style;
      }
    }
  };
</script>
