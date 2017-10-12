<template>
  <transition :name="transitionName">
    <div
      ref="dropdown"
      :class="['fj-select-dropdown clearfix', {'multiple': multiple}]"
      :style="{
        'minWidth': minWidth + 'px',
        'top': top + 'px'
      }">
      <slot></slot>
    </div>
  </transition>
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
      },
      multiple: Boolean
    },
    data() {
      return {
        top: 0,
        transitionName: 'fj-zoom-in-top'
      };
    },
    watch: {
      '$parent.dropdownPosition'(val) {
        this.handlePositionChange(val);
      },
      '$parent.visible'(val) {
        if (val) {
          this.handlePositionChange(this.$parent.dropdownPosition);
        } else {
          this.transitionName = 'fj-zoom-in-top';
        }
      }
    },
    mounted() {
      this.handlePositionChange('bottom');
    },
    methods: {
      handlePositionChange(val) {
        const dropdownMenuHeight = this.$refs.dropdown.getBoundingClientRect().height;
        if (val === 'top' && dropdownMenuHeight > 0) {
          this.transitionName = 'fj-zoom-in-bottom';
          let marginTop = window.getComputedStyle(this.$refs.dropdown).marginTop || 0;
          marginTop = parseInt(marginTop, 10);
          this.top = -dropdownMenuHeight - (marginTop * 2);
        } else {
          this.transitionName = 'fj-zoom-in-top';
          const parentHeight = this.$parent.$el.getBoundingClientRect().height;
          this.top = parentHeight;
        }
      }
    }
  };
</script>
