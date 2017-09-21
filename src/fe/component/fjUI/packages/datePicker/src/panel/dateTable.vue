<template>
  <table class="fj-date-table">
    <thead>
      <tr>
        <th v-for="weekDay in WEEKDAYS">{{ weekDay }}</th>
      </tr>
    </thead>
    <tbody @click="handleClick">
      <tr v-for="(row, rowIndex) in tableData" :key="`tableData-${rowIndex}`">
        <td
          v-for="(cell, colIndex) in row"
          :key="`cell-${rowIndex}-${colIndex}`"
          :class="getCellClasses(cell)"
          @mouseenter="handleMouseEnter">
          {{ cell.text }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  import { DAY_DURATION, clearHours } from '../util';

  const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

  export default {
    props: {
      type: {
        type: String,
        default: 'date'
      },
      year: {},
      month: {},
      minDate: {},
      maxDate: {},
      date: {
        default() {
          return new Date();
        }
      },
      rangeState: {
        default() {
          return {
            selecting: false,
            currentDate: null
          };
        }
      }
    },
    data() {
      return {
      };
    },
    computed: {
      tableData() {
        const tableData = [];
        const now = this.getToday();
        const firstDateOfMonth = this.getFirstDateOfMonth();
        const day = this.getFirstDayOfMonth(this.year, this.month);
        const dayCountOfLastMonth = this.getDayCountOfMonth(this.year, this.month - 1);
        const dayCountOfMonth = this.getDayCountOfMonth(this.year, this.month);
        for (let row = 0; row < 6; row++) {
          tableData[row] = [];
          for (let col = 0; col < 7; col++) {
            const cell = { type: 'normal', inRange: false, isStart: false, isEnd: false };
            const index = (row * 7) + col;
            // isToday
            const time = ((index - day) * DAY_DURATION) + firstDateOfMonth;
            cell.isToday = time === now;

            cell.value = time;

            // inRange
            if (this.type === 'range') {
              cell.inRange = time >= clearHours(this.minDate) && time <= clearHours(this.maxDate);

              cell.isStart = this.minDate && time === clearHours(this.minDate);
              cell.isEnd = this.maxDate && time === clearHours(this.maxDate);
              if (this.rangeState.selecting) {
                const currentDate = this.rangeState.currentDate;
                if (currentDate > this.minDate) {
                  cell.inRange = cell.value >= clearHours(this.minDate)
                    && cell.value <= new Date(currentDate).getTime();
                  cell.isEnd = currentDate && time === new Date(currentDate).getTime();
                  cell.isStart = this.minDate && time === clearHours(this.minDate);
                } else {
                  cell.inRange = cell.value >= new Date(currentDate).getTime()
                    && cell.value <= clearHours(this.minDate);
                  cell.isStart = currentDate && time === new Date(currentDate).getTime();
                  cell.isEnd = this.minDate && time === clearHours(this.minDate);
                }
              }
            }

            if (row === 0 && col < day) {
              cell.type = 'prev-month';
              cell.text = (dayCountOfLastMonth + 1) - (day - col);
            } else if (index - day < dayCountOfMonth) {
              cell.text = (index + 1) - day;
            } else {
              cell.type = 'next-month';
              cell.text = (index + 1) - day - dayCountOfMonth;
            }
            tableData[row].push(cell);
          }
        }
        return tableData;
      }
    },
    watch: {

    },
    created() {
      this.WEEKDAYS = WEEKDAYS;
    },
    methods: {
      getToday() {
        const now = new Date();
        now.setHours(0, 0, 0, 0);
        return now.getTime();
      },
      getFirstDateOfMonth() {
        const date = new Date(this.year, this.month, 1);
        return date.getTime();
      },
      getFirstDayOfMonth(year, month) {
        const date = new Date(year, month, 1);
        const day = date.getDay();
        return day;
      },
      getDayCountOfMonth(year, month) {
        const date = new Date(year, month, 1);
        const nextDate = new Date(year, month + 1, 1);
        const ms = nextDate.getTime() - date.getTime();
        return ms / DAY_DURATION;
      },
      markRange(maxDate = this.maxDate) {
        // const tableData = this.tableData;
        // const minDate = this.minDate;
        // console.log('markRange minDate', minDate);
        // console.log('markRange maxDate', maxDate);
        // for (let i = 0; i < tableData.length; i++) {
        //   const row = tableData[i];
        //   for (let j = 0; j < row.length; j++) {
        //     const cell = row[j];
        //     cell.inRange = cell.value >= new Date(minDate).getTime()
          //     && cell.value <= new Date(maxDate).getTime();
        //     cell.isStart = minDate && cell.value === new Date(minDate).getTime();
        //     cell.isEnd = maxDate && cell.value === new Date(maxDate).getTime();
        //   }
        // }
      },
      handleMouseEnter(e) {
        if (!this.rangeState.selecting) return;
        const target = e.target;
        // this.$emit('changerange', {
        //   minDate: this.minDate,
        //   maxDate: this.maxDate,
        //   rangeState: this.rangeState
        // });

        const cellIndex = target.cellIndex;
        const rowIndex = target.parentNode.rowIndex;
        const cell = this.tableData[rowIndex - 1][cellIndex];
        this.rangeState.currentDate = new Date(cell.value);
      },
      handleClick(e) {
        const target = e.target;
        if (target.tagName !== 'TD') return;

        const cellIndex = target.cellIndex;
        const rowIndex = target.parentNode.rowIndex;
        const cell = this.tableData[rowIndex - 1][cellIndex];

        const className = target.className;

        const newDate = new Date(this.year, this.month, 1);
        if (className.indexOf('normal') > -1) {
          newDate.setDate(Number(cell.text));
          if (this.type === 'range') {
            if (this.minDate && this.maxDate) {
              const minDate = new Date(newDate);
              const maxDate = null;
              this.$emit('pick', { minDate, maxDate });
              this.rangeState.selecting = true;
            } else if (this.minDate && !this.maxDate) {
              if (newDate >= this.minDate) {
                const maxDate = new Date(newDate);
                this.$emit('pick', { minDate: this.minDate, maxDate });
              } else {
                const maxDate = new Date(this.minDate);
                const minDate = new Date(newDate);
                this.$emit('pick', { minDate, maxDate });
              }
              this.rangeState.selecting = false;
            } else if (!this.minDate) {
              const minDate = new Date(newDate);
              const maxDate = null;
              this.$emit('pick', { minDate, maxDate });
              this.rangeState.selecting = true;
            }
            this.rangeState.currentDate = new Date(newDate);
          } else {
            this.$emit('pick', newDate);
          }
        }
      },
      getCellClasses(cell) {
        const classes = [];
        classes.push(cell.type);
        if (cell.isToday) {
          classes.push('today');
        }
        if (cell.inRange && cell.type === 'normal') {
          classes.push('in-range');
          if (cell.isStart) {
            classes.push('start-date');
          }
          if (cell.isEnd) {
            classes.push('end-date');
          }
        }

        const date = this.date.getDate();
        if (this.type === 'date') {
          if (cell.type === 'normal'
            && date === Number(cell.text)
            && this.month === this.date.getMonth()
            && this.year === this.date.getFullYear()) {
            classes.push('selected-day');
          }
        }
        return classes;
      }
    }
  };
</script>
