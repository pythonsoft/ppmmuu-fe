<template>
  <div>
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FjRadioGroup',
    props: {
      value: {}
    }
  };
</script>
