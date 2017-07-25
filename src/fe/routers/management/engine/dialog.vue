<template>
  <fj-dialog :title="title" :visible.sync="visible" @close="cancelDialog">
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
    props: ['vueInstance'],
    data() {
      return {
        selectedNodeInfo: {},
        bubble: this.vueInstance,
        visible: false,
        title: '',
        name: '',
        message: '',
        errorMessage: '',
        action: ''
      };
    },
    created() {
      const me = this;

      me.bubble.$on('engine.addGroup', (node) => {
        me.selectedNodeInfo = node;
        me.visible = true;
        me.title = '添加分组';
        me.name = '';
        me.action = 'createGroupAPI';
      });
    },
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },

      cancelDialog() {
        this.visible = false;
        this.title = '';
        this.name = '';
        this.message = '';
        this.errorMessage = '';
      },
      confirmDialog() {
        const action = this[this.action];

        if (action) {
          action();
        } else {
          this.cancelDialog();
        }
      },
      createGroupAPI() {
        const me = this;
        const name = this.name;

        if (!name) {
          this.errorMessage = '请输入小组名称';
          return false;
        }

        api.addGroup({
          parentId: me.selectedNodeInfo.id || '',
          name: name
        }).then((res) => {
          me.$message.success('成功添加小组');
          me.bubble.$emit('engine.addGroup.callback');
          me.cancelDialog();
        }).catch((err) => {
          me.showErrorInfo(err);
        });

        return false;
      }
    }
  };
</script>

