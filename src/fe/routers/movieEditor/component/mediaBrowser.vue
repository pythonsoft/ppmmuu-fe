<template>
  <div
    :class="['media-browser-wrap', {'active-panel': activePanel === 'mediaBrowser'}]"
    @click="()=>{this.$emit('update:activePanel', 'mediaBrowser')}">
    <div class="media-browser-header clearfix">
      <h3 class="media-browser-title">我的资源</h3>
      <div class="media-browser-controller-wrap">
        <div class="player-control-item-wrap">
          <div class="player-control-item" @click="addFolderInput">
            <i class="iconfont icon-add-folder"></i>
          </div>
          <div class="player-control-tooltip">添加文件夹</div>
        </div>
        <div class="player-control-item-wrap">
          <div class="player-control-item" @click="showDeleteNodeDialog" :class="{'disabled-control-item': !currentNodeId}">
            <i class="iconfont icon-delete"></i>
          </div>
          <div class="player-control-tooltip">删除</div>
        </div>
      </div>
    </div>
    <div class="media-browser-content">
      <tree-view
        :theme="theme"
        :autoExpand="false"
        :showUpper="false"
        :default-expanded-key="defaultExpandedKey"
        :vue-instance="vueInstance"
        :list-group="listGroup"
        :renderContent="renderContent"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>

    <fj-dialog
      title="删除"
      :visible.sync="deleteNodeDialogVisible">

      <p class="dialog-content">您确定要删除{{ currentNodeInfo.name }}吗？</p>

      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="deleteNodeDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteNode">确定</fj-button>
      </div>

    </fj-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import TreeNodeContent from './sourceTreeNode';
  import TreeView from '../../../component/higherOrder/tree/_index';
  import ivideoAPI from '../../../api/ivideo';

  const TYPE_CONFIG = {
    0: 'folder',
    2: 'folder',
    1: 'video',
    new: 'input'
  };

  export default {
    props: {
      activePanel: String,
      theme: String
    },
    data() {
      return {
        _id: '',
        currentNodeId: '',
        currentNodeInfo: {},
        deleteNodeDialogVisible: false,
        isDeleteBtnLoading: false,
        defaultExpandedKey: ''
      };
    },
    methods: {
      listGroup(id = '', cb) {
        if (id) {
          this.listSourceItem(id, cb);
        } else {
          ivideoAPI.init().then((res) => {
            const data = res.data;
            this._id = data._id;
            if (this._id) {
              this.listSourceItem(this._id, (data) => {
                if (data.length > 0) this.defaultExpandedKey = data[0]._id;
                cb(data);
              });
            }
          }).catch((error) => {
            this.$message.error(error);
          });
        }
      },
      treeNodeCurrentChange(node) {
        this.currentNodeId = node._id;
        this.currentNodeInfo = node;
      },
      showDeleteNodeDialog() {
        if (!this.currentNodeId) return;
        this.deleteNodeDialogVisible = true;
      },
      cancelCreate(node) {
        this.vueInstance.$emit('tree.removeNode', node._id);
      },
      handleDeleteNode() {
        this.isDeleteBtnLoading = true;
        ivideoAPI.removeItem({ id: this.currentNodeId })
          .then((response) => {
            this.vueInstance.$emit('tree.removeNode', this.currentNodeId);
            this.currentNodeId = '';
            this.currentNodeInfo = {};
            this.$message.success('删除成功');
            this.isDeleteBtnLoading = false;
            this.deleteNodeDialogVisible = false;
          })
          .catch((error) => {
            this.isDeleteBtnLoading = false;
            this.$message.error(error);
          });
      },
      listSourceItem(id, cb) {
        ivideoAPI.listItem({ params: { parentId: id } }).then((res) => {
          res.data.forEach((item) => {
            if (TYPE_CONFIG[item.type] === 'folder') item.isFolder = true;
          });
          cb && cb(res.data);
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      renderContent(h, node) {
        return h(TreeNodeContent, {
          props: {
            node: node,
            rootId: this._id,
            currentNodeId: this.currentNodeId
          },
          on: {
            createDirectory: this.createDirectory,
            updateDirectory: this.updateDirectory,
            cancelCreate: this.cancelCreate,
            updateCurrentSource: this.updateCurrentSource
          }
        });
      },
      updateCurrentSource(item) {
        this.$emit('updateCurrentSource', item);
      },
      createDirectory(reqData, removeNodeId) {
        ivideoAPI.createDirectory(reqData)
          .then((response) => {
            const id = reqData.parentId === this._id ? '' : reqData.parentId;
            this.vueInstance.$emit('tree.removeNode', removeNodeId);
            this.vueInstance.$emit('tree.listGroup', id);
            // this.$message.success('删除成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateDirectory(reqData) {
        ivideoAPI.updateItem(reqData)
          .then((response) => {
            this.vueInstance.$emit('tree.updateNode', reqData.id, { name: reqData.name });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      addFolderInput() {
        const node = {
          _id: `new${new Date().getTime()}`,
          name: 'new',
          type: 'new',
          isFolder: true,
          parentId: this._id
        };
        this.vueInstance.$emit('tree.insertNode', this.currentNodeId, node);
      }
    },
    created() {
      this.TYPE_CONFIG = TYPE_CONFIG;
      this.vueInstance = new Vue({
        name: 'mediaBrowser'
      });
    },
    components: {
      TreeNodeContent,
      TreeView
    }
  };
</script>
