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
