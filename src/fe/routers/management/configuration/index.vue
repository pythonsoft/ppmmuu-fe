<template>
  <div>
    <two-row-tree id=two-row-tree>
      <template slot="tworowtree-upper-title">分组结构</template>
      <template slot="tworowtree-upper-button">
        <fj-button size="mini" @click="clickAddGroup">添加组织</fj-button>
      </template>
      <template slot="tree">
        <fj-tree
          :data="treeData"
          :topNodeIdArr= "treeTopIdArr"
          node-key="id"
          @node-click="handleTreeNodeClick">
          @current-change="handleTreeNodeCurrentChange"
          @node-expand="handleTreeNodeExpand"
          @node-collapse="handleTreeNodeCollapse"
        </fj-tree>
      </template>
    </two-row-tree>
    <four-row-layout-right-content id=two-row-tree>
      <template slot="search-left">权限</template>
      <template slot="search-right">
        <div class="permission-search-item">
          <fj-input placeholder="请输入权限名" v-model="name"></fj-input>
        </div>
        <div class="permission-search-item">
          <fj-button type="primary" @click="handleClickSearch">搜索</fj-button>
        </div>
      </template>
       <template slot="operation">
         <span class="permission-btn-mini-margin">
           <fj-button type="info" size="mini" v-bind:disabled="enabled" @click="handleClickEnable">启用</fj-button>
         </span>
         <span class="permission-btn-mini-margin">
           <fj-button type="info" size="mini" v-bind:disabled="disabled" @click="handleClickDisable">禁用</fj-button>
         </span>
       </template>
        <template slot="table">
          <fj-table :data="tableData" name="table1" ref="table" @selection-change="handleSelectionChange">
            <fj-table-column type="selection" width="20" align="center"></fj-table-column>
            <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
            <fj-table-column prop="name" label="名称" ></fj-table-column>
            <fj-table-column prop="description" label="描述"></fj-table-column>
          </fj-table>
        </template>
        <template slot="pagination">
          <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
        </template>
      <fj-dialog
              title="提示"
              :visible.sync="dialogVisible"
              @close="cancelDialog">

        <span>{{dialogMessage}}</span>

        <div slot="footer">
          <fj-button @click="cancelDialog">取消</fj-button>
          <fj-button type="primary" @click="confirmDialog">确定</fj-button>
        </div>

      </fj-dialog>
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
        treeData: {},
        defaultRoute: '/',
        dialogVisible: false,
        dialogMessage: '',
        name: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        enabled: true,
        disabled: true
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
        console.log('node:', node);
        console.log('this.treeData', this.treeData);
        if (node === undefined) {
          query.parent = '';
        } else {
          query.parent = node.id;
        }
        apiConfig.getListGroup(formatQuery(query, true))
        .then((res) => {
          let data = formatTree(res.data, 'id');
          if (query.parent === '') {
            const dataKeys = Object.keys(data);
            for (let i = 0; i < dataKeys.length; i++) {
              me.treeTopIdArr = [];
              me.treeTopIdArr.push(data[dataKeys[i]].id);
              me.treeData = Object.assign(me.treeData, data.node);
            }
          } else {
            me.treeData = data;
          }
        })
        .catch((err) => {
          me.showErrorInfo(err);
        });
      },
      handleClickSearch() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          name: me.name,
          status: me.status
        };
        api.getPermissionList(formatQuery(searchObj, true))
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
      handleClickEnable() {
        this.dialogMessage = '确定要启用这些权限吗?';
        this.dialogVisible = true;
        this.enableOrDisable = 'enable';
      },
      handleClickDisable() {
        this.dialogMessage = '确定要禁用这些权限吗?';
        this.dialogVisible = true;
        this.enableOrDisable = 'disable';
      },
      resetDialog() {
        this.dialogMessage = '';
        this.dialogVisible = false;
        this.enableOrDisable = '';
      },
      cancelDialog() {
        this.resetDialog();
      },
      confirmDialog() {
        const me = this;
        let postData = {};
        let message = '';
        if (this.enableOrDisable === 'enable') {
          postData = {
            _ids: this.selectedEnableIds.join(','),
            status: '0'
          };
          message = '启用';
        } else if (this.enableOrDisable === 'disable') {
          postData = {
            _ids: this.selectedDisableIds.join(','),
            status: '1'
          };
          message = '禁用';
        } else {
          this.resetDialog();
          return;
        }

        api.postEnablePermission(postData)
          .then((response) => {
            me.showSuccessInfo(`${message}成功!`);
            me.handleClickSearch();
          })
          .catch((error) => {
            me.showErrorInfo(error);
            me.resetDialog();
          });
      },
      handleSelectionChange(rows) {
        this.selectedDisableIds = [];
        this.selectedEnableIds = [];
        if (rows && rows.length) {
          for (let i = 0, len = rows.length; i < len; i++) {
            const row = rows[i];
            if (row.status === '0') {
              this.selectedDisableIds.push(row._id);
            } else {
              this.selectedEnableIds.push(row._id);
            }
          }
        }
        this.enabled = !this.selectedEnableIds.length;
        this.disabled = !this.selectedDisableIds.length;
      },
      clearTableSelection() {
        this.$refs.table.clearSelection();
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      },
      handleTreeNodeCurrentChange() {},
      handleTreeNodeExpand() {},
      handleTreeNodeCollapse() {},
      clickAddGroup() {}
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
