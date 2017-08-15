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
      :class="['date-range-picker-wrap clearfix', { 'focus': isShowPanel }]"
      v-if="type==='datetimerange'"
      @mouseenter="inputHovering = true"
      @mouseleave="inputHovering = false"
      @click="handleFocus">
      <div class="date-range-value-wrap">
        <span class="date-range-value-item" :class="{'placeholder':!displayValue[0]}">{{ displayValue[0] || '开始时间' }}</span>
        <span class="date-range-value-item" :class="{'placeholder':!displayValue[1]}">{{ displayValue[1] || '结束时间' }}</span>
      </div>
      <div class="date-range-icon-wrap">
        <i :class="iconClass" class="iconfont date-range-date-icon" @click="handleIconClick"></i>
      </div>
    </div>
    <date-panel
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
      @pick="handleDateRangePick"></date-range-panel>
  </div>
</template>

<script>
  import FjInput from '../../input';
  import DatePanel from './panel/datePanel';
  import DateRangePanel from './panel/dateRangePanel';
  import Clickoutside from '../../../utils/clickoutside';
  import { isDate, formatDate } from './util';

  export default {
    name: 'FjDatePicker',
    props: {
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
      handleClose() {
        this.isShowPanel = false;
      },
      handleDatePick(val) {
        this.isShowPanel = false;
        if (val) {
          this.selfModel = val;
          this.$emit('input', val);
        }
      },
      handleDateRangePick(val) {
        this.isShowPanel = false;
        if (val) {
          this.selfModel = val;
          this.$emit('input', val);
        }
      }
    },
    directives: { Clickoutside },
    components: {
      FjInput,
      DatePanel,
      DateRangePanel
    }
  };
</script>
