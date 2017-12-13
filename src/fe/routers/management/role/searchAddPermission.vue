<template>
  <fj-dialog
          title="权限项"
          :visible.sync="permissionDialogVisible"
          @close="close">
    <div class="manage-search">
      <fj-input placeholder="输入名字或权限组搜索" size="mini" v-model="keyword" icon="icon-search input-search-icon" @on-icon-click="searchPermissionClick" @keydown.native.enter.prevent="searchPermissionClick"></fj-input>
    </div>
    <div class="permission-list-table">
      <fj-table :data="permissionListData" name="table2" ref="table2" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20"></fj-table-column>
        <fj-table-column prop="status" label="状态"><template slot-scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="groupIndex" label="权限组" ></fj-table-column>
        <fj-table-column prop="description" label="描述" ></fj-table-column>
      </fj-table>
    </div>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="close">取消</fj-button><!--
      --><fj-button type="info" @click="addAllowedClick">添加允许权限</fj-button><!--
      --><fj-button type="danger" @click="addDeniedClick">添加拒绝权限</fj-button>
    </div>

  </fj-dialog>
</template>
<script>
  import { formatQuery } from '../../../common/utils';

  const api = require('../../../api/role');
  const groupApi = require('../../../api/group');

  export default {
    name: 'addGroup',
    props: {
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        permissionDialogVisible: false,
        permissionListData: [],
        keyword: ''
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.searchPermissionClick();
          this.permissionDialogVisible = val;
        } else {
          this.permissionDialogVisible = val;
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      searchPermissionClick() {
        const me = this;
        api.getPermissionList(formatQuery({ keyword: me.keyword, pageSize: 999 }, true))
          .then((res) => {
            me.permissionListData = res.data.docs;
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      handleSelectionChange(rows) {
        this.selectedRows = rows;
      },
      addPermission(isAllowed) {
        if (!this.selectedRows || this.selectedRows === 0) {
          this.showErrorInfo('请先勾选权限');
          return false;
        }
        this.$emit('add-permission', isAllowed, this.selectedRows);
        return true;
      },
      addAllowedClick() {
        this.addPermission(true);
      },
      addDeniedClick() {
        this.addPermission(false);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style>
  .permission-list-table {
    width: 100%;
    height: 300px;
    overflow: scroll;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    margin-top: 20px;
  }

  .manage-search {
    margin-top: 14px;
    margin-bottom: 16px;
    height: 30px;
    width: 100%;
    font-size: 12px;
  }

  .permission-status-span {
    font-size: 12px;
    color: #FFFFFF;
    width: 60px;
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
