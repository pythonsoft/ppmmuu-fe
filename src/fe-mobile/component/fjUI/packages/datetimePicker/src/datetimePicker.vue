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
      value: null,
      keys: {
        type: Array,
        default() {
          return ['year', 'month', 'date', 'hour', 'min', 'sec'];
        }
      }
    },
    data() {
      return {
        currentValue: this.value ? new Date(this.value) : new Date(this.startDate),
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
        // 包含时分秒
        if (values.length > 3) {
          this.currentValue = new Date(this.currentValue.setHours(values[3], values[4], values[5]));
        }
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
