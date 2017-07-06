<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FjCheckboxGroup',
    props: {
      value: {}
    },
    watch: {
      value(value) {
      }
    }
  };
</script>
