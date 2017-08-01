<template>
  <fj-slide-dialog
    :title="title"
    :visible.sync="display"
    @open="handleOpenSlideDialog"
    @close="handleCloseSlideDialog"
  >
    <div class="engine-setting">
      <div class="engine-setting-bar">
        <span class="engine-setting-bar-title">功能项</span>
        <fj-button type="info" size="mini" :disabled="isDisable" @click="exec">执行</fj-button>
      </div>
      <div class="engine-setting-list">
        <fj-table :data="tableData" name="table" ref="table" @current-change="selectionChange" highlight-current-row>
          <fj-table-column prop="name" label="名称"></fj-table-column>
          <fj-table-column prop="command" label="命令" ></fj-table-column>
          <fj-table-column prop="description" label="描述"></fj-table-column>
        </fj-table>
      </div>
    </div>
  </fj-slide-dialog>
</template>
<script>
  import './index.css';
  import utils from '../../../common/utils';

  const api = require('../../../api/engine');

  export default {
    name: 'engineProcessSlideDialog',
    components: {

    },
    props: {
      name: { type: String, default: '进程属性' },
      visible: { type: Boolean, default: false },
      vueInstance: { type: Object },
      engineInfo: { type: Object, default: {} },
      processInfo: { type: Object, default: {} }
    },
    data() {
      return {
        display: false,
        isDisable: true,
        title: '',
        tableData: [],
        actionInfo: {},
      };
    },
    watch: {
      visible(v) {
        this.display = v;
        this.listAction();
      },
      engineInfo(v) {
        this.setTitle(v.name);
        this.listAction();
      },
      processInfo(v) {
        console.log(v);
        return v;
      }
    },
    created() {
      this.setTitle(this.engineInfo.name);
    },
    methods: {
      setTitle(engineName) {
        this.title = `${this.name}-${engineName}`;
      },
      handleOpenSlideDialog() {},
      handleCloseSlideDialog() {
        this.cancelClick();
      },
      cancelClick() {
        this.$emit('update:visible', false);
      },
      exec() {
        console.log(this.actionInfo);
      },
      selectionChange(current, prev) {
        this.actionInfo = current;
        this.isDisable = false;
      },
      listAction() {
        const me = this;

        if (this.processInfo.pid) {
          const params = {
            processId: this.processInfo.pid
          };

          const arr = [];

          api.listAction({ params: params }).then((res) => {
            const len = res.data.length;
            let keys = [];

            for(let i = 0; i < len; i++) {
              keys = Object.keys(res.data[i]);
              for(let j = 0, l = keys.length; j < l; j++) {
                arr.push(res.data[i][keys[j]]);
              }
            }

            me.tableData = arr;
          }).catch((error) => {
            me.$message.error(error);
          });
        }
      },
    }
  };
</script>
