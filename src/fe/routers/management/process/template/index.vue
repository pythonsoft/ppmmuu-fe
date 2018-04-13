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
        :default-tree-data="[{_id: 'all', parentId: '', name: '全部', children: [], isFolder: true}]"
        default-expanded-key="all"
      ></tree-view>
    </div>
    <div class="right-list">
      <layout-four-row v-show="mainContent === 'default'">
        <template slot="search-left">流程模板管理</template>
        <template slot="operation">
          <div class="operation-btn-group">
            <fj-button type="primary" size="mini" @click="addClick">添加</fj-button>
            <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="updateClick">变更</fj-button>
            <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="deleteClick">删除</fj-button>
          </div>
          <div class="operation-btn-group">
            <fj-button type="primary" size="mini" @click="handleClickSearch">刷新</fj-button>
          </div>
        </template>
        <template slot="table">
          <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
            <fj-table-column prop="_id" width="260" label="标识"></fj-table-column>
            <fj-table-column prop="name" label="名称"></fj-table-column>
            <fj-table-column width="100" label="类型">
              <template slot-scope="props">{{ getTextByValue(props.row.type) }}</template>
            </fj-table-column>
            <fj-table-column prop="createTime" width="160" label="创建时间">
              <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
            </fj-table-column>
            <fj-table-column prop="description" width="240" label="描述"></fj-table-column>
          </fj-table>
        </template>

        <template slot="pagination">
          <fj-pagination
            :page-size="pageSize"
            :total="total"
            :current-page.sync="page"
            @current-change="pageChange">
          </fj-pagination>
        </template>

        <dialog-view
          :templateInfo="templateInfo"
          :visible.sync="dialogDisplay"
          :type="table.type"
          :groupId="currentNode._id || ''"
          @listTemplate="handleClickSearch"
        ></dialog-view>

        <fj-dialog title="删除模板" :visible.sync="confirmDialogDisplay" @close="confirmDialogDisplay=false">
          <template>
            <span>确定要删 {{ table.currentRowInfo.name }} 这块模板？</span>
          </template>
          <div slot="footer" class="dialog-footer">
            <fj-button @click="confirmDialogDisplay=false">取消</fj-button><!--
            --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
          </div>
        </fj-dialog>

        <fj-dialog title="删除提示" :visible.sync="deleteDialogVisible">
          <p>删除组后，组下面的流程模板将全部删除，您确定要删除吗？</p>
          <div slot="footer" class="dialog-footer">
            <fj-button @click.stop="deleteDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="handleDeleteClick">确定</fj-button>
          </div>
        </fj-dialog>

        <add-group
          :parentId="addGroupDialogParentId"
          :dialogVisible.sync="isShowAddGroupDialog"
          @added="vueInstance.$emit('tree.listGroup', addGroupDialogParentId)"
        ></add-group>

        <edit-group
          :id="nodeInfo._id"
          :dialogVisible.sync="isShowEditGroupDialog"
          @edited="(newInfo)=>{vueInstance.$emit('tree.updateNode', nodeInfo._id, newInfo)}"
        ></edit-group>

      </layout-four-row>
    </div>
  </div>
</template>
<script>
  import './index.css';
  import Vue from 'vue';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import TreeView from '../../../../component/higherOrder/tree/_index';
  import dialog from './dialog';
  import utils from '../../../../common/utils';
  import { formatQuery } from '../../../../common/utils';
  import addGroup from './component/addGroupDialog';
  import editGroup from './component/editGroup';

  const api = require('../../../../api/processTemplate');
  const config = require('./config');
  const MENU_CONFIG = require('./menuConfig');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'dialog-view': dialog,
      'add-group': addGroup,
      'edit-group': editGroup,
      'tree-view': TreeView,
    },
    data() {
      return {
        dropMenus: MENU_CONFIG,
        isDisabled: true,

        table: {
          currentRowInfo: {},
          type: 'add'
        },

        templateInfo: null,

        formData: {
          type: ''
        },

        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,
        mainContent: 'default',
        permissionPanelId: '',
        permissionPanelName: '',
        /* child task */
        dialogDisplay: false,
        confirmDialogDisplay: false,

        clickNodeSearch: true,
        currentNode: {},
        nodeInfo: {},
        deleteDialogVisible: false,
        dialogTitle: '',
        isDeleteBtnLoading: false,
        addGroupDialogParentId: '',
        isShowAddGroupDialog: false,
        isShowEditGroupDialog: false,
      };
    },
    created() {
      this.vueInstance = new Vue({
        name: 'downloadTemplate'
      });
      this.handleTreeNodeClick();
    },
    destroyed() {
    },
    methods: {
      handleTreeNodeClick(id = '', cb) {
        const me = this;
        const query = {};
        query.isIncludeChild = '1';
        // if (node === undefined) {
        //   query.parentId = '';
        // } else {
          if (id !== 'all') {
            query.parentId = id;
          } else {
            query.parentId = '';
          }
        // }
        me.groupId = query.parentId;
        me.clickNodeSearch = true;
        api.listGroup(formatQuery(query, true))
          .then((res) => {
            cb && cb(res.data.docs);
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
        //     groupId: node.id === 'all' ? '' : node.id
        //   };
        //   me.listTemplate(searchObj);
        // }
      },
      execCommand(command, node) {
        const title = '组织';
        switch (command) {
          case 'delete':
            this.handleOpenDeleteDialog(node._id);
            break;
          case 'new':
            this.handleOpenAddDialog(node._id);
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
        this.mainContent = 'default';
        this.currentNode = treeNode;
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          groupId: treeNode._id === 'all' ? '' : treeNode._id
        };
        me.listTemplate(searchObj);
      },
      handleOpenAddDialog(_id) {
        this.isShowAddGroupDialog = true;
        this.addGroupDialogParentId = _id;
      },

      handleShowEditDialog(info) {
        this.isShowEditGroupDialog = true;
        this.nodeInfo = info;
      },
      handleOpenDeleteDialog(_id) {
        this.deleteDialogVisible = true;
        this.dialogTitle = '组';
        this.deleteDialogId = _id;
      },
      handleDeleteClick() {
        const me = this;
        const func = api.removeGroup;
        const _id = this.dialogTitle === '组'
          ? this.deleteDialogId
          : this.currentConfig._id;
        me.isDeleteBtnLoading = true;

        func({ groupId: _id }, me)
          .then((res) => {
            me.showSuccessInfo('删除成功');
            me.deleteDialogVisible = false;
            if (this.dialogTitle === '组') {
              me.vueInstance.$emit('tree.removeNode', this.deleteDialogId);
            } else {
              this.handleClickSearch();
            }
          }).catch((error) => {
            me.showErrorInfo(error);
          }).then(() => {
            me.isDeleteBtnLoading = false;
          });
      },
      listTemplate(searchObj) {
        const me = this;
        api.list(formatQuery(searchObj, true))
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
          })
          .catch((error) => {
            // me.showErrorInfo(error);
          });
      },
      getTextByValue(type) {
        return config.getTextValueByType[type] || '';
      },
      handleClickSearch() {
        const param = {
          page: this.page,
          pageSize: this.pageSize,
          groupId: (this.currentNode._id && this.currentNode._id !== 'all') ? this.currentNode._id : ''
        };
        this.listTemplate(param);
      },
      addClick() {
        this.table.type = 'add';
        this.dialogDisplay = true;
        this.templateInfo = null;
      },
      updateClick() {
        this.table.type = 'update';
        this.dialogDisplay = true;
        this.templateInfo = this.table.currentRowInfo;
      },
      deleteClick() {
        this.confirmDialogDisplay = true;
      },
      /* table */
      handleCurrentChange(current) {
        this.table.currentRowInfo = current;
        this.isDisabled = false;
      },
      pageChange(val) {
        this.page = val;
        this.listTemplate();
      },
      confirmDialog() {
        const me = this;

        api.remove({ id: this.table.currentRowInfo._id }, me).then((res) => {
          me.showSuccessInfo('删除成功');
          me.handleTreeNodeClick(me.currentNode);
          me.confirmDialogDisplay = false;
        }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },

      showErrorInfo(message) {
        this.$message.error(message);
      },

    }
  };
</script>
