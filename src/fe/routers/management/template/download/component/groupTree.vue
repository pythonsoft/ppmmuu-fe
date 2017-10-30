<template>
  <fj-dialog
      :title="title"
      :visible.sync="addOwnerDialogVisible"
      @close="close">
    <div class="add-group-tree">
      <tree-view
        :showUpper="false"
        :vueInstance="vueInstance"
        :listGroup="listGroup"
        :treeNodeCurrentChange="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import Vue from 'vue';

  import treeView from '../../../../../component/higherOrder/tree/_index';

  const CHILD_NODE_CONFIG = {
    0: '1',
    1: '2'
  };

  export default {
    name: 'addGroup',
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      title: {
        type: String,
        default: ''
      },
      parentId: {
        type: String,
        default: ''
      },
      type: {
        type: String,
        default: '0'
      }
    },
    components: {
      'tree-view': treeView
    },
    data() {
      return {
        addOwnerDialogVisible: false,
        keyword3: '',
        searchOwner: [],
        vueInstance: null
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.vueInstance.$emit('tree.listGroup');
          this.addOwnerDialogVisible = val;
        } else {
          this.addOwnerDialogVisible = val;
        }
      }
    },
    created() {
      this.CHILD_NODE_CONFIG = CHILD_NODE_CONFIG;
      this.vueInstance = new Vue({
        name: 'groupTree'
      });
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      addOwnerConfirm() {
        if (!this.currentNode) {
          this.showErrorInfo('没有选中的组织');
          return false;
        }
        // this.currentNode._id = this.currentNode.id;
        // if (this.currentNodeParent) {
        //   this.currentNodeParent._id = this.currentNodeParent.id;
        // }
        this.$emit('add-owner', this.currentNode, this.currentNodeParent);
        return true;
      },
      listGroup(id = '', cb) {
        const me = this;
        if (!this.visible) { return false; }

        const query = {
          parentId: id ? id : (this.parentId || '')
        };
        this.$emit('list-group', query, cb);
      },
      treeNodeCurrentChange(treeNode, parentNode) {
        this.currentNode = treeNode;
        this.currentNodeParent = parentNode;
      }
    }
  };
</script>
<style>
  .add-group-tree {
    background: #FFFFFF;
    border: 1px solid #CED9E5;
    border-radius: 4px;
    max-height: 300px;
    overflow: scroll;
  }
</style>
