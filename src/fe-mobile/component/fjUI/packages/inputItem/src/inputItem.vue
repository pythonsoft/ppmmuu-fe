<template>
  <fj-cell :title="label" class="fj-input-item">
    <input
      slot="right"
      class="fj-input"
      :type="type"
      :placeholder="placeholder"
      :value="currentValue"
      @input="handleInput">
  </fj-cell>
</template>
<script>
  import FjCell from '../../cell';
  export default {
    name: 'FjInputItem',
    props: {
      label: String,
      type: {
        type: String,
        default: 'text'
      },
      value: {},
      placeholder: String
    },
    data() {
      return {
        currentValue: this.value
      };
    },
    watch: {
      value(val) {
        this.currentValue = val;
      }
    },
    methods: {
      handleInput(e) {
        this.currentValue = e.target.value;
        this.$emit('input', this.currentValue);
      }
    },
    components: {
      FjCell
    }
  };
</script>
<style>
  .fj-input-item .fj-cell-title {
    flex: none;
    width: 105px;
  }
  .fj-input-item .fj-cell-value {
    display: flex;
    flex: 1;
  }
  .fj-input {
    flex: 1;
    width: 100%;
    margin: 0;
    padding: 0;
    border: 0;
    border-radius: 0;
    outline: 0;
    text-align: right;
    line-height: 1.4;
    color: #333333;
  }
  .fj-input::placeholder {
    color: #CED9E5;
  }
</style>
