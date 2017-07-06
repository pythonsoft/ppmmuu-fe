<template>
  <div
    ref="dropdown"
    class="fj-select-dropdown"
    :style="{
      'minWidth': minWidth + 'px',
      'top': top + 'px'
    }">
    <slot></slot>
  </div>
</template>
<script>
  export default {
    name: 'FjSelectDropdown',
    props: {
      minWidth: {
        default: 0
      },
      position: {
        default: 'bottom'
      }
    },
    data() {
      return {
        top: 0
      };
    },
    watch: {
      '$parent.dropdownPosition'(val) {
        this.handlePositionChange(val);
      }
    },
    mounted() {
      this.handlePositionChange('bottom');
    },
    methods: {
      handlePositionChange(val) {
        if (val === 'top') {
          const top = this.$refs.dropdown.getBoundingClientRect().height;
          let marginTop = window.getComputedStyle(this.$refs.dropdown).marginTop || 0;
          marginTop = parseInt(marginTop, 10);
          this.top = -top - (marginTop * 2);
        } else {
          const parentHeight = this.$parent.$el.getBoundingClientRect().height;
          this.top = parentHeight;
        }
      }
    }
  };
</script>
