<template>
  <fj-slide-dialog
    title="参数详情"
    :visible.sync="dialogVisible"
    width="740px"
    @close="close">
    <fj-table :data="tableData">
      <fj-table-column prop="key" label="key"></fj-table-column>
      <fj-table-column prop="value" label="value"></fj-table-column>
    </fj-table>
  </fj-slide-dialog>
</template>
<script>
  export default {
    props: {
      info: {
        type: Object,
        default: {}
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        dialogVisible: false,
        tableData: []
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
        if (val) {
          this.updateTableData();
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      updateTableData() {
        const info = this.info;
        const keys = Object.keys(info);
        const values = Object.values(info);
        const tempData = keys.map((key, index) => {
          return { key: key, value: values[index] };
        });
        this.tableData = tempData;
      }
    }
  };
</script>
