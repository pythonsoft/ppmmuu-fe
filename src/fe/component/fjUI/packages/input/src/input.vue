<template>
  <div
    :class="[
      type === 'textarea' ? 'fj-textarea-wrap' : 'fj-input-wrap',
      size ? 'fj-input-' + size : '',
      {
        'fj-input-disabled': disabled
      }
    ]">
    <template v-if="type !== 'textarea'">
      <slot name="prepend"></slot>
      <i class="fj-input-icon iconfont" :class="icon" @click="handleIconClick" v-if="icon"></i>
      <input
        ref="input"
        :class="`fj-input-inner-${theme}`"
        :value="currentValue"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
        v-bind="$props">
    </template>
    <textarea
      v-else
      :class="`fj-textarea-inner-${theme}`"
      :value="currentValue"
      @input="handleInput"
      @focus="handleFocus"
      @blur="handleBlur"
      v-bind="$props">
    </textarea>
  </div>
</template>
<script>
  export default {
    name: 'FjInput',
    props: {
      type: {
        type: String,
        default: 'text'
      },
      theme: {
        type: String,
        default: 'stroke'
      },
      value: [String, Number],
      placeholder: String,
      size: String,
      readonly: Boolean,
      disabled: Boolean,
      rows: {
        type: Number,
        default: 2
      },
      icon: String
    },
    data() {
      return {
        currentValue: this.value
      };
    },
    methods: {
      handleInput(e) {
        const value = e.target.value;
        this.$emit('input', value);
        this.setCurrentValue(value);
        this.$emit('change', value);
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-change', value);
        }
      },
      setCurrentValue(value) {
        if (value === this.currentValue) return;
        this.currentValue = value;
      },
      handleFocus(e) {
        this.$emit('focus', e);
      },
      handleBlur(e) {
        this.$emit('blur', e);
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-blur', e.target.value);
        }
      },
      handleIconClick(e) {
        this.$emit('on-icon-click', e);
        // this.$refs.input.focus();
      }
    },
    watch: {
      'value'(val, oldValue) {
        this.setCurrentValue(val);
      }
    }
  };
</script>
