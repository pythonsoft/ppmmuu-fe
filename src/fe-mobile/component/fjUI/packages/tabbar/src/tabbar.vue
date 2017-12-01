<template>
  <div class="fj-tabbar"><slot></slot></div>
</template>

<script>
  export default {
    name: 'FjTabbar',
    props: {
      value: {}
    }
  };
</script>

<style>
  @import "../../../variables.css";
  .fj-tabbar {
    display: flex;
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    text-align: center;

    background-image: linear-gradient(180deg,#CED9E5,#CED9E5 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-color: #FFFFFF;
    z-index: var(--z-index-tabbar);
  }
</style>
