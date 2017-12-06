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
