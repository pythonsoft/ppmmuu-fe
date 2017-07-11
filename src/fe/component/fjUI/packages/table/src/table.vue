<template>
  <table class="fj-table">
    <div class="hidden-column"><slot></slot></div>
    <thead>
      <tr>
        <th v-for="column in store.states.columns" :style="{width: column.width + 'px', 'text-align': column.align}">
          <div v-if="column.type === 'selection'">
            <fj-checkbox :value="store.states.isAllSelected" @input="toggleAllSelection" />
          </div>
          <div v-else>{{column.label}}</div>
        </th>
      </tr>
    </thead>
    <table-body :store="store" :highlight="highlightCurrentRow"></table-body>
    <tr v-if="!data || data.length === 0">
      <td class="fj-table-empty-block" :colspan="store.states.columns.length">{{emptyText}}</td>
    </tr>
  </table>
</template>
<script>
  import FjCheckbox from '../../checkbox';
  import TableBody from './tableBody';

  export default {
    name: 'FjTable',
    props: {
      name: String,
      data: {
        type: Array,
        default() {
          return [];
        }
      },
      emptyText: {
        type: String,
        default: '暂无数据'
      },
      highlightCurrentRow: Boolean
    },
    data() {
      const store = {};
      store.states = {
        columns: [],
        data: this.data,
        isAllSelected: false,
        selection: [],
        currentRow: null
      };
      store.insertColumn = (column) => {
        this.store.states.columns.push(column);
      };
      store.isSelected = row => (this.store.states.selection).indexOf(row) > -1;
      store.rowSelectedChanged = (row) => {
        this.store.toggleRowSelection(row);
        this.store.updateAllSelected();
        const states = this.store.states;
        this.$emit('selection-change', states.selection);
      };
      store.updateAllSelected = () => {
        const states = this.store.states;
        if (states.selection.length === this.data.length) {
          states.isAllSelected = true;
        } else {
          states.isAllSelected = false;
        }
      };
      store.toggleAllSelection = () => {
        const states = this.store.states;
        const data = states.data;
        const value = !states.isAllSelected;
        const toggleRowSelection = this.store.toggleRowSelection;
        data.forEach((item, index) => {
          toggleRowSelection(item, value);
        });
        this.store.updateAllSelected();
        this.$emit('selection-change', states.selection);
      };
      store.toggleRowSelection = (row, selected) => {
        const selection = this.store.states.selection;
        const index = selection.indexOf(row);
        if (typeof selected === 'undefined') {
          if (index === -1) {
            selection.push(row);
          } else {
            selection.splice(index, 1);
          }
        } else {
          if (selected && index === -1) {
            selection.push(row);
          } else if (!selected && index > -1) {
            selection.splice(index, 1);
          }
        }
      };
      store.clearSelection = () => {
        const states = this.store.states;
        states.isAllSelected = false;
        states.selection = [];
        this.$emit('selection-change', states.selection);
      };
      store.setCurrentRow = (row) => {
        const states = this.store.states;
        const oldCurrentRow = states.currentRow;
        states.currentRow = row;
        if (oldCurrentRow !== row) {
          this.$emit('current-change', row, oldCurrentRow);
        }
      };
      return {
        store
      };
    },
    mounted() {
    },
    watch: {
      data(val) {
        this.store.states.data = val;
        this.clearSelection();
      }
    },
    methods: {
      toggleAllSelection() {
        this.store.toggleAllSelection();
      },
      clearSelection() {
        this.store.clearSelection();
      }
    },
    components: {
      FjCheckbox,
      TableBody
    }
  };
</script>
