export default {
  render(h) {
    return (
      <tbody>
        {
          this.data.map((row, rowIndex) => {
            let className = rowIndex % 2 === 1 ? 'fj-table-striped' : null;
            let isCurrentRow = row === this.store.states.currentRow
              || this.store.states.selection.indexOf(row) > -1;
            if (this.highlightKey && this.store.states.currentRow) {
              isCurrentRow = row[this.highlightKey] === this.store.states.currentRow[this.highlightKey]
              || this.store.states.selection.indexOf(row) > -1;
            }
            if (this.highlight && isCurrentRow) {
              className = className ? `${className} fj-current-row` : 'fj-current-row';
            }
            return (
              <tr
                key={this.table.name ? this.table.name + rowIndex : rowIndex}
                class={className}
                on-click={() => { this.handleClick(row); }}
              >
                {
                  this.columns.map((column, cellIndex) => (
                    <td style={{ textAlign: column.align }}>
                      {column.renderCell(h, { row, column, rowIndex, store: this.store })}
                    </td>
                  ))
                }
              </tr>
            );
          })
        }
      </tbody>
    );
  },
  props: {
    store: {
      required: true
    },
    highlight: Boolean,
    highlightKey: String
  },
  computed: {
    table() {
      return this.$parent;
    },
    data() {
      return this.store.states.data;
    },
    columns() {
      return this.store.states.columns;
    }
  },
  data() {
    return {};
  },
  methods: {
    handleClick(row) {
      if (this.store.states.isMultiple) {
        this.store.rowSelectedChanged(row);
      } else {
        this.store.setCurrentRow(row);
      }
    }
  }
};
