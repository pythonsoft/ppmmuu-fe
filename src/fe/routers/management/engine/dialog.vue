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

  //组操作
  const groupHandle = {
    createGroupAPI() {
      const me = this;
      const name = this.name;

      if (!name) {
        this.errorMessage = '请输入小组名称';
        return false;
      }

      api.addGroup({
        parentId: me.selectedNodeInfo._id,
        name: name
      }).then((res) => {

      }).catch((err) => {
        me.showErrorInfo(err);
      });
    },
  };

  //对话框
  const dialogHandle = {
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
        cancelDialog();
      }
    },
  };

  const helpHandle = {
    showErrorInfo(message) {
      this.$message.error(message);
    },
  };

  export default {
    name: 'engineDialogView',
    props: ['vueInstance'],
    data() {
      return {
        selectedNodeInfo: {},
        myBus: this.vueInstance,
        visible: false,
        title: '',
        name: '',
        message: '',
        errorMessage: '',
        action: ''
      }
    },
    created() {
      const me = this;
      this.myBus.$on('engine.addGroup', () => {
        me.visible = true;
        me.title = '添加分组';
        me.name = '';
        me.action = 'createGroupAPI';
      });
    },
    methods: Object.assign({}, groupHandle, dialogHandle, helpHandle)
  }
</script>

