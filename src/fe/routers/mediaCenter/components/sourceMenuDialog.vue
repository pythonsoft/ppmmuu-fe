<template>
  <div v-show="visible" class="source-menu-dialog" :style="menuPosition">
    <div class="source-menu-tree">
      <tree-view
        :showUpper="false"
        :vue-instance="vueInstance"
        :list-group="listGroup"
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
  import TreeView from '../../../component/higherOrder/tree';
  import ivideoAPI from '../../../api/ivideo';

  export default {
    props: {
      visible: Boolean,
      menuPosition: {}
    },
    data() {
      return {
        _id: '',
        currentNodeId: ''
      };
    },
    created() {
      this.vueInstance = new Vue({
        name: 'sourceMenu'
      });
    },
    methods: {
      listGroup(treeNode, cb) {
        if (treeNode.info) {
          this.listSourceItem(treeNode.info._id, cb);
        } else {
          ivideoAPI.init().then((res) => {
            const data = res.data;
            this._id = data._id;
            if (this._id) {
              this.listSourceItem(this._id, cb);
            }
          }).catch((error) => {
            this.$message.error(error);
          });
        }
      },
      listSourceItem(id, cb) {
        ivideoAPI.listItem({ params: { parentId: id, type: 0 } }).then((res) => {
          res.data.forEach((item) => {
            item.isFolder = true;
          });
          cb && cb(res.data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      treeNodeCurrentChange(node) {
        this.currentNodeId = node.id;
      },
      submit() {
        this.$emit('addto-menu', { parentId: this.currentNodeId });
      },
      submitAndLeave() {
        this.$emit('addto-menu', { parentId: this.currentNodeId }, true);
      }
    },
    components: {
      TreeView
    }
  };
</script>
