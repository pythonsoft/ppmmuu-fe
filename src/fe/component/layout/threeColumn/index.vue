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
<script>
  import './index.css'
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
        style.width = `${this.leftWidth}px`;
        return style;
      },
      centerStyle() {
        const style = {};
        style.left = `${this.leftWidth}px`;
        style.right = `${this.rightWidth}px`;
        return style;
      },
      rightStyle() {
        const style = {};
        style.width = `${this.rightWidth}px`;
        return style;
      }
    }
  };
</script>
