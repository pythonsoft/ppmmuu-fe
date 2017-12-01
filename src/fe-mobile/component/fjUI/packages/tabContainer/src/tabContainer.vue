<template>
  <div class="fj-tab-container"><slot></slot></div>
</template>
<script>
  export default {
    name: 'FjTabContainer',
    props: {
      value: {}
    }
  };
</script>
<style>
  .fj-tab-container {
    /*overflow: hidden;*/
    display: flex;
  }
</style>
