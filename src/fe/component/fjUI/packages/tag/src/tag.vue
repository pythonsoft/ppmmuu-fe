<template>
  <span :class="[
    'fj-tag',
    type ? 'fj-tag-' + type : '',
    closable ? 'fj-closable-tag-' + type : ''
  ]">
    <slot></slot>
    <i v-if="closable" @click="handleClose" class="fj-tag-close">X</i>
  </span>
</template>
<script>
  export default {
    name: 'FjTag',
    props: {
      type: String,
      closable: Boolean
    },
    methods: {
      handleClose(e) {
        this.$emit('close', e);
      }
    }
  };
</script>
