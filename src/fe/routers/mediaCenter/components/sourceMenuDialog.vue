<template>
  <div v-show="visible" class="source-menu-dialog" :style="menuPosition">
    <div class="source-menu-tree">
      <tree-view
        :showUpper="false"
        :vue-instance="vueInstance"
        :list-group="listSourceItem"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div class="source-menu-footer">
      <fj-button type="primary" size="mini" @click="submit" :disabled="!currentNodeId">添加</fj-button>
      <fj-button type="primary" size="mini" @click="submitAndLeave" :disabled="!currentNodeId">添加并前往编辑</fj-button>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeView from '../../../component/higherOrder/tree/_index';
  import ivideoAPI from '../../../api/ivideo';

  export default {
    props: {
      visible: Boolean,
      menuPosition: {}
    },
    data() {
      return {
        _id: '',
        currentNodeId: '',
        currentNodeOwnerType: ''
      };
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
        this.$emit('addto-menu', { parentId: this.currentNodeId, ownerType: this.currentNodeOwnerType });
      },
      submitAndLeave() {
        this.$emit('addto-menu', { parentId: this.currentNodeId, ownerType: this.currentNodeOwnerType }, true);
      }
    },
    components: {
      TreeView
    }
  };
</script>
