<template>
  <fj-dialog
          :title="title"
          :visible.sync="addOwnerDialogVisible"
          @close="close">
    <div v-if="treeData.length" class="add-group-tree">
      <fj-tree
              :data="treeData"
              node-key="_id"
              @node-click="handleTreeNodeClick"
              @current-change="handleTreeNodeCurrentChange"
              @node-expand="handleTreeNodeExpand"
              @node-collapse="handleTreeNodeCollapse">
      </fj-tree>
    </div>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import { formatQuery, getTree, getTreeNode } from '../../../common/utils';

  const api = require('../../../api/role');
  const groupApi = require('../../../api/group');

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
        default: ''
      }
    },
    data() {
      return {
        addOwnerDialogVisible: false,
        keyword3: '',
        searchOwner: [],
        treeData: []
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.handleTreeNodeClick();
          this.addOwnerDialogVisible = val;
          this.treeData = [];
        } else {
          this.addOwnerDialogVisible = val;
          this.treeData = [];
        }
      }
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
        const parentNode = getTreeNode(this.treeData, this.currentNode.parentId);
        this.$emit('add-owner', this.currentNode, parentNode);
        return true;
      },
      handleTreeNodeClick(node) {
        const me = this;
        const query = {};
        this.currentNode = node;
        if (!node) {
          query.parentId = this.parentId;
          query.type = this.type;
        } else {
          query.parentId = node._id;
        }
        groupApi.getGroupList(formatQuery(query, true))
          .then((res) => {
            const data = res.data.docs;
            me.treeData = getTree(me.treeData, data, query.parentId);
          })
          .catch((err) => {
            me.showErrorInfo(err);
          });
      },
      handleTreeNodeCurrentChange() {

      },
      handleTreeNodeExpand(node) {
      },
      handleTreeNodeCollapse() {

      },
      showErrorInfo(message) {
        this.$message.error(message);
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