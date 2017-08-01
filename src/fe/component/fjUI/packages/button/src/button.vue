<template>
  <button
    class="fj-button"
    :class="[
      type ? 'fj-button-' + type : '',
      size ? 'fj-button-' + size : (type !== 'text' ? 'fj-button-default-size' : ''),
      {
        'fj-button-disabled': disabled,
        'fj-button-loading': loading
      }
    ]"
    :disabled="disabled"
    @click="handleClick"
  >
    <i class="iconfont fj-icon-loading" v-if="loading">&#xe674;</i>
    <slot></slot>
  </button>
</template>
<script>
  export default {
    name: 'FjButton',
    props: {
      type: {
        type: String,
        default: 'default'
      },
      size: String,
      loading: Boolean,
      disabled: Boolean
    },
    methods: {
      handleClick(e) {
        this.$emit('click', e);
      }
    }
  };
</script>
