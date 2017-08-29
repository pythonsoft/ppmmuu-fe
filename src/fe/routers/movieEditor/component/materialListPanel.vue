<template>
  <div class="material-list-wrap">
    <fj-tabs v-model="activeTabName" theme="dark">
      <fj-tab-pane label="我的资源" name="material">
        <tree-view
          :showUpper="false"
          :vue-instance="vueInstance"
          :list-group="listGroup"
          :tree-node-current-change="treeNodeCurrentChange"
        ></tree-view>
      </fj-tab-pane>
    </fj-tabs>
    <div class="material-list-operater-wrap">
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="addFolder">
          <i class="iconfont icon-add-folder"></i>
        </div>
        <div class="player-control-tooltip">添加文件夹</div>
      </div><!--
      --><div class="player-control-item-wrap">
        <div class="player-control-item">
          <i class="iconfont icon-delete"></i>
        </div>
        <div class="player-control-tooltip">删除</div>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeNodeContent from './materialTreeNode';
  import TreeView from '../../../component/higherOrder/tree';
  import ivideoAPI from '../../../api/ivideo';

  export default {
    data() {
      return {
        activeTabName: 'material',
        _id: ''
      };
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
      treeNodeCurrentChange() {},
      listSourceItem(id, cb) {
        ivideoAPI.listItem({ params: { parentId: id } }).then((res) => {
          cb && cb(res.data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      renderContent(h, node) {
        return h(TreeNodeContent, {
          props: {
            node: node
          }
        });
      },
      handleTabClick() {},
      addFolder() {}
    },
    created() {
      this.vueInstance = new Vue({
        name: 'materialList'
      });
    },
    components: {
      TreeNodeContent,
      TreeView
    }
  };
</script>
<style>
  .material-list-wrap {
    padding-left: 20px;
    padding-top: 10px;
  }
</style>
