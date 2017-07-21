<template>
  <fj-dialog
          :title="title"
          :visible.sync="addOwnerDialogVisible"
          @close="close">
    <div v-if="treeTopIdArr.length" class="add-group-tree">
      <fj-tree
              :data="treeData"
              :topNodeIdArr= "treeTopIdArr"
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
  import { formatQuery, formatTree } from '../../../common/utils';

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
      }
    },
    data() {
      return {
        addOwnerDialogVisible: false,
        keyword3: '',
        searchOwner: [],
        treeData: {},
        treeTopIdArr: []
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.handleTreeNodeClick();
          this.addOwnerDialogVisible = val;
        } else {
          this.addOwnerDialogVisible = val;
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
        this.$emit('add-owner', this.currentNode);
        return true;
      },
      handleTreeNodeClick(node) {
        const me = this;
        const query = {};
        this.currentNode = node;
        if (!node) {
          query.parentId = '';
          query.type = '0';
        } else {
          query.parentId = node._id;
        }
        groupApi.getGroupList(formatQuery(query, true))
          .then((res) => {
            const data = formatTree(res.data.docs, '_id').node;
            if (query.parentId === '') {
              const dataKeys = Object.keys(data);
              me.treeTopIdArr = [];
              for (let i = 0; i < dataKeys.length; i++) {
                me.treeTopIdArr.push(data[dataKeys[i]]._id);
                me.treeData = Object.assign({}, me.treeData, data);
              }
            } else {
              me.treeData = Object.assign({}, me.treeData, data);
            }
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