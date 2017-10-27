<template>
  <div class="clearfix" style="height: 100%;">
    <div class="left-tree">
      <tree-view
        title="分组结构"
        addBtnText="添加分组"
        :vue-instance="vueInstance"
        :menus="dropMenus"
        menu-width="90px"
        :exec-command="execCommand"
        :list-group="handleTreeNodeClick"
        :btn-click="btnClick"
        :tree-node-current-change="treeNodeCurrentChange"
      ></tree-view>
    </div>
    <div class="right-list">
      <four-row-layout-right-content>
        <template slot="search-left">{{currentNode.name || '配置项'}}</template>
        <template slot="search-right">
          <div class="permission-search-item">
            <fj-input placeholder="请输入关键字" v-model="name" size="small"></fj-input>
          </div>
          <div class="permission-search-item">
            <fj-button type="primary" @click="handleClickSearch" size="small">搜索</fj-button>
          </div>
        </template>
        <template slot="operation">
          <fj-button type="info" size="mini" @click="handleClickAdd">增加</fj-button>
          <fj-button type="info" size="mini" v-bind:disabled="change" @click="handleClickChange">变更</fj-button>
          <fj-button type="info" size="mini" v-bind:disabled="deleted" @click="handleClickDeleted">删除</fj-button>
        </template>
        <template slot="table">
          <fj-table :data="tableData" name="table1" ref="table" @current-change="handleSelectionChange" highlight-current-row>
            <fj-table-column prop="key" label="键" ></fj-table-column>
            <fj-table-column prop="value" label="值" ></fj-table-column>
            <fj-table-column prop="description" label="描述"></fj-table-column>
          </fj-table>
        </template>
        <template slot="pagination">
          <fj-pagination
            :page-size="pageSize"
            :total="total"
            :current-page.sync="currentPage"
            @current-change="handleCurrentPageChange">
          </fj-pagination>
        </template>

        <fj-slide-dialog
          v-bind:title="slideDialogTitle"
          :visible.sync="slideDialogVisible"
          @open="handleOpenSlideDialog"
          @close="handleCloseSlideDialog">
          <fj-form :model="configFormData" :rules="configFormDataRules" ref="configForm" label-width="80px">
            <fj-form-item label="键" prop="key">
              <fj-input v-model="configFormData.key" :disabled="action == 'changeConfig'" />
            </fj-form-item>
            <fj-form-item label="值" prop="value">
              <fj-input v-model="configFormData.value" />
            </fj-form-item>
            <fj-form-item label="描述">
              <fj-input type="textarea" :rows="5" v-model="configFormData.description" />
            </fj-form-item>
          </fj-form>
          <div slot="footer">
            <fj-button @click="cancelSlideDialog">取消</fj-button>
            <fj-button type="primary" @click="confirmSlideDialog">确定</fj-button>
          </div>
        </fj-slide-dialog>

        <fj-dialog
                title="删除提示"
                :visible.sync="deleteDialogVisible">

          <p>您确定要删除{{ dialogTitle }}吗？</p>

          <div slot="footer" class="dialog-footer">
            <fj-button @click.stop="deleteDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteClick">确定</fj-button>
          </div>

        </fj-dialog>
        <add-group
          :parentId="addGroupDialogParentId"
          :dialogVisible.sync="isShowAddGroupDialog"
          @added="vueInstance.$emit('tree.listGroup', addGroupDialogParentId)">
        </add-group>
        <edit-group
          :info="nodeInfo"
          :dialogVisible.sync="isShowEditGroupDialog"
          @edited="(newInfo)=>{vueInstance.$emit('tree.updateNode', nodeInfo._id, newInfo)}">
        </edit-group>
      </four-row-layout-right-content>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { formatQuery, getTree } from '../../../common/utils';
  import TwoRowTree from '../../../component/layout/twoRowTree/index';
  import TreeView from '../../../component/higherOrder/tree/_index';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import TreeNodeContent from './treeNodeContent';
  import addGroup from './component/addGroupDialog';
  import editGroup from './component/editGroup';

  const MENU_CONFIG = require('./config');
  const api = require('../../../api/role');
  const apiConfig = require('../../../api/configuration');

  export default {
    components: {
      'two-row-tree': TwoRowTree,
      'four-row-layout-right-content': FourRowLayoutRightContent,
      'tree-node-content': TreeNodeContent,
      'add-group': addGroup,
      'edit-group': editGroup,
      'tree-view': TreeView
    },
    data() {
      return {
        dropMenus: MENU_CONFIG,
        action: '',
        currentNode: {},
        currentConfig: {},
        defaultRoute: '/',
        deleteDialogVisible: false,
        dialogTitle: '',
        isDeleteBtnLoading: false,
        addGroupDialogParentId: '',
        isShowAddGroupDialog: false,
        isShowEditGroupDialog: false,
        nodeInfo: {},
        name: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        change: true,
        deleted: true,
        groupName: '',
        slideDialogVisible: false,
        slideDialogTitle: '提示',
        configFormData: {
          key: '',
          value: '',
          description: ''
        },
        configFormDataRules: {
          key: [
            { required: true, message: '请输入Key' }
          ],
          value: [
            {
              required: true, message: '请输入Value'
            }
          ]
        }
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.vueInstance = new Vue({
        name: 'configuration'
      });
      this.handleTreeNodeClick();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },

      execCommand(command, node) {
        const title = '组织';
        // switch (command) {
        //   case 'delete':
        //     this.handleOpenDeleteDialog(node.info.id);
        //     break;
        //   case 'new':
        //     this.handleOpenAddDialog(node.info.id);
        //     break;
        //   case 'edit':
        //     this.handleShowEditDialog(node.info);
        //     break;
        //   default:
        //     break;
        // }
        switch (command) {
          case 'delete':
            this.handleOpenDeleteDialog(node.id);
            break;
          case 'new':
            this.handleOpenAddDialog(node.id);
            break;
          case 'edit':
            this.handleShowEditDialog(node);
            break;
          default:
            break;
        }
      },

      btnClick(treeNode) {
        this.handleOpenAddDialog('');
      },
      treeNodeCurrentChange(treeNode) {
        this.currentNode = treeNode;
        this.currentPage = 1;
        const searchObj = {
          page: this.currentPage,
          pageSize: this.pageSize,
          groupId: treeNode.id
        };
        this.getListConfig(searchObj);
      },

      handleOpenDeleteDialog(_id) {
        this.deleteDialogVisible = true;
        this.dialogTitle = '组';
        this.deleteDialogId = _id;
      },

      handleDeleteClick() {
        const me = this;
        const func = this.dialogTitle === '组'
          ? apiConfig.postDeleteGroup
          : apiConfig.postDeleteConfig;
        const _id = this.dialogTitle === '组'
          ? this.deleteDialogId
          : this.currentConfig._id;
        me.isDeleteBtnLoading = true;

        func({ _id: _id })
          .then((res) => {
            me.$message.success('删除成功');
            me.isDeleteBtnLoading = false;
            me.deleteDialogVisible = false;
            if (this.dialogTitle === '组') {
              me.vueInstance.$emit('tree.removeNode', _id);
            } else {
              this.handleClickSearch();
            }
          }).catch((error) => {
            me.isDeleteBtnLoading = false;
            me.$message.error(error);
          });
      },

      handleOpenAddDialog(_id) {
        this.isShowAddGroupDialog = true;
        this.addGroupDialogParentId = _id;
      },

      handleShowEditDialog(info) {
        this.isShowEditGroupDialog = true;
        this.nodeInfo = info;
      },

      handleTreeNodeClick(id = '', cb) {
        const me = this;
        const query = {};
        // if (node === undefined) {
        //   query.parent = '';
        // } else {
        //   query.parent = node.info ? node.info.id : '';
        // }
        query.parent = id;
        me.groupId = query.parent;
        me.clickNodeSearch = true;
        apiConfig.getListGroup(formatQuery(query, true))
          .then((res) => {
            cb && cb(res.data);
          })
          .catch((err) => {
            me.showErrorInfo(err);
          });
        // if (node !== undefined) {
        //   me.currentNode = node;
        //   me.currentPage = 1;
        //   const searchObj = {
        //     page: me.currentPage,
        //     pageSize: me.pageSize,
        //     groupId: node.id
        //   };
        //   me.getListConfig(searchObj);
        // }
      },

      getListConfig(searchObj) {
        const me = this;
        apiConfig.getListConfig(formatQuery(searchObj, true))
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },

      handleClickSearch() {
        this.clickNodeSearch = false;
        const searchObj = {
          page: this.currentPage,
          pageSize: this.pageSize,
          name: this.name
        };
        this.getListConfig(searchObj);
      },

      handleClickAdd() {
        this.slideDialogTitle = '增加设置项';
        this.slideDialogVisible = true;
        this.action = 'addConfig';
      },

      handleClickChange() {
        this.configFormData = this.currentConfig;
        this.slideDialogTitle = '变更设置项';
        this.slideDialogVisible = true;
        this.action = 'changeConfig';
      },

      handleClickDeleted() {
        this.dialogTitle = '配置';
        this.deleteDialogVisible = true;
      },

      resetDialog() {
        this.dialogTitle = '';
        this.dialogVisible = false;
        this.action = '';
      },

      cancelDialog() {
        this.resetDialog();
      },
      handleSelectionChange(rows) {
        if (rows && rows.length !== 0) {
          this.currentConfig = Object.assign(this.currentConfig, rows);
          this.change = false;
          this.deleted = false;
        } else {
          this.change = true;
          this.deleted = true;
        }
      },

      clearTableSelection() {
        this.$refs.table.clearSelection();
      },

      handleCurrentPageChange(val) {
        if (this.clickNodeSearch === true) {
          const searchObj = {
            page: this.currentPage,
            pageSize: this.pageSize,
            name: this.name,
            groupId: this.groupId
          };
          this.getListConfig(searchObj);
        } else {
          this.handleClickSearch();
        }
      },

      showSuccessInfo(message) {
        this.$message.success(message);
      },

      showErrorInfo(message) {
        this.$message.error(message);
      },

      handleTreeNodeCurrentChange() {},

      handleTreeNodeExpand(node) {
      },

      handleTreeNodeCollapse() {},

      clickAddGroup() {
        this.dialogTitle = '新建组';
        this.dialogVisible = true;
        this.action = 'addGroup';
      },

      handleOpenSlideDialog() {},

      handleCloseSlideDialog() {},

      cancelSlideDialog() {
        this.slideDialogVisible = false;
        this.action = '';
      },

      resetSlideDialog() {
        this.configFormData = {};
        this.cancelSlideDialog();
      },

      confirmSlideDialog() {
        const me = this;
        const postData = {};
        let message = '';

        if (me.action === 'addConfig') {
          postData.genre = this.currentNode.id;
          postData.key = this.configFormData.key;
          postData.value = this.configFormData.value;
          postData.description = this.configFormData.description;
          message = '增加';
          apiConfig.postAddConfig(postData)
            .then((res) => {
              me.showSuccessInfo(`${message}成功`);
              me.resetSlideDialog();
              me.handleTreeNodeClick(me.currentNode._id);
            })
            .catch((err) => {
              me.showErrorInfo(err);
              me.cancelSlideDialog();
            });
        } else if (me.action === 'changeConfig') {
          postData.id = this.currentConfig._id;
          postData.value = this.configFormData.value;
          postData.description = this.configFormData.description;
          message = '变更';
          apiConfig.postUpdateConfig(postData)
            .then((res) => {
              me.showSuccessInfo(`${message}成功`);
              me.resetSlideDialog();
              me.handleTreeNodeClick(me.currentNode._id);
            })
            .catch((err) => {
              me.showErrorInfo(err);
              me.cancelSlideDialog();
            });
        }
      }
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
  .permission-search-item {
    float: left;
    margin-left: 10px;
    line-height: 100%;
  }
</style>
