<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    :width="width"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog">
    <fj-table style="font-size: 12px;" :data="parentInfoMap" name="table" ref="table">
      <fj-table-column prop="key" width="100" label="key"></fj-table-column>
      <fj-table-column prop="value" label="value">
        <template slot-scope="props">
            <span style="word-break: break-all;word-wrap: break-word;">
              {{ props.row.value }}
            </span>
        </template>
      </fj-table-column>
    </fj-table>
  </fj-slide-dialog>
</template>
<script>
  import utils from '../../../common/utils';

  export default {
    name: 'downloadTaskDialog',
    props: {
      parentInfo: { type: Object },
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible(v) {
        this.display = v;
        if (this.display) {
          this.formatParentInfoMap(this.parentInfo);
        } else {
          this.parentInfoMap = [];
        }
      }
    },
    data() {
      return {
        title: '任务详细信息',
        display: false,
        width: '740px',

        parentInfoMap: [],
      };
    },
    created() {
    },
    methods: {
      cancelClick() {
        this.$emit('update:visible', false);
      },
      handleOpenSlideDialog() {
      },
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      handleChildTaskOpen() {},
      handleChildTaskClose() {

      },
      formatParentInfoMap(info) {
        const arr = [];

        for(let k in info) {
          arr.push({ key: k, value: JSON.stringify(info[k]) });
        }

        this.parentInfoMap = arr;
      },
    }
  };
</script>
