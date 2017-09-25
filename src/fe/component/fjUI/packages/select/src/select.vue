<template>
  <div class="fj-select" :class="[theme ? `fj-select-${theme}` : '', size ? `fj-select-${size}` : '']" v-clickoutside="handleClose">
    <fj-input
      v-model="selectedLabel"
      ref="reference"
      :readonly="!remote"
      @change="inputValueChange"
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
      <div v-if="remote && selectedLabel.length === 0" class="fj-select-dropdown-title-wrap clearfix">
        <h3 class="fj-select-dropdown-title">历史记录</h3>
        <span class="fj-select-dropdown-clear-btn" @click="clearHistoryMethod">清空<i class="iconfont icon-delete"></i></span>
      </div>
      <p class="fj-select-dropdown-empty" v-if="options.length === 0 || loading">{{ emptyText }}</p>
      <div v-show="options.length > 0 && !loading"><slot></slot></div>
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
      remote: Boolean,
      remoteMethod: {
        type: Function,
        default: () => {}
      },
      historyMethod: {
        type: Function,
        default: () => {}
      },
      clearHistoryMethod: {
        type: Function,
        default: () => {}
      },
      loading: Boolean,
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
      inputValueChange(val) {
        this.$emit('input', val);
        if (val.length > 0) {
          // this.remoteMethod(val);
          this.visible = false;
        } else {
          this.visible = true;
          this.historyMethod();
        }
      },
      handleFocus(e) {
        if (this.remote && this.selectedLabel.length > 0) {
          return;
        }
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
        // 如果为remote就触发搜索函数
        if (this.remote) {
          this.$emit('search', this.selectedLabel);
          this.visible = false;
          return;
        }
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
        // 如果为remote就触发搜索函数
        if (this.remote) {
          this.$emit('search', this.selectedLabel);
          this.hoverIndex = -1;
        }
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
      setSelected(inputVal = '') {
        const option = this.getOption(this.value);
        if (option) {
          this.selected = option;
          this.selectedLabel = option.label;
        } else {
          this.selectedLabel = this.remote ? inputVal : '';
        }
      },
      selectOption() {
        if (this.options[this.hoverIndex]) {
          this.handleOptionClick(this.options[this.hoverIndex]);
        }

        // 如果为remote就触发搜索函数
        if (this.remote) {
          this.$emit('search', this.selectedLabel);
          this.visible = false;
          this.hoverIndex = -1;
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
          if (!this.remote) {
            this.$refs.reference.$el.querySelector('input').blur();
            this.handleIconHide();
            this.resetHoverIndex();
          }
        } else {
          // 如果输入框的值为空就调historyMethod(), 否则就调用remoteMethod()
          if (this.selectedLabel.length === 0) {
            this.historyMethod();
          }
          this.handleIconShow();
          this.resetInputWidth();
          this.resetDropdownPosition();
        }
      },
      value(val) {
        this.setSelected(val);
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
        if (this.remote) {
          return 'icon-search fill-icon-btn';
        }
        return this.clearable && this.inputHovering && this.value !== ''
          ? 'icon-fill-close select-delete-icon'
          : this.icon;
      },
      emptyText() {
        if (this.loading) {
          return '加载中';
        }
        return '无数据';
      }
    },
    components: {
      FjInput,
      FjSelectDropdown
    },
    directives: { Clickoutside }
  };
</script>
