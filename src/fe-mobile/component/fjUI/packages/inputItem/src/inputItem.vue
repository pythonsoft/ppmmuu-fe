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
