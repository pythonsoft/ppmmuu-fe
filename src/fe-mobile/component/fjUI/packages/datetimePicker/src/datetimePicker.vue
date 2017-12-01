<template>
  <transition name="fj-picker" :duration="300">
    <div v-show="visible" ref="picker">
      <div class="fj-picker-mask" @click="cancel"></div>
      <div class="fj-picker-popup">
        <div class="fj-picker-toolbar clearfix">
          <span class="fj-datetime-picker-cancel" @touchstart="" @click="cancel">取消选择</span>
          <span class="fj-datetime-picker-confirm" @touchstart="" @click="submit">确定</span>
        </div>
        <div class="fj-picker-content">
          <picker-col v-for="(col, index) in cols" :col="col" :value="values[index]" :value-key="keys[index]" :unit="units[index]" :key="`picker-col-${index}`" @change="value=>{handleChange(value, index)}"></picker-col>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  import { fillupZero, DAY_DURATION } from './util';
  import PickerCol from './pickerCol';

  export default {
    name: 'FjDatetimePicker',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      startDate: {
        type: Date,
        default() {
          return new Date(2000, 0, 1);
        }
      },
      endDate: {
        type: Date,
        default() {
          return new Date(new Date().getFullYear() + 10, 11, 31);
        }
      },
      value: null
    },
    data() {
      return {
        currentValue: this.value ? new Date(this.value) : new Date(this.startDate),
        keys: ['year', 'month', 'date', 'hour', 'min', 'sec'],
        units: ['年', '月', '日', '时', '分', '秒']
      }
    },
    watch: {
      value(val) {
        this.currentValue = val ? new Date(val) : new Date(this.startDate);
      }
    },
    computed: {
      cols() {
        const currentValueObj = this.dateToObj(this.currentValue);
        const startDateObj = this.dateToObj(this.startDate);
        const endDateObj = this.dateToObj(this.endDate);

        const dayCountOfMonth = this.getDayCountOfMonth(currentValueObj.year, currentValueObj.month - 1);
        const range = {
          year: [startDateObj.year, endDateObj.year],
          month: [1, 12],
          date: [1, dayCountOfMonth],
          hour: [0, 23],
          min: [0, 59],
          sec: [0, 59]
        };
        if (currentValueObj.year === startDateObj.year) {
          range.month[0] = startDateObj.month;
          if (currentValueObj.month === startDateObj.month) {
            range.date[0] = startDateObj.date;
            if (currentValueObj.date === startDateObj.date) {
              range.hour[0] = startDateObj.hour;
              if (currentValueObj.hour === startDateObj.hour) {
                range.min[0] = startDateObj.min;
                if (currentValueObj.min === startDateObj.min) {
                  range.sec[0] = startDateObj.sec;
                }
              }
            }
          }
        }
        if (currentValueObj.year === endDateObj.year) {
          range.month[1] = endDateObj.month;
          if (currentValueObj.month === endDateObj.month) {
            range.date[1] = endDateObj.date;
            if (currentValueObj.date === endDateObj.date) {
              range.hour[1] = endDateObj.hour;
              if (currentValueObj.hour === endDateObj.hour) {
                range.min[1] = endDateObj.min;
                if (currentValueObj.min === endDateObj.min) {
                  range.sec[1] = endDateObj.sec;
                }
              }
            }
          }
        }
        const keys = this.keys;
        const result = keys.map(function(key) {
          const min = range[key][0];
          const max = range[key][1];
          const unit = range[key][2];
          const item = []
          for (let i = min; i <= max; i++) {
            item.push(i);
          }
          return item;
        });
        return result;
      },
      values() {
        const obj = this.dateToObj(this.currentValue);
        const keys = this.keys;
        const result = keys.map(function(key) {
          return obj[key];
        });
        return result;
      }
    },
    methods: {
      dateToObj(date) {
        const obj = {
          year: date.getFullYear(),
          month: date.getMonth() + 1,
          date: date.getDate(),
          hour: date.getHours(),
          min: date.getMinutes(),
          sec: date.getSeconds()
        };
        return obj;
      },
      submit() {
        this.$emit('confirm', this.currentValue);
        this.$emit('update:visible', false);
      },
      cancel() {
        this.currentValue = this.value ? new Date(this.value) : new Date(this.startDate);
        this.$emit('update:visible', false);
      },
      handleChange(value, index) {
        const values = this.values;
        values[index] = value;
        this.currentValue = new Date(this.currentValue.setFullYear(values[0], values[1] - 1, values[2]));
        this.currentValue = new Date(this.currentValue.setHours(values[3], values[4], values[5]));
      },
      getDayCountOfMonth(year, month) {
        const date = new Date(year, month, 1);
        const nextDate = new Date(year, month + 1, 1);
        const ms = nextDate.getTime() - date.getTime();
        return ms / DAY_DURATION;
      },
    },
    components: {
      PickerCol
    }
  };
</script>
<style>
  @import "../../../variables.css";
  .fj-picker-mask {
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background: rgba(0, 0, 0, .4);
    z-index: var(--z-index-mask);
    transition: opacity .3s;
  }
  .fj-picker-enter .fj-picker-mask,
  .fj-picker-leave-to .fj-picker-mask {
    opacity: 0;
  }
  .fj-picker-enter .fj-picker-popup,
  .fj-picker-leave-to .fj-picker-popup {
    transform: translate(0, 100%);
  }
  .fj-picker-popup {
    position: fixed;
    right: 0;
    bottom: 0;
    left: 0;
    background: #fff;
    z-index: var(--z-index-picker);
    transform: translate(0, 0);
    transition: transform .3s;
  }
  .fj-picker-toolbar {
    height: 40px;
    line-height: 39px;
    font-size: 14px;
    color: #38B1EB;
    background-color: #F8FAFB;

    background-image: linear-gradient(180deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .fj-picker-content {
    display: flex;
    height: 276px;
  }
  .fj-datetime-picker-cancel {
    float: left;
    padding: 0 18px;
    background-color: #F8FAFB;
  }
  .fj-datetime-picker-confirm {
    float: right;
    padding: 0 18px;
    background-color: #F8FAFB;
  }
  .fj-datetime-picker-cancel:active,
  .fj-datetime-picker-confirm:active {
    opacity: .4;
  }
  .fj-picker-col {
    position: relative;
    flex: 1 1 0%;
    height: 100%;
    overflow: hidden;
    font-size: 15px;
    color: #333333;
    text-align: center;
  }
  .fj-picker-col-mask {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-image: linear-gradient(to bottom, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)), linear-gradient(to top, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));
    background-position: top, bottom;
    background-repeat: no-repeat;
    background-size: 100% 117px;
    z-index: 1;
  }
  .fj-picker-col-mask::before {
    content: '';
    position: absolute;
    top: 117px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #E2E2E2;
  }
  .fj-picker-col-mask::after {
    content: '';
    position: absolute;
    top: 158px;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: #E2E2E2;
  }
  .fj-picker-col-content {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 118px 0;
    /*transform: translate(0, -78px);*/
  }
  .fj-picker-col-item {
    height: 39px;
    line-height: 39px;
    touch-action: manipulation;
  }
</style>
