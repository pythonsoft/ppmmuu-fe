<template>
  <div :class="customClass">
    <slot></slot>
  </div>
</template>

<script>
  export default {
    name: 'FjRadioGroup',
    props: {
      value: {},
      customClass: String
    }
  };
</script>
