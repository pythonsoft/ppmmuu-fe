<template>
  <fj-dialog :title="title" :visible.sync="display" @close="cancelDialog">
    <template v-if="type === 'dialog'">
      请输入组名称 <span v-if="errorMessage !== ''" class="dialog-input-error">({{ errorMessage }})</span>
      <fj-input v-model.trim="name" autofocus />
    </template>
    <template v-else>
      <span>{{ message }}</span>
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
      engineInfo: { type: Object },
      visible: { type: Boolean, default: false },
      confirmFn: { type: Function },
      actionName: { type: String, default: 'createGroup' }
    },
    data() {
      return {
        bubble: this.vueInstance,
        title: '添加分组',
        name: '',
        message: '',
        errorMessage: '',
        type: 'dialog', // dialog or confirm
        action: '',
        display: false
      };
    },
    watch: {
      visible(val) {
        this.display = val;
        this.setConfig(this.actionName);
      }
    },
    created() {},
    methods: {
      showErrorInfo(message) {
        this.$message.error(message);
      },
      cancelDialog() {
        this.$emit('update:visible', false);
        this.$emit('update:actionName', 'createGroupAPI');
        this.setConfig('createGroup');
      },
      setConfig(c) {
        const me = this;
        const cfg = {
          createGroup() {
            me.title = '添加分组';
            me.name = '';
            me.message = '';
            me.errorMessage = '';
            me.type = 'dialog';
            me.action = 'createGroupAPI';
          },
          deleteGroup() {
            me.title = '删除分组';
            me.name = '';
            me.message = `您确定要删除 ${me.selectedNodeInfo.name} 这个分组吗？`;
            me.errorMessage = '';
            me.type = 'confirm';
            me.action = 'deleteGroupAPI';
          },
          deleteEngine() {
            me.title = '删除引擎';
            me.name = '';
            me.message = `您确定要删除 ${me.engineInfo.name} 这个引擎吗？`;
            me.errorMessage = '';
            me.type = 'confirm';
            me.action = 'deleteEngineAPI';
          }
        };
        const t = cfg[c];
        console.log('const --->', t);
        return t && t();
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
          me.vueInstance.$emit('tree.listGroup');
          cb && cb(res.data);
          me.cancelDialog();
        }).catch((err) => {
          me.showErrorInfo(err);
        });

        return false;
      },
      deleteGroupAPI(cb) {
        const me = this;

        if (!me.selectedNodeInfo || !me.selectedNodeInfo.id) {
          me.showErrorInfo('当前没有可以删除的组');
          return false;
        }
        const id = me.selectedNodeInfo.id;
        api.removeGroup({ groupId: id }).then(() => {
          me.vueInstance.$emit('tree.removeNode', id);
          cb && cb();
          me.cancelDialog();
        }).catch((err) => {
          me.showErrorInfo(err);
        });

        return false;
      },
      deleteEngineAPI(cb) {
        const me = this;

        if (!me.engineInfo._id) {
          me.showErrorInfo('当前没有可以删除的引擎');
          return false;
        }

        api.removeEngine({ id: me.engineInfo._id }).then(() => {
          me.vueInstance.$emit('tree.listGroup');
          cb && cb();
          me.cancelDialog();
        }).catch((err) => {
          me.showErrorInfo(err);
        });

        return false;
      }
    }
  };
</script>

