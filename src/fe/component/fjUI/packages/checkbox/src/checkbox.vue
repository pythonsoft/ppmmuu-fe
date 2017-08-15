<template>
  <label
    class="fj-checkbox-wrap"
    :class="[{
      'fj-checkbox-checked': isChecked,
      'fj-checkbox-disabled': disabled
    },
    size ? size : '']">
    <span class="fj-checkbox">
      <span :class="['fj-checkbox-inner', size ? size : '']"></span>
      <input
        class="fj-checkbox-input"
        type="checkbox"
        :disabled="disabled"
        v-model="model"
        :value="label">
    </span>
    <slot></slot>
  </label>
</template>
<script>
  export default {
    name: 'FjCheckbox',
    props: {
      value: {},
      label: {},
      size: String,
      disabled: Boolean
    },
    data() {
      return {
        selfModel: false
      };
    },
    computed: {
      model: {
        get() {
          const selfValue = this.value !== undefined ? this.value : this.selfModel;
          return this.isGroup ? this._checkboxGroup.value : selfValue;
        },
        set(val) {
          if (this.isGroup) {
            this._checkboxGroup.$emit('input', val);
          } else if (this.value !== undefined) {
            this.$emit('input', val);
          } else {
            this.selfModel = val;
          }
        }
      },
      isChecked() {
        if (Array.isArray(this.model)) {
          return this.model.indexOf(this.label) > -1;
        }
        return this.model;
      },
      isGroup() {
        const parent = this.$parent;
        if (parent.$options.name !== 'FjCheckboxGroup') return false;
        this._checkboxGroup = parent;
        return true;
      }
    },
    methods: {
    }
  };
</script>
