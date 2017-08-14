<template>
  <table class="fj-month-table">
    <tbody @click="handleClick">
      <tr v-for="row in tableData" class="fj-month-row">
        <td v-for="cell in row" class="fj-month-cell">
          <a :class="['fj-month-item', {'selected-month': month === cell.value}]">{{ cell.text }}</a>
        </td>
      </tr>
    </tbody>
  </table>
</template>
<script>
  export default {
    props: {
      month: {},
      date: {
        default() {
          return new Date();
        }
      }
    },
    data() {
      const tableData = [];
      for (let row = 0; row < 3; row++) {
        tableData[row] = [];
        for (let col = 0; col < 4; col++) {
          const index = (row * 4) + col;
          const cell = { value: index, disabled: false };
          cell.text = `${index + 1}月`;

          tableData[row].push(cell);
        }
      }
      return {
        tableData: tableData
      };
    },
    methods: {
      handleClick(e) {
        const target = e.target;
        if (target.tagName !== 'A') return;

        const cellIndex = target.parentNode.cellIndex;
        const rowIndex = target.parentNode.parentNode.rowIndex;
        const cell = this.tableData[rowIndex][cellIndex];

        const newDate = new Date(this.date);
        newDate.setMonth(Number(cell.value));
        this.$emit('pick', newDate);
      }
    }
  };
</script>
