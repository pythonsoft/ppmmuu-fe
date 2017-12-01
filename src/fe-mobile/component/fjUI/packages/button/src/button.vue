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
<style>
  .fj-button {
    width: 100%;
    height: 50px;
    font-size: 17px;
    border: 0;
    border-radius: 3px;
    appearance: none;
    outline: 0;
    text-align: center;
  }
  .fj-button.is-disabled,
  .fj-button:not(.is-disabled):active {
    opacity: .8;
  }
  .fj-button-default {
    font-size: 17px;
    color: #38B1EB;
    background-color: #fff;
  }
  .fj-button-primary {
    color: #fff;
    background-color: #38B1EB;
  }
</style>
