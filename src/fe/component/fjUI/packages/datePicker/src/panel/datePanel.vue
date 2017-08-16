<template>
  <transition :name="transitionName">
    <div
      class="fj-date-panel"
      :style="pickerPosition"
      v-show="visible">
      <div v-if="type==='datetime'" class="fj-datetime-panel-header clearfix">
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择日期" :value="visibleDate" :readonly="true" />
        </div>
        <div class="fj-date-panel-editor-wrap">
          <fj-input size="small" placeholder="选择时间" :value="visibleTime" :readonly="true" @focus="isShowTimePanel = true" />
          <time-panel
            v-show="isShowTimePanel"
            :visible="isShowTimePanel"
            :date="date"
            @pick="handleTimePick"></time-panel>
        </div>
      </div>
      <div class="fj-date-panel-header clearfix">
        <button @click="prevYear" class="iconfont icon-d-arrow-left fj-date-panel-prev-year-btn"></button>
        <button v-show="currentView === 'date'" @click="prevMonth" class="iconfont icon-arrow-left fj-date-panel-prev-month-btn"></button>
        <span v-show="currentView === 'year'">{{ yearLabel }}</span>
        <span v-show="currentView !== 'year'" class="fj-date-panel-select" @click="currentView = 'year'">{{ `${year}年` }}</span><!--
        --><span v-show="currentView === 'date'" class="fj-date-panel-select" @click="currentView = 'month'">{{ `${month + 1}月` }}</span>
        <button @click="nextYear" class="iconfont icon-d-arrow-right fj-date-panel-next-year-btn"></button>
        <button v-show="currentView === 'date'" @click="nextMonth" class="iconfont icon-arrow-right fj-date-panel-next-month-btn"></button>
      </div>
      <div class="fj-date-panel-body">
        <date-table
          v-show="currentView === 'date'"
          :year="year"
          :month="month"
          :date="date"
          @pick="handleDatePick"></date-table>
        <month-table
          v-show="currentView === 'month'"
          :month="month"
          :date="date"
          @pick="handleMonthPick"></month-table>
          <year-table
            v-show="currentView === 'year'"
            :year="year"
            :date="date"
            @pick="handleYearPick"></year-table>
      </div>
      <div class="fj-date-panel-footer" v-show="currentView === 'date'">
        <fj-button type="text" size="mini" @click="handleChangeToNow">此刻</fj-button>
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
      pickerPosition: {
        type: String,
        default: 'left'
      },
      type: {
        type: String,
        default: 'datetime'
      },
      format: {
        type: String,
        default: 'YYYY-MM-DD HH:mm:ss'
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
        currentView: 'date',
        date: this.defaultValue ? new Date(this.defaultValue) : new Date(),
        year: null,
        month: null,
        isShowTimePanel: false
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
      visibleDate() {
        return formatDate(this.date, this.dateFormat);
      },
      visibleTime() {
        return formatDate(this.date, this.timeFormat);
      },
      yearLabel() {
        const year = this.year;
        if (!year) return '';
        const startYear = Math.floor(year / 10) * 10;
        return `${startYear}年 - ${startYear + 11}年`;
      }
    },
    watch: {
      date(val) {
        this.year = val.getFullYear();
        this.month = val.getMonth();
      },
      defaultValue(val) {
        this.date = val ? new Date(val) : new Date();
      }
    },
    mounted() {
      // const parentHeight = this.$parent.$el.getBoundingClientRect().height;
      // this.top = parentHeight;
      this.year = this.date.getFullYear();
      this.month = this.date.getMonth();
    },
    methods: {
      prevYear() {
        if (this.currentView === 'year') {
          this.year -= 10;
        } else {
          this.year -= 1;
        }
      },
      prevMonth() {
        this.month -= 1;
        if (this.month < 0) {
          this.month = 11;
          this.year -= 1;
        }
      },
      nextYear() {
        if (this.currentView === 'year') {
          this.year += 10;
        } else {
          this.year += 1;
        }
      },
      nextMonth() {
        this.month += 1;
        if (this.month > 11) {
          this.month = 0;
          this.year += 1;
        }
      },
      handleTimePick(val) {
        this.isShowTimePanel = false;
        if (val) {
          this.date = val;
        }
      },
      handleDatePick(val) {
        if (val) {
          this.date.setFullYear(val.getFullYear(), val.getMonth(), val.getDate());
          this.resetDate();
        }
      },
      handleMonthPick(val) {
        if (val) {
          this.date.setFullYear(this.year, val.getMonth());
          this.resetDate();
          this.currentView = 'date';
        }
      },
      handleYearPick(val) {
        if (val) {
          this.date.setFullYear(val.getFullYear());
          this.resetDate();
          this.currentView = 'month';
        }
      },
      resetDate() {
        this.date = new Date(this.date);
      },
      handleChangeToNow() {
        this.date = new Date();
      },
      handleConfirm() {
        this.$emit('pick', this.date);
      }
    },
    components: {
      DateTable,
      MonthTable,
      TimePanel,
      YearTable
    }
  };
</script>
