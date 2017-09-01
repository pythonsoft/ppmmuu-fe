import FjCheckbox from '../../checkbox';

export default {
  name: 'FjTableColumn',
  props: {
    align: String,
    label: String,
    prop: String,
    width: {},
    type: {
      type: String,
      default: 'default'
    }
  },
  data() {
    return {};
  },
  beforeCreate() {},
  components: {
    FjCheckbox
  },
  computed: {},
  created() {
    this.$options.render = h => h('div', this.$slots.default);
    const parent = this.$parent;
    const me = this;
    const column = {
      property: this.prop,
      label: this.label,
      type: this.type,
      align: this.align,
      width: this.width
    };
    column.renderCell = function (h, data) {
      if (me.type === 'selection') {
        return (
          <fj-checkbox
            value={data.store.isSelected(data.row)}
            size="small"
            on-input={() => { data.store.rowSelectedChanged(data.row); }}
          />
        );
      }
      if (me.$scopedSlots.default) {
        return me.$scopedSlots.default(data);
      }
      return data.row[me.prop];
    };
    this.columnConfig = column;
  },
  destroyed() {},
  watch: {
    label(val) {
      if (this.columnConfig) {
        this.columnConfig.label = val;
      }
    },
    prop(val) {
      if (this.columnConfig) {
        this.columnConfig.property = val;
      }
    },
    align(val) {
      if (this.columnConfig) {
        this.columnConfig.align = val;
      }
    },
    width(val) {
      if (this.columnConfig) {
        this.columnConfig.width = val;
      }
    }
  },
  mounted() {
    const parent = this.$parent;
    parent.store.insertColumn(this.columnConfig);
  }
};
