<template>
  <table class="fj-year-table">
    <tbody @click="handleClick">
      <tr v-for="row in tableData" class="fj-year-row">
        <td v-for="cell in row" class="fj-year-cell">
          <a :class="['fj-year-item', cell.type, {'selected-year': year === cell.value}]">{{ cell.text }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    props: {
      year: {},
      date: {
        default() {
          return new Date();
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
        const startYear = (Math.floor(this.year / 10) * 10) - 1;

        for (let row = 0; row < 3; row++) {
          tableData[row] = [];
          for (let col = 0; col < 4; col++) {
            const index = (row * 4) + col;
            const cell = { text: startYear + index, value: startYear + index };
            if (index === 0) {
              cell.type = 'prev-year-range';
            } else if (index === 11) {
              cell.type = 'next-year-range';
            } else {
              cell.type = 'normal';
            }

            tableData[row].push(cell);
          }
        }
        return tableData;
      }
    },
    methods: {
      handleClick(e) {
        const target = e.target;
        if (target.tagName !== 'A') return;

        const cellIndex = target.parentNode.cellIndex;
        const rowIndex = target.parentNode.parentNode.rowIndex;
        const cell = this.tableData[rowIndex][cellIndex];

        const newDate = new Date(this.date);
        const className = target.className;
        if (className.indexOf('normal') > -1) {
          newDate.setFullYear(Number(cell.value));
          this.$emit('pick', newDate);
        }
      }
    }
  };
</script>
