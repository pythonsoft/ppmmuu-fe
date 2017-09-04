<template>
  <div class="fj-select" :class="[theme ? `fj-select-${theme}` : '', size ? `fj-select-${size}` : '']" v-clickoutside="handleClose">
    <fj-input
      v-model="selectedLabel"
      ref="reference"
      :readonly="true"
      :disabled="disabled"
      :placeholder="placeholder"
      :theme="theme"
      :size="size"
      @focus="handleFocus"
      @mousedown.native="handleMouseDown"
      @keydown.native.esc.prevent="visible = false"
      @keydown.native.tab="visible = false"
      @keydown.native.down.prevent="navigateOptions('next')"
      @keydown.native.up.prevent="navigateOptions('prev')"
      @keydown.native.enter.prevent="selectOption"
      @on-icon-click="handleIconClick"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false"
      :icon="iconClass"
    ></fj-input>
    <fj-select-dropdown ref="popper" v-show="visible" :min-width="inputWidth" :position="dropdownPosition">
      <slot></slot>
    </fj-select-dropdown>
  </div>
</template>
<script>
  import FjInput from '../../input';
  import FjSelectDropdown from './selectDropdown';
  import Clickoutside from '../../../utils/clickoutside';
  import { scrollIntoViewBottom } from '../../../utils/scrollIntoView';

  export default {
    name: 'FjSelect',
    props: {
      disabled: Boolean,
      clearable: Boolean,
      placeholder: String,
      size: String,
      theme: String,
      value: {
        require: true
      }
    },
    data() {
      return {
        options: [],
        selectedLabel: '',
        icon: 'icon-fill-bottom',
        visible: false,
        inputWidth: 0,
        dropdownPosition: 'bottom',
        inputHovering: false,
        hoverIndex: -1
      };
    },
    created() {
      this.setSelected();
      this.$on('option-click', this.handleOptionClick);
    },
    mounted() {
      if (this.$refs.reference && this.$refs.reference.$el) {
        this.resetInputWidth();
        window.addEventListener('resize', this.resetInputWidth);
        document.addEventListener('scroll', this.resetDropdownPosition);
      }
    },
    beforDestroy() {
      window.removeEventListener('resize', this.resetInputWidth);
      document.removeEventListener('scroll', this.resetDropdownPosition);
    },
    methods: {
      handleFocus(e) {
        this.visible = true;
      },
      handleMouseDown(e) {
        if (e.target.tagName !== 'INPUT') return;
        if (this.visible) {
          this.handleClose();
          e.preventDefault();
        }
      },
      handleIconClick(e) {
        if (this.iconClass.indexOf('icon-fill-close select-delete-icon') > -1) {
          this.deleteSelected(e);
        } else {
          this.visible = !this.visible;
        }
      },
      deleteSelected(e) {
        e.stopPropagation();
        this.$emit('input', '');
        this.visible = false;
      },
      resetInputWidth() {
        if (!this.visible) return;
        this.inputWidth = this.$refs.reference.$el.getBoundingClientRect().width;
      },
      resetDropdownPosition() {
        if (!this.visible) return;
        const referenceRect = this.$refs.reference.$el.getBoundingClientRect();
        const bottom = window.innerHeight - referenceRect.top;
        if (referenceRect.top > bottom) {
          this.dropdownPosition = 'top';
        } else {
          this.dropdownPosition = 'bottom';
        }
      },
      handleClose() {
        this.visible = false;
      },
      handleIconHide() {
        this.icon = 'icon-fill-bottom';
      },
      handleIconShow() {
        this.icon = 'icon-fill-bottom is-reverse';
      },
      handleOptionClick(option) {
        this.$emit('input', option.value);
        this.visible = false;
      },
      navigateOptions(direction) {
        if (!this.visible) return;
        if (this.options.length === 0) return;

        if (direction === 'next') {
          this.hoverIndex += 1;
          if (this.hoverIndex === this.options.length) {
            this.hoverIndex = 0;
          }
        } else if (direction === 'prev') {
          this.hoverIndex -= 1;
          if (this.hoverIndex < 0) {
            this.hoverIndex = this.options.length - 1;
          }
        }

        const container = this.$refs.popper.$el;
        const selected = this.options[this.hoverIndex].$el;
        scrollIntoViewBottom(container, selected);
      },
      setSelected() {
        const option = this.getOption(this.value);
        if (option) {
          this.selected = option;
          this.selectedLabel = option.label;
        } else {
          this.selectedLabel = '';
        }
      },
      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionClick(this.options[this.hoverIndex]);
        }
      },
      resetHoverIndex() {
        setTimeout(() => {
          this.hoverIndex = this.options.indexOf(this.selected);
        }, 300);
      },
      getOption(value) {
        let option;
        for (let i = this.options.length - 1; i >= 0; i--) {
          const item = this.options[i];
          if (item.value === value) {
            option = item;
            break;
          }
        }
        return option;
      }
    },
    watch: {
      visible(val) {
        if (!val) {
          this.$refs.reference.$el.querySelector('input').blur();
          this.handleIconHide();
          this.resetHoverIndex();
        } else {
          this.handleIconShow();
          this.resetInputWidth();
          this.resetDropdownPosition();
        }
      },
      value(val) {
        this.setSelected();
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-change', val);
        }
      },
      options(val) {
        this.setSelected();
      }
    },
    computed: {
      iconClass() {
        return this.clearable && this.inputHovering && this.value !== '' ? 'icon-fill-close select-delete-icon' : this.icon;
      }
    },
    components: {
      FjInput,
      FjSelectDropdown
    },
    directives: { Clickoutside }
  };
</script>
