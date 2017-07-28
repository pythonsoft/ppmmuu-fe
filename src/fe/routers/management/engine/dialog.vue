<template>
  <fj-dialog :title="title" :visible.sync="display" @close="cancelDialog">
    <template v-if="action === 'createGroupAPI'">
      请输入组名称 <span v-if="errorMessage !== ''" class="dialog-input-error">({{ errorMessage }})</span>
      <fj-input v-model.trim="name" autofocus />
    </template>
    <template v-else>
      <span>{{message}}</span>
    </template>
    <div slot="footer">
      <fj-button @click="cancelDialog">取消</fj-button>
      <fj-button type="primary" @click="confirmDialog">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  const api = require('../../../api/engine');

  export default {
    name: 'engineDialogView',
    props: {
      vueInstance: { type: Object },
      selectedNodeInfo: { type: Object },
      visible: { type: Boolean, default: false },
      confirmFn: { type: Function }
    },
    data() {
      return {
        bubble: this.vueInstance,
        title: '添加分组',
        name: '',
        message: '',
        errorMessage: '',
        action: 'createGroupAPI',
        display: false
      };
    },
    watch: {
      visible(val) {
        this.display = val;
      }
    },
    created() {
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      cancelDialog() {
        this.$emit('update:visible', false);
      },
      confirmDialog() {
        const me = this;
        const action = this[this.action];

        if (action) {
          action((data) => {
            me.confirmFn && me.confirmFn(data);
          });
        } else {
          this.cancelDialog();
        }
      },
      createGroupAPI(cb) {
        const me = this;
        const name = this.name;

        if (!name) {
          this.errorMessage = '请输入组名称';
          return false;
        }

        api.addGroup({
          parentId: me.selectedNodeInfo.id || '',
          name: name
        }).then((res) => {
          me.$message.success('成功添加');
          cb && cb(res.data);
          me.cancelDialog();
        }).catch((err) => {
          me.showErrorInfo(err);
        });

        return false;
      }
    }
  };
</script>

