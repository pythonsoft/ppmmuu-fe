<template>
  <div>
    <two-row-tree id=two-row-tree>
      <template slot="tworowtree-upper-title">分组结构</template>
      <template slot="tworowtree-upper-button">
        <fj-button size="mini" @click="clickAddGroup">添加组</fj-button>
      </template>
      <template slot="tree">
        <fj-tree
          :data="treeData"
          :topNodeIdArr= "treeTopIdArr"
          node-key="id"
          @node-click="handleTreeNodeClick"
          @current-change="handleTreeNodeCurrentChange"
          @node-expand="handleTreeNodeExpand"
          @node-collapse="handleTreeNodeCollapse">
        </fj-tree>
      </template>
    </two-row-tree>
    <four-row-layout-right-content id=two-row-tree>
      <template slot="search-left">{{currentNode.name || '配置项'}}</template>
      <template slot="search-right">
        <div class="permission-search-item">
          <fj-input placeholder="请输入关键字" v-model="name"></fj-input>
        </div>
        <div class="permission-search-item">
          <fj-button type="primary" @click="handleClickSearch">搜索</fj-button>
        </div>
      </template>
      <template slot="operation">
        <span class="permission-btn-mini-margin">
          <fj-button type="info" size="mini" v-bind:disabled="Object.keys(currentNode).length === 0" @click="handleClickAdd">增加</fj-button>
        </span>
        <span class="permission-btn-mini-margin">
          <fj-button type="info" size="mini" v-bind:disabled="change" @click="handleClickChange">变更</fj-button>
        </span>
        <span class="permission-btn-mini-margin">
          <fj-button type="info" size="mini" v-bind:disabled="deleted" @click="handleClickDeleted">删除</fj-button>
        </span>
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

      <fj-dialog
        v-bind:title="dialogTitle"
        :visible.sync="dialogVisible"
        @close="cancelDialog">
        <template v-if="dialogTitle == '新建组'">
          请输入组名称
          <fj-input v-model="groupName" autofocus />
        </template>
        <template v-else-if="dialogTitle == ''">
        </template>
        <template v-else>
          <span>{{dialogMessage}}</span>
        </template>
        <div slot="footer">
          <fj-button @click="cancelDialog">取消</fj-button>
          <fj-button type="primary" @click="confirmDialog">确定</fj-button>
        </div>
      </fj-dialog>

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
    </four-row-layout-right-content>
  </div>
</template>
<script>
  import { formatQuery, formatTree } from '../../../common/utils';
  import TwoRowTree from '../../../component/layout/twoRowTree/twoRowTree';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/fourRowLayoutRightContent';

  const api = require('../../../../../build/api/role');
  const apiConfig = require('../../../../../build/api/configuration');

  export default {
    components: {
      'two-row-tree': TwoRowTree,
      'four-row-layout-right-content': FourRowLayoutRightContent
    },
    data() {
      return {
        treeTopIdArr: [],
        action: '',
        treeData: {},
        currentNode: {},
        currentConfig: {},
        defaultRoute: '/',
        dialogVisible: false,
        dialogTitle: '提示',
        dialogMessage: '',
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
      this.handleTreeNodeClick();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleTreeNodeClick(node) {
        const me = this;
        const query = {};
        if (node === undefined) {
          query.parent = '';
        } else {
          query.parent = node.id;
        }
        apiConfig.getListGroup(formatQuery(query, true))
          .then((res) => {
            const data = formatTree(res.data, 'id').node;
            if (query.parent === '') {
              const dataKeys = Object.keys(data);
              me.treeTopIdArr = [];
              for (let i = 0; i < dataKeys.length; i++) {
                me.treeTopIdArr.push(data[dataKeys[i]].id);
                me.treeData = Object.assign(me.treeData, data);
              }
            } else {
              me.treeData = Object.assign(me.treeData, data);
            }
          })
          .catch((err) => {
            me.showErrorInfo(err);
          });
        if (node !== undefined) {
          me.currentNode = node;
          const searchObj = {
            page: me.currentPage,
            pageSize: me.pageSize,
            groupId: node.id
          };
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
        }
      },
      handleClickSearch() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          name: me.name
        };
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
        this.dialogTitle = '提示';
        this.dialogMessage = '确定要删除这些配置吗?';
        this.dialogVisible = true;
        this.action = 'deleteConfig';
      },
      resetDialog() {
        this.dialogTitle = '提示';
        this.dialogMessage = '';
        this.dialogVisible = false;
        this.action = '';
      },
      cancelDialog() {
        this.resetDialog();
      },
      confirmDialog() {
        const me = this;
        const postData = {};
        let message = '';
        if (this.action === 'addGroup') {
          postData.parent = this.currentNode.id || '';
          postData.name = this.groupName;
          message = '增加';
          apiConfig.postAddGroup(postData)
            .then((res) => {
              me.showSuccessInfo(`${message}成功`);
              me.resetDialog();
              me.handleTreeNodeClick();
            })
            .catch((err) => {
              me.showErrorInfo(err);
              me.resetDialog();
            });
        } else if (this.action === 'deleteConfig') {
          postData.id = this.currentConfig._id;
          message = '删除';
          apiConfig.postDeleteConfig(postData)
            .then((response) => {
              me.showSuccessInfo(`${message}成功!`);
              me.resetDialog();
              me.handleTreeNodeClick(me.currentNode);
            })
            .catch((error) => {
              me.showErrorInfo(error);
              me.resetDialog();
            });
        } else {
          this.resetDialog();
        }
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
        this.handleTreeNodeClick();
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
              me.handleTreeNodeClick(me.currentNode);
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
              me.handleTreeNodeClick(me.currentNode);
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
  #two-row-tree {
    float: left;
    min-width: 192px;
  }

  .permission-search-item{
    float: left;
    margin-left: 10px;
  }

  .permission-btn-mini-margin {
    margin-left: 6px;
    font-size: 12px;
  }

  .permission-table-pagination {
    margin-top: 30px;
    text-align: center;
    height: 28px;
    line-height: 28px;
    color: #4C637B;
  }

  .permission-status-span {
    font-size: 12px;
    color: #FFFFFF;
    width: 48px;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    text-align:center;
    display: block;
  }

  .permission-enable {
    background: #2EC4B6;
  }

  .permission-disable {
    background: #FF3366;
  }
</style>
