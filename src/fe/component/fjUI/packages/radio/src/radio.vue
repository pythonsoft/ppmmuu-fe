<template>
  <label
    class="fj-radio-wrap"
    :class="[{
      'fj-radio-checked': model === label,
      'fj-radio-disabled': disabled
    },
    size ? size : '']">
    <span class="fj-radio">
      <span :class="['fj-radio-inner', size ? size : '']"></span>
      <input
        class="fj-radio-input"
        type="radio"
        :value="label"
        v-model="model"
        :disabled="disabled">
    </span>
    <slot></slot>
  </label>
</template>
<script>
  export default {
    name: 'FjRadio',
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
        this.$emit('click', e);
      }
    }
  };
</script>
