<template>
  <div class="fj-navbar"><slot></slot></div>
</template>
<script>
  export default {
    name: 'FjNavbar',
    props: {
      value: {}
    }
  };
</script>
<style>
  .fj-navbar {
    display: flex;
    margin-bottom: 16px;
    text-align: center;
    background-color: #FFFFFF;
  }
</style>
