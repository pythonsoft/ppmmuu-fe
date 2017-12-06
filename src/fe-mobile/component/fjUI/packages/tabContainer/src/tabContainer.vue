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
