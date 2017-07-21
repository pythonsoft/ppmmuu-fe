<template>
  <div class="fj-dropdown-menu" :style="width ? { width: width } : { minWidth: '135px' }">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'FjDropdownMenu',
    props: {
      width: String
    }
  };
</script>
