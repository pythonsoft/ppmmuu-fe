<template>
  <div class="layout-three-column">
    <div class="layout-three-column-left" :style="leftStyle">
      <slot name="left"></slot>
    </div>
    <div class="layout-three-column-center" :style="centerStyle">
      <slot name="center"></slot>
    </div>
    <div class="layout-three-column-right" :style="rightStyle">
      <slot name="right"></slot>
    </div>
    <slot></slot>
  </div>
</template>
<style>
  .layout-three-column {
    width: 100%;
    height: 100%;
    min-width: 1100px;
    position: relative;
  }

  .layout-three-column-left {
    height: 100%;
    overflow: hidden;
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
  }

  .layout-three-column-center {
    position: absolute;
    top: 0;
    height: 100%;
    overflow: hidden;
  }

  .layout-three-column-right {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    overflow: hidden;
  }
</style>
<script>
  export default {
    name: 'layoutThreeColumn',
    props: {
      leftWidth: {
        type: Number,
        default: 192
      },
      rightWidth: {
        type: Number,
        default: 439
      }
    },
    computed: {
      leftStyle() {
        const style = {};
        style.width = this.leftWidth + 'px';
        return style;
      },
      centerStyle() {
        const style = {};
        style.left = this.leftWidth + 'px';
        style.right = this.rightWidth + 'px';
        return style;
      },
      rightStyle() {
        const style = {};
        style.width = this.rightWidth + 'px';
        return style;
      }
    }
  };
</script>
