<template>
  <span
    @click="handleClick"
    :class="[
    'fj-tag',
    type ? 'fj-tag-' + type : '',
    closable ? 'fj-closable-tag-' + type : '',
    clickable ? 'fj-clickable-tag' : ''
  ]">
    <slot></slot>
    <i v-if="closable" @click="handleClose" class="iconfont fj-tag-close"></i>
  </span>
</template>
<script>
  export default {
    name: 'FjTag',
    props: {
      type: String,
      closable: Boolean,
      clickable: Boolean
    },
    methods: {
      handleClose(e) {
        this.$emit('close', e);
      },
      handleClick(e) {
        if (this.clickable) {
          this.$emit('click', e);
        }
      }
    }
  };
</script>
