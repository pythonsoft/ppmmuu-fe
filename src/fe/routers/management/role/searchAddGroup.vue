<template>
  <fj-dialog
          :title="title"
          :vueInstance="vueInstance"
          :visible.sync="addOwnerDialogVisible"
          @close="close">
    <div class="add-group-tree">
      <tree-view
              title="组"
              :listGroup="listGroup"
              :btnClick="btnClick"
              :treeNodeCurrentChange="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div slot="footer">
      <fj-button @click="close">取消</fj-button>
      <fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import Vue from 'vue';

  import treeView from '../../../component/higherOrder/tree/index';
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
          console.log("aaaaaaa");
          this.vueInstance.$emit('tree.listGroup');
          this.addOwnerDialogVisible = val;
        } else {
          this.addOwnerDialogVisible = val;
        }
      }
    },
    created() {
      this.vueInstance = new Vue();
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
      btnClick(node) {
        this.currentNode = node;
      },
      listGroup(node, cb){
        const me = this;
        const query = {};
        if (!node) {
          query.parentId = this.parentId;
          query.type = this.type;
        } else {
          query.parentId = node._id;
        }
        groupApi.getGroupList(formatQuery(query, true))
                .then((res) => {
          cb && cb(res.data.docs);
      })
      .catch((err) => {
          me.showErrorInfo(err);
      });
      },
      treeNodeCurrentChange(treeNode) {
        this.currentNode = treeNode;
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