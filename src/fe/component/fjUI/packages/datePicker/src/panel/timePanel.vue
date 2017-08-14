<template>
  <transition name="fj-zoom-in-top">
    <div class="fj-time-panel">
      <div class="fj-time-panel-body clearfix">
        <ul ref="hoursList">
          <li
            ref="hoursItem"
            v-for="(disabled, hour) in hoursList"
            :key="`hour${hour}`"
            class="fj-time-panel-item"
            :class="{'active' : hour === hours}"
            @click="handleSelect('hours', hour)">{{ fillupZero(hour) }}</li>
        </ul>
        <ul ref="minutesList">
          <li
            ref="minutesItem"
            v-for="(disabled, minute) in minutesList"
            :key="`minute${minute}`"
            class="fj-time-panel-item"
            :class="{'active' : minute === minutes}"
            @click="handleSelect('minutes', minute)">{{ fillupZero(minute) }}</li>
        </ul>
        <ul ref="secondsList">
          <li
            ref="secondsItem"
            v-for="(disabled, second) in secondsList"
            :key="`second${second}`"
            class="fj-time-panel-item"
            :class="{'active' : second === seconds}"
            @click="handleSelect('seconds', second)">{{ fillupZero(second) }}</li>
        </ul>
      </div>
      <div class="fj-time-panel-footer">
        <fj-button type="text" size="mini" @click="handleCancel">取消</fj-button>
        <fj-button size="mini" @click="handleConfirm">确定</fj-button>
      </div>
    </div>
  </transition>
</template>
<script>
  import { scrollIntoViewTop } from '../../../../utils/scrollIntoView';
  import { fillupZero } from '../util';

  export default {
    props: {
      date: {
        default() {
          return new Date();
        }
      },
      visible: Boolean
    },
    data() {
      const hoursList = [];
      const minutesList = [];
      const secondsList = [];
      for (let i = 0; i < 24; i++) {
        hoursList[i] = false;
      }
      for (let i = 0; i < 60; i++) {
        minutesList[i] = false;
      }
      for (let i = 0; i < 60; i++) {
        secondsList[i] = false;
      }
      return {
        hoursList: hoursList,
        minutesList: minutesList,
        secondsList: secondsList,
        currentDate: this.date || new Date(),
        hours: 0,
        minutes: 0,
        seconds: 0
      };
    },
    watch: {
      visible(val) {
        if (val) {
          this.scrollIntoSelectedHours(this.hours);
          this.scrollIntoSelectedMinutes(this.minutes);
          this.scrollIntoSelectedSeconds(this.seconds);
        }
      },
      date(val) {
        this.currentDate = val;
      },
      currentDate(val) {
        this.hours = val ? val.getHours() : 0;
        this.minutes = val ? val.getMinutes() : 0;
        this.seconds = val ? val.getSeconds() : 0;
        this.scrollIntoSelectedHours(this.hours);
        this.scrollIntoSelectedMinutes(this.minutes);
        this.scrollIntoSelectedSeconds(this.seconds);
      }
    },
    created() {
      this.hours = this.currentDate.getHours();
      this.minutes = this.currentDate.getMinutes();
      this.seconds = this.currentDate.getSeconds();
    },
    methods: {
      scrollIntoSelectedHours(index) {
        const hoursContainer = this.$refs.hoursList;
        const hoursSelected = this.$refs.hoursItem[index];
        scrollIntoViewTop(hoursContainer, hoursSelected);
      },
      scrollIntoSelectedMinutes(index) {
        const minutesContainer = this.$refs.minutesList;
        const minutesSelected = this.$refs.minutesItem[index];
        scrollIntoViewTop(minutesContainer, minutesSelected);
      },
      scrollIntoSelectedSeconds(index) {
        const secondsContainer = this.$refs.secondsList;
        const secondsSelected = this.$refs.secondsItem[index];
        scrollIntoViewTop(secondsContainer, secondsSelected);
      },
      fillupZero(v) {
        return fillupZero(v);
      },
      handleCancel() {
        this.$emit('pick');
      },
      handleConfirm() {
        const tempDate = new Date(this.date);
        tempDate.setHours(this.hours, this.minutes, this.seconds);
        this.$emit('pick', tempDate);
      },
      handleSelect(type, itemValue) {
        this[type] = itemValue;
        if (type === 'hours') {
          this.scrollIntoSelectedHours(itemValue);
        } else if (type === 'minutes') {
          this.scrollIntoSelectedMinutes(itemValue);
        } else if (type === 'seconds') {
          this.scrollIntoSelectedSeconds(itemValue);
        }
      }
    }
  };
</script>
