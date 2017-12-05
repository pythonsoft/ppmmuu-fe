<template>
  <div class="fj-tab-container-item" v-show="id === $parent.value">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'FjTabContainerItem',
    props: {
      id: String
    }
  };
</script>
