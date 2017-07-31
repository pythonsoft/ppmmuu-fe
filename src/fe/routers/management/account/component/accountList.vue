<template>
  <four-row-layout-right-content v-if="group._id">
    <template slot="search-left">{{ group.name }}</template>
    <template slot="search-right">
      <div class="search-item" :style="{ width: '78px' }">
        <fj-select v-model="status">
          <fj-option
            v-for="item in STATUS_OPTIONS"
            :key="item.value"
            :label="item.label"
            :value="item.value"></fj-option>
        </fj-select>
      </div>
      <div class="search-item" :style="{ width: '190px' }">
        <fj-input placeholder="请输入账户名" v-model="keyword"></fj-input>
      </div>
      <div class="search-item">
        <fj-button type="primary" @click="handleSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" @click="showEditUserDialog('add')">增加</fj-button>
        <fj-button size="mini" type="primary" :disabled="selectedItems.length<=0" @click="">调整部门</fj-button>
        <fj-button size="mini" type="primary" :disabled="selectedItems.length!=1" @click="showEditUserDialog('edit')">修改</fj-button>
        <fj-button size="mini" type="primary" :disabled="selectedItems.length!=1" @click="showPermissionDialog">修改权限</fj-button>
      </div>
      <div class="operation-btn-group">
        <fj-button size="mini" type="primary" :disabled="selectedItems.length<=0" @click="showUserStatusDialog('enable')">启用</fj-button>
        <fj-button size="mini" type="primary" :disabled="selectedItems.length<=0" @click="showUserStatusDialog('disabled')">禁用</fj-button>
        <fj-button size="mini" type="primary" :disabled="selectedItems.length<=0" @click="showUserStatusDialog('delete')">删除</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="accountTable" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="50" align="center"></fj-table-column>
        <fj-table-column prop="status" label="状态" width="50" align="center">
          <template scope="props">
            <span :class="STATUS_CONFIG[props.row.status].class">{{ STATUS_CONFIG[props.row.status].text }}</span>
          </template>
        </fj-table-column>
        <fj-table-column prop="name" label="姓名"></fj-table-column>
        <fj-table-column prop="email" label="邮箱"></fj-table-column>
        <fj-table-column prop="verifyType" label="验证方式">
          <template scope="props">
            {{ VERIFY_TYPE_CONFIG[props.row.verifyType] }}
          </template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <fj-slide-dialog
      :title="editUserDialogTitle"
      :visible.sync="editUserDialogVisible">
        <edit-user-content
          :type="editUserDialogType"
          :companyId="companyId"
          :id="editUserDialogId"
          @close="editUserDialogVisible = false"
          @updateList="updateList"></edit-user-content>
    </fj-slide-dialog>
    <fj-slide-dialog
      title="修改权限信息"
      :visible.sync="permissionDialogVisible">
        <permission-content
          :id="permissionDialogId"
          :parentIds="permissionDialogParentIds"
          :type="PERMISSION_TYPE_CONFIG.user.type"
          @cancel="permissionDialogVisible=false"></permission-content>
    </fj-slide-dialog>
    <fj-dialog
      :title="editUserStatusDialogTitle"
      :visible.sync="editUserStatusDialogVisible">

      <p>您确定要{{ editUserStatusDialogTitle }}吗？</p>

      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="editUserStatusDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" @click.stop="editUserStatusFn">确定</fj-button>
      </div>

    </fj-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import FourRowLayoutRightContent from '../../../../component/layout/fourRowLayoutRightContent';
  import EditUserContent from './editUserContent';
  import PermissionContent from './permissionContent';
  import groupAPI from '../../../../api/group';
  import { formatQuery } from '../../../../common/utils';

  const STATUS_OPTIONS = [
    { value: 'all', label: '全部' },
    { value: '1', label: '启用' },
    { value: '0', label: '禁用' }
  ];
  const STATUS_CONFIG = {
    0: { class: 'status-danger', text: '禁用' },
    1: { class: 'status-success', text: '启用' }
  };
  const VERIFY_TYPE_CONFIG = {
    0: '密码',
    1: '域'
  };
  const PERMISSION_TYPE_CONFIG = {
    company: { type: '0', text: '公司' },
    department: { type: '1', text: '部门' },
    group: { type: '2', text: '小组' },
    user: { type: '3', text: '账户' }
  };

  export default {
    props: {
      group: Object,
      companyId: String
    },
    data() {
      return {
        keyword: '',
        status: 'all',
        selectedItems: [],
        tableData: [],
        total: 0,
        currentPage: 0,
        pageSize: 20,
        editUserDialogVisible: false,
        permissionDialogId: '',
        permissionDialogParentIds: [],
        permissionDialogVisible: false,
        editUserDialogTitle: '添加账户',
        editUserDialogType: 'add',
        editUserDialogId: '',
        editUserStatusDialogVisible: false,
        editUserStatusDialogTitle: '删除成员',
        editUserStatusIds: [],
        editUserStatusFn: () => {}
      };
    },
    created() {
      this.STATUS_OPTIONS = STATUS_OPTIONS;
      this.STATUS_CONFIG = STATUS_CONFIG;
      this.VERIFY_TYPE_CONFIG = VERIFY_TYPE_CONFIG;
      this.PERMISSION_TYPE_CONFIG = PERMISSION_TYPE_CONFIG;
      this.EDIT_USER_STATUS_CONFIG = {
        enable: { text: '启用成员', fn: () => { this.enableUser('1'); } },
        disabled: { text: '禁用成员', fn: () => { this.enableUser('0'); } },
        delete: { text: '删除成员', fn: this.deleteUser }
      };
      if (this.group._id) {
        const data = {
          page: 1
        };
        this.updateList(data);
      }
    },
    watch: {
      group(val) {
        if (val._id) {
          this.keyword = '';
          this.status = 'all';
          const data = {
            _id: val._id,
            type: val.type,
            page: 1
          };
          this.updateList(data);
        }
      }
    },
    methods: {
      updateList(requestData) {
        const data = {
          _id: this.group._id,
          type: this.group.type,
          status: this.status === 'all' ? '' : this.status,
          keyword: this.keyword,
          page: this.currentPage,
          pageSize: this.pageSize
        };
        Object.assign(data, requestData);
        groupAPI.getGroupUserList(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            this.tableData = responseData.docs;
            this.currentPage = responseData.page;
            this.total = responseData.total;
            this.selectedItems = [];
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSearch() {
        // const data = {
        //   _id: this.group._id,
        //   type: this.group.type,
        //   status: this.status === 'all' ? '' : this.status,
        //   keyword: this.keyword,
        //   page: this.currentPage,
        //   pageSize: this.pageSize
        // };
        // this.updateList(data);
        this.updateList();
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      handleCurrentPageChange(newPage, oldPage) {
        if (oldPage !== 0 && newPage > 0) {
          // const data = {
          //   _id: this.group._id,
          //   type: this.group.type,
          //   status: this.status === 'all' ? '' : this.status,
          //   keyword: this.keyword,
          //   page: newPage,
          //   pageSize: this.pageSize
          // };
          // this.updateList(data);
          this.updateList();
        }
      },
      showEditUserDialog(type) {
        this.editUserDialogVisible = true;
        this.editUserDialogType = type;
        if (type === 'edit') {
          this.editUserDialogId = this.selectedItems[0]._id;
        }
      },
      showPermissionDialog() {
        this.permissionDialogVisible = true;
        const selectedItem = this.selectedItems[0];
        this.permissionDialogId = selectedItem._id;
        this.permissionDialogParentIds = [
          selectedItem.team._id,
          selectedItem.department._id,
          selectedItem.company._id
        ];
      },
      showUserStatusDialog(type) {
        this.editUserStatusDialogVisible = true;
        this.editUserStatusDialogTitle = this.EDIT_USER_STATUS_CONFIG[type].text;
        this.editUserStatusFn = this.EDIT_USER_STATUS_CONFIG[type].fn;
        this.editUserStatusIds = this.selectedItems.map(item => item._id);
      },
      deleteUser() {
        groupAPI.postDeleteGroupUser({ _ids: this.editUserStatusIds.join(',') })
          .then((response) => {
            this.updateList();
            this.editUserStatusDialogVisible = false;
            this.$message.success('保存成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      enableUser(status) {
        groupAPI.postEnableGroupUser({ _ids: this.editUserStatusIds.join(','), status: status })
          .then((response) => {
            this.updateList();
            this.editUserStatusDialogVisible = false;
            this.$message.success('保存成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
    components: {
      FourRowLayoutRightContent,
      EditUserContent,
      PermissionContent
    }
  };
</script>
<style>
  .search-item {
    float: left;
    margin-left: 10px;
  }
  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }
  .status-danger,
  .status-success {
    text-align: center;
    display: inline-block;
    width: 48px;
    line-height: 20px;
    border-radius: 2px;
    color: #fff;
  }
  .status-danger {
    background-color: #FF3366;
  }
  .status-success {
    background-color: #2EC4B6;
  }
</style>
