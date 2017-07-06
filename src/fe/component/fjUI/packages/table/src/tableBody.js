export default {
  render(h) {
    return (
      <tbody>
        {
          this.data.map((row, rowIndex) => {
            let className = rowIndex % 2 === 1 ? 'fj-table-striped' : null;
            if (this.highlight && row === this.store.states.currentRow) {
              className = className ? `${className} fj-current-row` : 'fj-current-row';
            }
            return (
              <tr
                key={this.table.name ? this.table.name + rowIndex : rowIndex}
                class={className}
                on-click={() => { this.handleClick(row); }}
              >
                {
                  this.columns.map((column, cellIndex) => {
                    return (
                      <td style={{ textAlign: column.align }}>
                        {column.renderCell(h, { row, column, rowIndex, store: this.store })}
                      </td>
                    );
                  })
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
    highlight: Boolean
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
      this.store.setCurrentRow(row);
    }
  }
};
