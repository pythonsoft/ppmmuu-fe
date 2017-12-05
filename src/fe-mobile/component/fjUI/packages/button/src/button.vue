<template>
  <button
    :disabled="disabled"
    :class="['fj-button', `fj-button-${type}`, {'is-disabled': disabled}]"
    @touchstart=""><slot></slot></button>
</template>
<script>
  export default {
    name: 'FjButton',
    props: {
      type: {
        type: String,
        default: 'primary',
        validator(val) {
          return ['default', 'primary'].indexOf(val) > -1;
        }
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    methods:{
      handleClick(e) {
        this.$emit('click', e);
      }
    }
  };
</script>
