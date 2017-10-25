<template>
  <transition :name="transitionName">
    <div
      ref="dropdown"
      :class="['fj-select-dropdown clearfix', {'multiple': multiple}]"
      :style="{
        'minWidth': `${minWidth}px`,
        'top': `${top}px`,
        'left': `${left}px`
      }">
      <slot></slot>
    </div>
  </transition>
</template>
<script>
  import { getPosition } from '../../../utils/position';

  export default {
    name: 'FjSelectDropdown',
    props: {
      multiple: Boolean
    },
    data() {
      return {
        minWidth: 0,
        top: 0,
        left: 0,
        transitionName: 'fj-zoom-in-top',
        dropdownPosition: 'bottom',
        parentEl: this.$parent.parentEl
      };
    },
    watch: {
      dropdownPosition(val) {
        this.handlePositionChange(val);
      },
      '$parent.visible'(val) {
        if (val) {
          this.resetInputWidth();
          this.resetDropdownPosition();
          this.handlePositionChange(this.dropdownPosition);
        } else {
          this.transitionName = 'fj-zoom-in-top';
        }
      },
      '$parent.parentEl'(val) {
        if (val && val !== this.parentEl) {
          if (this.parentEl) {
            this.parentEl.removeEventListener('resize', this.resetInputWidth);
            this.parentEl.removeEventListener('scroll', this.resetDropdownPosition);
            this.parentEl.removeEventListener('scroll', this.handlePositionChange);
          }

          this.parentEl = val;
          val.addEventListener('resize', this.resetInputWidth);
          val.addEventListener('scroll', this.resetDropdownPosition);
          val.addEventListener('scroll', this.handlePositionChange);
          document.body.appendChild(this.$el);
        }
      }
    },
    mounted() {
      this.resetInputWidth();
      if (this.parentEl) {
        this.parentEl = this.$parent.parentEl || document.body;
        this.parentEl.addEventListener('resize', this.resetInputWidth);
        this.parentEl.addEventListener('scroll', this.resetDropdownPosition);
        this.parentEl.addEventListener('scroll', this.handlePositionChange);
        document.body.appendChild(this.$el);
      }
    },
    beforeDestroy() {
      // const parentEl = this.$parent.parentEl || document.body;
      if (this.parentEl) {
        this.parentEl.removeEventListener('resize', this.resetInputWidth);
        this.parentEl.removeEventListener('scroll', this.resetDropdownPosition);
        this.parentEl.removeEventListener('scroll', this.handlePositionChange);
        document.body.removeChild(this.$el);
      }
    },
    methods: {
      resetInputWidth() {
        if (!this.$parent.reference || !this.$parent.visible) return;
        this.minWidth = this.$parent.reference.getBoundingClientRect().width;
      },
      resetDropdownPosition() {
        if (!this.$parent.reference || !this.$parent.visible) return;
        const referenceRect = this.$parent.reference.getBoundingClientRect();
        const bottom = window.innerHeight - referenceRect.top;
        if (referenceRect.top > bottom) {
          this.dropdownPosition = 'top';
        } else {
          this.dropdownPosition = 'bottom';
        }
      },
      handlePositionChange(val) {
        if (!this.$parent.reference || !this.$parent.visible) return;
        const referencePosition = getPosition(this.$parent.reference);
        const dropdownMenuHeight = this.$refs.dropdown.getBoundingClientRect().height;
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        if (this.parentEl) {
          this.left = referencePosition.x;
        } else {
          this.left = 0;
        }
        if (val === 'top' && dropdownMenuHeight > 0) {
          this.transitionName = 'fj-zoom-in-bottom';
          let marginTop = window.getComputedStyle(this.$refs.dropdown).marginTop || 0;
          marginTop = parseInt(marginTop, 10);
          if (this.parentEl) {
            this.top = -dropdownMenuHeight - (marginTop * 2) - referencePosition.y - parentElScrollTop;
          } else {
            this.top = -dropdownMenuHeight - (marginTop * 2);
          }
        } else {
          this.transitionName = 'fj-zoom-in-top';
          const parentHeight = this.$parent.$el.getBoundingClientRect().height;
          if (this.parentEl) {
            this.top = parentHeight + referencePosition.y - parentElScrollTop;
          } else {
            this.top = parentHeight;
          }
        }
      }
    }
  };
</script>
