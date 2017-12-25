<template>
  <div class="fj-date-picker" v-clickoutside="handleClose">
    <fj-input
      v-if="type!=='datetimerange'"
      :size="size"
      :theme="theme"
      :readonly="true"
      :value="displayValue"
      :icon="iconClass"
      :placeholder="placeholder"
      @on-icon-click="handleIconClick"
      @focus="handleFocus"
      @mouseenter.native="inputHovering = true"
      @mouseleave.native="inputHovering = false" />
    <div
      :class="['date-range-picker-wrap clearfix', `date-range-picker-${theme}`, { 'focus': isShowPanel }]"
      v-if="type==='datetimerange' && direction === 'vertical'"
      @mouseenter="inputHovering = true"
      @mouseleave="inputHovering = false"
      @click="handleFocus">
      <div class="date-range-value-wrap">
        <span class="date-range-value-item" :class="{'placeholder':!displayValue[0]}">{{ displayValue[0] || '开始时间' }}</span>
        <span class="date-range-value-item" :class="{'placeholder':!displayValue[1]}">{{ displayValue[1] || '结束时间' }}</span>
      </div>
      <div class="date-range-icon-wrap">
        <i :class="iconClass" class="iconfont date-range-date-icon" @click.stop="handleIconClick"></i>
      </div>
    </div>
    <div
      :class="['date-range-picker-wrap-horizontal clearfix', `date-range-picker-${theme}`, { 'focus': isShowPanel }]"
      v-if="type==='datetimerange' && direction === 'horizontal'"
      @mouseenter="inputHovering = true"
      @mouseleave="inputHovering = false"
      @click="handleFocus">
      <div class="date-range-value-wrap-horizontal">
        <span class="date-range-value-item-horizontal" :class="{'placeholder':!displayValue[0]}">{{ displayValue[0] || '开始时间' }}</span>
        -
        <span class="date-range-value-item-horizontal" :class="{'placeholder':!displayValue[1]}">{{ displayValue[1] || '结束时间' }}</span>
      </div>
      <div class="date-range-icon-wrap-horizontal">
        <i :class="iconClass" class="iconfont date-range-date-icon-horizontal" @click.stop="handleIconClick"></i>
      </div>
    </div>
    <!-- <date-panel
      v-if="isShowPanel&&type==='datetime'"
      :defaultValue="value"
      :type="type"
      :format="format"
      :pickerPosition="pickerPosition"
      @pick="handleDatePick" />
    <date-range-panel
      v-if="isShowPanel&&type==='datetimerange'"
      :defaultValue="value"
      :type="type"
      :format="format"
      :pickerPosition="pickerPosition"
      @pick="handleDateRangePick"></date-range-panel> -->
  </div>
</template>

<script>
  import Vue from 'vue';
  import FjInput from '../../input';
  import DatePanel from './panel/datePanel';
  import DateRangePanel from './panel/dateRangePanel';
  import Clickoutside from '../../../utils/clickoutside';
  import { isDate, formatDate } from './util';
  import { getPosition } from '../../../utils/position';

  export default {
    name: 'FjDatePicker',
    props: {
      parentEl: {},
      size: String,
      placeholder: String,
      pickerPosition: String,
      theme: {
        type: String,
        default: 'stroke'
      },
      type: {
        type: String,
        default: 'datetime'
      },
      direction: {
        type: String,
        default: 'vertical'
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
      },
      value: {}
    },
    data() {
      return {
        selfModel: this.type === 'datetimerange' ? [null, null] : '',
        inputHovering: false,
        isShowPanel: false
      };
    },
    computed: {
      iconClass() {
        if (this.type !== 'datetimerange') {
          return this.inputHovering && this.displayValue !== '' ? 'icon-fill-close datetime-date-icon' : 'icon-date datetime-date-icon';
        }
        return this.inputHovering && this.displayValue[0] ? 'icon-fill-close datetime-date-icon' : 'icon-date datetime-date-icon';
      },
      displayValue() {
        if (this.type !== 'datetimerange') {
          return formatDate(this.selfModel, this.format);
        }
        return [formatDate(this.selfModel[0], this.format),
          formatDate(this.selfModel[1], this.format)];
      }
    },
    watch: {
      value: {
        immediate: true,
        handler(val) {
          if (this.type !== 'datetimerange') {
            this.selfModel = isDate(val) ? new Date(val) : val;
          } else {
            this.selfModel = val;
          }
        }
      },
      isShowPanel(val) {
        if (val) {
          this.showPicker();
        } else {
          this.hidePicker();
        }
      }
    },
    methods: {
      handleIconClick(e) {
        if (this.iconClass.indexOf('icon-fill-close') > -1) {
          this.deleteValue(e);
        } else {
          this.isShowPanel = !this.isShowPanel;
        }
      },
      deleteValue(e) {
        e.stopPropagation();
        this.selfModel = this.type === 'datetimerange' ? [null, null] : '';
        this.$emit('input', this.selfModel);
        this.isShowPanel = false;
      },
      handleFocus() {
        this.isShowPanel = true;
      },
      handleClose(target) {
        if (this.picker && this.picker.$el.contains(target)) return;
        this.isShowPanel = false;
      },
      handleDatePick(val) {
        this.isShowPanel = false;
        if (val) {
          this.selfModel = val;
          this.$emit('input', val);
        }
      },
      showPicker() {
        if (!this.picker) {
          this.mountPicker();
        }

        this.picker.defaultValue = this.value;
        const { pickerPosition, transitionName } = this.getPickerPosition();
        this.picker.pickerPosition = pickerPosition;
        this.picker.transitionName = transitionName;
        this.picker.visible = true;
      },
      hidePicker() {
        if (this.picker) {
          this.picker.visible = false;
        }
      },
      mountPicker() {
        this.panel.defaultValue = this.value;
        this.picker = new Vue(this.panel).$mount();
        this.picker.type = this.type;
        this.picker.format = this.format;
        this.picker.$on('pick', this.handleDatePick);
        document.body.appendChild(this.picker.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updatePickerPosition);
      },
      updatePickerPosition() {
        if (this.picker && this.picker.visible) {
          const { pickerPosition, transitionName } = this.getPickerPosition();
          this.picker.pickerPosition = pickerPosition;
          this.picker.transitionName = transitionName;
        }
      },
      getPickerPosition() {
        const pickerPosition = {};
        const inputPosition = getPosition(this.$el);
        const top = this.$el.getBoundingClientRect().top;
        const bottom = window.innerHeight - top;
        const inputHeight = this.$el.getBoundingClientRect().height;
        const inputWidth = this.$el.getBoundingClientRect().width;
        // const pickerHeight = this.picker.$el.getBoundingClientRect().height;
        const pickerHeight = this.type === 'date' ? 314 : 343;
        let marginTop = window.getComputedStyle(this.picker.$el).marginTop || 0;
        marginTop = parseInt(marginTop, 10);
        let transitionName = 'fj-zoom-in-top';
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        if (bottom < top) {
          pickerPosition.top = `${inputPosition.y - pickerHeight - (marginTop * 2) - parentElScrollTop}px`;
          transitionName = 'fj-zoom-in-bottom';
        } else {
          pickerPosition.top = `${inputPosition.y + inputHeight}px`;
        }
        if (this.pickerPosition === 'right') {
          pickerPosition.left = `${inputPosition.x + inputWidth}px`;
        } else {
          pickerPosition.left = `${inputPosition.x}px`;
        }
        return { pickerPosition, transitionName };
      }
    },
    created() {
      if (this.type === 'datetimerange') {
        this.panel = DateRangePanel;
      } else {
        this.panel = DatePanel;
      }
    },
    beforeDestroy() {
      if (this.picker) {
        const parentEl = this.parentEl || document.body;
        parentEl.removeEventListener('scroll', this.updatePickerPosition);
        document.body.removeChild(this.picker.$el);
      }
    },
    directives: { Clickoutside },
    components: {
      FjInput
    }
  };
</script>
