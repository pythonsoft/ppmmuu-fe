<template>
  <div class="clearfix" :style="{ height: '100%' }">
    <div class="left-tree">
      <tree-view
        title="组织结构"
        addBtnText="添加公司"
        :vue-instance="vueInstance"
        :menus="dropMenus"
        menu-width="90px"
        command-field-name="type"
        :exec-command="execCommand"
        :list-group="listGroup"
        :btn-click="btnClick"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div class="right-list">
      <edit-group-panel
        v-show="mainContent === 'editPanel'"
        :companyId="companyId"
        :name="editPanelName"
        :type="editPanelType"
        :data="groupDetail"
        @cancel="mainContent = 'default'"></edit-group-panel>
      <permission-panel
        v-show="mainContent === 'permissionPanel'"
        :id="permissionPanelId"
        :parentIds="permissionPanelParentIds"
        :name="permissionPanelName"
        :type="permissionPanelType"
        @cancel="mainContent = 'default'"></permission-panel>
      <account-list
        v-show="mainContent === 'default'"
        :companyId="companyId"
        :group="selectedNode"></account-list>
    </div>
    <add-group-dialog
      :type="addGroupDialogType"
      :title="addGroupDialogTitle"
      :parentId="addGroupDialogParentId"
      :dialogVisible.sync="isShowAddGroupDialog"
      @added="vueInstance.$emit('tree.listGroup')"></add-group-dialog>
    <fj-dialog
      :title="`删除${deleteGroupDialogTitle}`"
      :visible.sync="deleteGroupDialogVisible">

      <p>您确定要删除{{ deleteGroupDialogTitle }}吗？</p>

      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="deleteGroupDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteGroup">确定</fj-button>
      </div>

    </fj-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import AddGroupDialog from './component/addGroupDialog';
  import TreeView from '../../../component/higherOrder/tree';
  import EditGroupPanel from './component/editGroupPanel';
  import PermissionPanel from './component/permissionPanel';
  import AccountList from './component/accountList';
  import groupAPI from '../../../api/group';
  import { formatTree, formatQuery, getTreeNode } from '../../../common/utils';
  import { TYPE_CONFIG, APPENDCHILD_CONFIG, GROUP_CONFIG, CHILD_NODE_CONFIG, MENU_CONFIG } from './config';

  export default {
    data() {
      return {
        dropMenus: MENU_CONFIG,
        treeData: [],
        isShowAddGroupDialog: false,
        addGroupDialogTitle: '',
        addGroupDialogType: '',
        addGroupDialogParentId: '',
        deleteGroupDialogTitle: '',
        deleteGroupDialogId: '',
        deleteGroupDialogVisible: false,
        isDeleteBtnLoading: false,
        mainContent: 'default',
        editPanelType: '',
        editPanelName: '',
        permissionPanelType: '',
        permissionPanelId: '',
        permissionPanelParentIds: [],
        permissionPanelName: '',
        groupDetail: {},
        companyId: '',
        selectedNode: {}
      };
    },
    methods: {
      execCommand(command, node) {
        const childType = this.APPENDCHILD_CONFIG[node.info.type];
        let title = this.TYPE_CONFIG[node.info.type];
        switch (command) {
          case 'delete':
            this.handleOpenDeleteDialog(title, node.info._id);
            break;
          case 'new':
            title = this.TYPE_CONFIG[childType];
            this.handleOpenAddDialog(childType, title, node.info._id);
            break;
          case 'edit':
            this.handleShowEditPanel(node.info);
            break;
          case 'permission':
            this.handleShowPermissionPanel(node.info);
            break;
          default:
            break;
        }
      },
      listGroup(treeNode, cb) {
        const requestData = {
          type: '0'
        };
        if (treeNode.info) {
          requestData.type = this.CHILD_NODE_CONFIG[treeNode.info.type];
          requestData.parentId = treeNode.info._id;
        }

        groupAPI.getGroupList({ params: requestData })
          .then((response) => {
            cb && cb(response.data.docs);
          })
          .catch((error) => {
          });
      },
      btnClick(treeNode) {
        this.handleOpenAddDialog('0', '公司', '');
      },
      treeNodeCurrentChange(treeNode) {
        this.mainContent = 'default';
        this.selectedNode = treeNode.info;
        if (treeNode.info.type === GROUP_CONFIG.company.type) {
          this.companyId = treeNode.info._id;
        }
      },
      handleOpenAddDialog(type, title, parentId = '') {
        this.isShowAddGroupDialog = true;
        this.addGroupDialogType = type;
        this.addGroupDialogTitle = title;
        this.addGroupDialogParentId = parentId;
      },
      handleOpenDeleteDialog(title, id) {
        this.deleteGroupDialogVisible = true;
        this.deleteGroupDialogTitle = title;
        this.deleteGroupDialogId = id;
      },
      handleShowEditPanel(node) {
        this.mainContent = 'editPanel';
        this.editPanelType = node.type;
        this.editPanelName = node.name;
        if (node.type === GROUP_CONFIG.company.type) {
          this.companyId = node._id;
        }
        groupAPI.getGroupDetail(formatQuery({ _id: node._id }, true))
          .then((response) => {
            this.groupDetail = response.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleShowPermissionPanel(node) {
        this.mainContent = 'permissionPanel';
        this.permissionPanelType = node.type;
        this.permissionPanelId = node._id;
        this.permissionPanelParentIds = [];
        this.vueInstance.$emit('tree.getParentsId', node._id, (ids) => {
          this.permissionPanelParentIds = ids;
        });
        // this.getParentIds(this.permissionPanelParentIds, node._id, this.treeData);
        this.permissionPanelName = node.name;
      },
      handleDeleteGroup() {
        this.isDeleteBtnLoading = true;
        groupAPI.postDeleteGroup({ _id: this.deleteGroupDialogId })
          .then((response) => {
            this.vueInstance.$emit('tree.removeNode', this.deleteGroupDialogId);
            this.$message.success('删除成功');
            this.isDeleteBtnLoading = false;
            this.deleteGroupDialogVisible = false;
          })
          .catch((error) => {
            this.isDeleteBtnLoading = false;
            this.$message.error(error);
          });
      }
    },
    created() {
      this.GROUP_CONFIG = GROUP_CONFIG;
      this.CHILD_NODE_CONFIG = CHILD_NODE_CONFIG;
      this.TYPE_CONFIG = TYPE_CONFIG;
      this.APPENDCHILD_CONFIG = APPENDCHILD_CONFIG;

      this.vueInstance = new Vue({
        name: 'account'
      });
    },
    mounted() {
    },
    components: {
      AddGroupDialog,
      EditGroupPanel,
      PermissionPanel,
      AccountList,
      TreeView
    }
  };
</script>
<style>
  .left-tree {
    float: left;
    width: 192px;
    height: 100%;
    overflow-y: auto;
    background-color: #F8FAFB;
  }
  .right-list {
    margin-left: 192px;
    height: 100%;
    overflow: auto;
  }
</style>
