<template>
  <transition :name="transitionName">
    <div
      class="fj-date-range-panel"
      :style="pickerPosition"
      v-show="visible">

      <div v-if="type==='datetimerange'" class="fj-datetime-panel-header clearfix">
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择日期" :value="minVisibleDate" :readonly="true" />
        </div>
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择时间" :value="minVisibleTime" :readonly="true" @focus="handleFocusTimeInput('min')" />
          <time-panel
            v-show="isShowMinTimePanel"
            :visible="isShowMinTimePanel"
            :date="minDate"
            @pick="handleMinTimePick"></time-panel>
        </div>
        <i class="iconfont icon-arrow-right fj-date-range-icon"></i>
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择日期" :value="maxVisibleDate" :readonly="true" />
        </div>
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择时间" :value="maxVisibleTime" :readonly="true" @focus="handleFocusTimeInput('max')" />
          <time-panel
            v-show="isShowMaxTimePanel"
            :visible="isShowMaxTimePanel"
            :date="maxDate"
            @pick="handleMaxTimePick"></time-panel>
        </div>
      </div>

      <div class="fj-date-range-part">
        <div class="fj-date-panel-header clearfix">
          <button @click="minPrevYear" class="iconfont icon-d-arrow-left fj-date-panel-prev-year-btn"></button>
          <button v-show="minCurrentView === 'date'" @click="minPrevMonth" class="iconfont icon-arrow-left fj-date-panel-prev-month-btn"></button>

          <span v-show="minCurrentView !== 'year'" class="" @click="">{{ `${minYear}年` }}</span><!--
          --><span v-show="minCurrentView === 'date'" class="" @click="">{{ `${minMonth + 1}月` }}</span>

          <button
            v-show="(minYear === maxYear - 1 && minMonth < maxMonth) || minYear < maxYear - 1"
            @click="minNextYear"
            class="iconfont icon-d-arrow-right fj-date-panel-next-year-btn"></button>
          <button
            v-show="minCurrentView === 'date' && (minYear < maxYear || minMonth < maxMonth - 1)"
            @click="minNextMonth"
            class="iconfont icon-arrow-right fj-date-panel-next-month-btn"></button>
        </div>
        <div class="fj-date-panel-body">
          <date-table
            type="range"
            v-show="minCurrentView === 'date'"
            :year="minYear"
            :month="minMonth"
            :date="date"
            :min-date="minDate"
            :max-date="maxDate"
            :rangeState="rangeState"
            @changerange="handleChangeRange"
            @pick="handleRangePick"></date-table>
          <month-table
            v-show="minCurrentView === 'month'"
            :month="minMonth"
            :date="minDate"
            :min-date="minDate"
            :max-date="maxDate"
            @pick="handleMinMonthPick"></month-table>
            <year-table
              v-show="minCurrentView === 'year'"
              :year="minYear"
              :date="minDate"
              @pick="handleMinYearPick"></year-table>
        </div>
      </div>

      <div class="fj-date-range-part">
        <div class="fj-date-panel-header clearfix">
          <button
            v-show="(minYear === maxYear - 1 && minMonth < maxMonth) || minYear < maxYear - 1"
            @click="maxPrevYear"
            class="iconfont icon-d-arrow-left fj-date-panel-prev-year-btn"></button>
          <button
            v-show="maxCurrentView === 'date' && (minYear < maxYear || minMonth < maxMonth - 1)"
            @click="maxPrevMonth"
            class="iconfont icon-arrow-left fj-date-panel-prev-month-btn"></button>

          <span v-show="maxCurrentView !== 'year'" class="" @click="">{{ `${maxYear}年` }}</span><!--
          --><span v-show="maxCurrentView === 'date'" class="" @click="">{{ `${maxMonth + 1}月` }}</span>

          <button @click="maxNextYear" class="iconfont icon-d-arrow-right fj-date-panel-next-year-btn"></button>
          <button v-show="maxCurrentView === 'date'" @click="maxNextMonth" class="iconfont icon-arrow-right fj-date-panel-next-month-btn"></button>
        </div>
        <div class="fj-date-panel-body">
          <date-table
            type="range"
            v-show="maxCurrentView === 'date'"
            :year="maxYear"
            :month="maxMonth"
            :date="rightDate"
            :min-date="minDate"
            :max-date="maxDate"
            :rangeState="rangeState"
            @changerange="handleChangeRange"
            @pick="handleRangePick"></date-table>
          <month-table
            v-show="maxCurrentView === 'month'"
            :month="maxMonth"
            :date="maxDate"
            :min-date="minDate"
            :max-date="maxDate"
            @pick="handleMaxMonthPick"></month-table>
            <year-table
              v-show="maxCurrentView === 'year'"
              :year="maxYear"
              :date="maxDate"
              @pick="handleMaxYearPick"></year-table>
        </div>
      </div>
      <div class="clearfix"></div>
      <div class="fj-date-panel-footer">
        <fj-button type="text" size="mini" @click="handleClear">清空</fj-button>
        <fj-button size="mini" @click="handleConfirm">确定</fj-button>
      </div>
    </div>
  </transition>
</template>
<script>
  import DateTable from './dateTable';
  import MonthTable from './monthTable';
  import YearTable from './yearTable';
  import TimePanel from './timePanel';
  import { formatDate } from '../util';

  export default {
    props: {
      pickerPosition: {},
      type: {
        type: String,
        default: 'datetimerange'
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD'
      },
      defaultValue: {},
      visible: Boolean,
      transitionName: {
        type: String,
        default: 'fj-zoom-in-top'
      }
    },
    data() {
      return {
        top: 0,
        isShowMinTimePanel: false,
        isShowMaxTimePanel: false,
        minCurrentView: 'date',
        maxCurrentView: 'date',
        minYear: null,
        minMonth: null,
        maxYear: null,
        maxMonth: null,
        minDate: this.defaultValue && this.defaultValue.length > 0 ? new Date(this.defaultValue[0]) : '',
        maxDate: this.defaultValue && this.defaultValue.length > 1 ? new Date(this.defaultValue[1]) : '',
        date: this.defaultValue && this.defaultValue.length > 0
          ? new Date(this.defaultValue[0]) : new Date(),
        rangeState: {
          selecting: false,
          currentDate: null
        }
      };
    },
    computed: {
      dateFormat() {
        return this.format.replace('HH:mm:ss', '').replace('HH:mm', '').trim();
      },
      timeFormat() {
        if (this.format.indexOf('HH') > -1 && this.format.indexOf(':ss') < 0) {
          return 'HH:mm';
        }
        return 'HH:mm:ss';
      },
      minVisibleDate() {
        return this.minDate ? formatDate(this.minDate, this.dateFormat) : '';
      },
      maxVisibleDate() {
        return this.maxDate ? formatDate(this.maxDate, this.dateFormat) : '';
      },
      minVisibleTime() {
        return this.minDate ? formatDate(this.minDate, this.timeFormat) : '';
      },
      maxVisibleTime() {
        return this.maxDate ? formatDate(this.maxDate, this.timeFormat) : '';
      },
      rightDate() {
        if (this.maxDate) {
          if (this.maxDate.getFullYear() > this.minDate.getFullYear()
            || (this.maxDate.getFullYear() === this.minDate.getFullYear()
            && this.maxDate.getMonth > this.minDate.getMonth())) {
            return new Date(this.maxDate);
          }
        }
        const rightDate = new Date(this.date);
        const month = rightDate.getMonth() + 1;
        rightDate.setMonth(month);
        return rightDate;
      }
    },
    watch: {
      defaultValue(val) {
        if (!val) {
          this.minDate = null;
          this.maxDate = null;
        }
        if (val.length > 0) {
          this.minDate = val[0] ? new Date(val[0]) : null;
          if (val.length > 1) {
            this.maxDate = val[1] ? new Date(val[1]) : null;
          }
        }
        if (this.minDate) {
          this.date = new Date(this.minDate);
        }
      },
      date(val) {
        this.minYear = val.getFullYear();
        this.minMonth = val.getMonth();
      },
      rightDate(val) {
        this.maxYear = val.getFullYear();
        this.maxMonth = val.getMonth();
      }
    },
    methods: {
      handleChangeRange(val) {
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        this.rangeState = val.rangeState;
      },
      minPrevYear() {
        if (this.minCurrentView === 'year') {
          this.minYear -= 10;
        } else {
          this.minYear -= 1;
        }
      },
      minNextYear() {
        if (this.minCurrentView === 'year') {
          this.minYear += 10;
        } else {
          this.minYear += 1;
        }
      },
      minPrevMonth() {
        this.minMonth -= 1;
        if (this.minMonth < 0) {
          this.minMonth = 11;
          this.minYear -= 1;
        }
      },
      minNextMonth() {
        this.minMonth += 1;
        if (this.minMonth > 11) {
          this.minMonth = 0;
          this.minYear += 1;
        }
      },
      maxPrevYear() {
        if (this.maxCurrentView === 'year') {
          this.maxYear -= 10;
        } else {
          this.maxYear -= 1;
        }
      },
      maxNextYear() {
        if (this.maxCurrentView === 'year') {
          this.maxYear += 10;
        } else {
          this.maxYear += 1;
        }
      },
      maxPrevMonth() {
        this.maxMonth -= 1;
        if (this.maxMonth < 0) {
          this.maxMonth = 11;
          this.maxYear -= 1;
        }
      },
      maxNextMonth() {
        this.maxMonth += 1;
        if (this.maxMonth > 11) {
          this.maxMonth = 0;
          this.maxYear += 1;
        }
      },
      handleConfirm() {
        this.$emit('pick', [this.minDate, this.maxDate]);
      },
      handleMinYearPick() {},
      handleMinMonthPick() {},
      handleRangePick(val) {
        if (this.minDate === val.minDate && this.maxDate === val.maxDate) return;
        this.minDate = val.minDate;
        this.maxDate = val.maxDate;
        // console.log('handleRangePick', val);
      },
      handleMaxYearPick() {},
      handleMaxMonthPick() {},
      handleClear() {
        this.minDate = null;
        this.maxDate = null;
        this.date = new Date();
      },
      handleFocusTimeInput(type) {
        if (!this.minDate) {
          this.minDate = new Date();
        }
        if (!this.maxDate) {
          this.maxDate = new Date();
        }
        if (type === 'min') {
          this.isShowMinTimePanel = true;
        } else if (type === 'max') {
          this.isShowMaxTimePanel = true;
        }
      },
      handleMinTimePick(val) {
        this.isShowMinTimePanel = false;
        if (val) {
          this.minDate = val;
          if (this.maxDate < this.minDate) {
            this.maxDate = this.minDate;
          }
        }
      },
      handleMaxTimePick(val) {
        this.isShowMaxTimePanel = false;
        if (val) {
          this.maxDate = val;
          if (this.maxDate < this.minDate) {
            this.minDate = this.maxDate;
          }
        }
      }
    },
    mounted() {
      // const parentHeight = this.$parent.$el.getBoundingClientRect().height;
      // this.top = parentHeight;

      this.minYear = this.date.getFullYear();
      this.minMonth = this.date.getMonth();
      this.maxYear = this.rightDate.getFullYear();
      this.maxMonth = this.rightDate.getMonth();
    },
    components: {
      TimePanel,
      DateTable,
      MonthTable,
      YearTable
    }
  };
</script>
