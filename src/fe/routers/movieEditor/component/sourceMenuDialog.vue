<template>
  <fj-dialog
    title="请选择目标目录"
    :visible.sync="dialogVisible"
    @close="handleClose">
    <div class="source-menu-tree">
      <tree-view
        :showUpper="false"
        :vue-instance="vueInstance"
        :list-group="listSourceItem"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click.stop="handleClose">取消</fj-button><!--
      --><fj-button type="primary" @click.stop="submit">确定</fj-button>
    </div>
  </fj-dialog>
</template>
<script>
  import Vue from 'vue';
  import TreeView from '../../../component/higherOrder/tree/_index';
  import ivideoAPI from '../../../api/ivideo';

  export default {
    props: {
      visible: Boolean
    },
    data() {
      return {
        _id: '',
        currentNodeId: '',
        currentNodeOwnerType: '',
        dialogVisible: this.visible
      };
    },
    watch: {
      visible(val) {
        this.dialogVisible = val;
      }
    },
    created() {
      this.vueInstance = new Vue({
        name: 'sourceMenu'
      });
    },
    methods: {
      listSourceItem(id = '', cb, node) {
        const params = { parentId: id, type: '0,2' };
        if (node && node.ownerType) {
          params.ownerType = node.ownerType;
        }
        ivideoAPI.listItem({ params: params }).then((res) => {
          const resData = res.data;
          const data = [];
          for (let i = 0; i < resData.length; i++) {
            const item = resData[i];
            // 不可编辑的文件夹
            if (item.type === '2' && (item.ownerType === '1' || item.ownerType === '2')) continue;
            item.isFolder = true;
            data.push(item);
          }
          cb && cb(data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      treeNodeCurrentChange(node) {
        this.currentNodeId = node._id;
        this.currentNodeOwnerType = node.ownerType;
      },
      submit() {
        this.$emit('addto-menu', { destId: this.currentNodeId, destOwnerType: this.currentNodeOwnerType });
        this.handleClose();
      },
      handleClose() {
        this.$emit('update:visible', false);
      }
    },
    components: {
      TreeView
    }
  };
</script>
<style>
.source-menu-tree {
  width: 100%;
  height: 195px;
  overflow: auto;
  border: 1px solid #CED9E5;
  border-radius: 4px;
  margin-bottom: 12px;
}
</style>
