<template>
  <label
    class="fj-radio-button-wrap"
    :class="[{
      'fj-radio-button-checked': model === label,
      'fj-radio-button-disabled': disabled
    },
    size ? size : '']">
    <span class="fj-radio-button" @click="handleClick">
      <slot></slot>
    </span>
  </label>
</template>
<script>
  export default {
    name: 'FjRadioButton',
    props: {
      label: {},
      disabled: Boolean,
      size: String
    },
    computed: {
      model: {
        get() {
          const parent = this.$parent;
          return parent.value;
        },
        set(val) {
          const parent = this.$parent;
          parent.$emit('input', val);
        }
      }
    },
    methods: {
      handleClick(e) {
        if (this.disabled) return;
        const parent = this.$parent;
        parent.$emit('input', this.label);
      }
    }
  };
</script>
