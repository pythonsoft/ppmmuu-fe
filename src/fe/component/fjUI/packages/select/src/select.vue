<template>
  <div class="fj-select" :class="[theme ? `fj-select-${theme}` : '', size ? `fj-select-${size}` : '']" v-clickoutside="handleClose">
    <div
      v-if="multiple"
      ref="multipleReference"
      :class="[`fj-select-inner-${theme}`, visible ? `active` : '']"
      @click="visible = true">
      <i class="fj-input-icon iconfont" :class="iconClass" @click.stop="handleIconClick"></i>
      <span v-if="selectedLabel.length === 0" class="fj-select-placeholder">{{ placeholder }}</span>
      <fj-tag
        v-else
        v-for="label in selectedLabel"
        :key="`fj-select-multiple-value-${label}`"
        type="primary"
        :closable="true"
        @close="(e) => {handleCloseTag(e, label)}">{{ getLabel(label) }}</fj-tag>
    </div>
    <fj-input
      v-else
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
    <fj-select-dropdown ref="popper" v-show="visible" :multiple="multiple">
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
  import FjTag from '../../tag';
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
      multiple: Boolean,
      loading: Boolean,
      disabled: Boolean,
      clearable: Boolean,
      placeholder: String,
      size: String,
      theme: {
        type: String,
        default: 'stroke'
      },
      value: {
        require: true
      },
      parentEl: {},
      controlLength: {
        type: Number,
        default: 0
      }
    },
    data() {
      return {
        options: [],
        selectedLabel: this.multiple ? [] : '',
        icon: 'icon-fill-bottom',
        visible: false,
        inputHovering: false,
        hoverIndex: -1
      };
    },
    created() {
      this.setSelected(this.value);
      this.$on('option-click', this.handleOptionClick);
    },
    mounted() {
      this.reference = this.multiple ? this.$refs.multipleReference : this.$refs.reference.$el;
    },
    beforeDestroy() {
    },
    methods: {
      inputValueChange(val) {
        this.$emit('input', val);
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-change', val);
        }
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
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-change', '');
        }
        this.visible = false;
      },
      handleCloseTag(e, label) {
        e.stopPropagation();
        let tagValue = '';
        for (let i = 0, len = this.options.length; i < len; i++) {
          const option = this.options[i];
          if (option.label === label) {
            tagValue = option.value;
            break;
          }
        }
        const value = this.value.slice(0);
        const index = value.indexOf(tagValue);
        if (index > -1) {
          value.splice(index, 1);
        }
        this.$emit('input', value);
        if (this.$parent.$options.name === 'FjFormItem') {
          this.$parent.$emit('form-change', value);
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
        if (this.multiple) {
          const value = this.value.slice(0);
          const index = value.indexOf(option.value);
          if (index > -1) {
            value.splice(index, 1);
          } else {
            value.push(option.value);
          }
          this.$emit('input', value);
          if (this.$parent.$options.name === 'FjFormItem') {
            this.$parent.$emit('form-change', value);
          }
        } else {
          this.$emit('input', option.value);
          if (this.$parent.$options.name === 'FjFormItem') {
            this.$parent.$emit('form-change', option.value);
          }
          this.visible = false;
          // 如果为remote就触发搜索函数
          if (this.remote) {
            this.$emit('search', this.selectedLabel);
            this.hoverIndex = -1;
          }
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
          if (this.multiple) {
            this.selectedLabel = option.map(item => {
              return item.label;
            });
          } else {
            if (option) {
              this.selected = option;
              this.selectedLabel = option.label;
            } else {
              this.selectedLabel = this.remote ? inputVal : '';
            }
          }
      },
      selectOption() {
        if (this.visible && this.options[this.hoverIndex]) {
          this.handleOptionClick(this.options[this.hoverIndex]);
        }
        // 如果为remote就触发搜索函数
        if (this.remote) {
          this.$emit('search', this.selectedLabel);
          this.visible = false;
          this.hoverIndex = -1;
          return;
        }
      },
      resetHoverIndex() {
        setTimeout(() => {
          this.hoverIndex = this.multiple ? -1 : this.options.indexOf(this.selected);
        }, 300);
      },
      getOption(value) {
        let option;
        if (this.multiple && (value instanceof Array)) {
          option = [];
          for (let i = this.options.length - 1; i >= 0; i--) {
            const item = this.options[i];
            const index = value.indexOf(item.value);
            if (index > -1) {
              option[index] = item;
            }
          }
        } else {
          for (let i = this.options.length - 1; i >= 0; i--) {
            const item = this.options[i];
            if (item.value === value) {
              option = item;
              break;
            }
          }
        }

        return option;
      },
      getLabel(label){
        if(this.controlLength === 0){
          return label;
        }else {
          const len = label.length;

          let realLength = 0;
          let charCode = -1;

          for (let i = 0; i < len; i++) {
            charCode = label.charCodeAt(i);
            if (charCode >= 0 && charCode <= 128) {
              realLength += 1;
            } else {
              realLength += 2;
            }
          }
          if(realLength > this.controlLength && len > this.controlLength){
            label = label.substr(0, this.controlLength);
            label += '...';
          }
          return label;
        }
      }
    },
    watch: {
      visible(val) {
        if (!val) {
          if (!this.remote) {
            if (this.reference.querySelector('input')) this.reference.querySelector('input').blur();
            this.handleIconHide();
            this.resetHoverIndex();
          }
        } else {
          // 如果输入框的值为空就调historyMethod(), 否则就调用remoteMethod()
          if (this.selectedLabel.length === 0) {
            this.historyMethod();
          }
          this.handleIconShow();
        }
      },
      value(val) {
        this.setSelected(val);
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
      FjSelectDropdown,
      FjTag
    },
    directives: { Clickoutside }
  };
</script>
