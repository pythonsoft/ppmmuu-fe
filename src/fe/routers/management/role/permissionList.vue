<template>
  <div class="config-dialog-content">
    <div class="permission-operation">
      <span class="permission-title">权限项</span>
      <fj-button type="info" size="mini" @click="addPermissionClick"  v-if="!readonly">增加</fj-button>
      <fj-button type="danger" size="mini" @click="deletePermissionClick" v-bind:disabled="deletePermissionDisabled"  v-if="!readonly">删除</fj-button>
    </div>
    <div class="permissions">
      <fj-table :data="permissionData" name="table" ref="table" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="20" v-if="!readonly"></fj-table-column>
        <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="action" label="行为"></fj-table-column>
      </fj-table>
    </div>
    <add-permission :visible.sync="addPermissionDialogVisible" @add-permission="addPermission"></add-permission>

    <fj-dialog
            title="提示"
            :visible.sync="deletePermissionDialogVisible"
            @close="deletePermissionDialogVisible=false">

      <span>确定要删除这些权限吗?</span>

      <div slot="footer">
        <fj-button @click="deletePermissionDialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="deletePermissionConfirm">确定</fj-button>
      </div>

    </fj-dialog>
  </div>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import AddPermission from './searchAddPermission';
  const api = require('../../../api/role');

  export default {
    name: 'permissionList',
    props: {
      readonly: {
        type: Boolean,
        default: false
      },
      permissionData: {
        type: Array,
        default() { return []; }
      }
    },
    data() {
      return {
        addOwnerDialogVisible: false,
        deletePermissionDialogVisible: false,
        deletePermissionDisabled: true,
        addPermissionDialogVisible: false,
        keyword: ''
      };
    },
    components: {
      "add-permission": AddPermission
    },
    mounted() {
    },
    methods: {
      handleSelectionChange(rows) {
        if (rows.length > 0) {
          this.deletePermissionDisabled = false;
          this.selectedDeletePermissions = rows;
        }
      },
      deletePermissionConfirm(){
        this.$emit("delete-permission", this.selectedDeletePermissions);
        this.deletePermissionDialogVisible = false;
        this.deletePermissionDisabled = true;
      },
      addPermissionClick() {
        this.addPermissionDialogVisible = true;
      },
      addPermission(isAllowed, rows){
        this.$emit('add-permission',isAllowed, rows);
      },
      deletePermissionClick() {
        this.deletePermissionDialogVisible = true;
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>

<style>
  .config-dialog-content {
    margin-left:16px;
    width: 100%;
  }
  .permission-operation {
    margin-top: 20px;
  }

  .permission-title {
    margin-right: 20px;
    color: #4C637B;
  }

  .permissions {
    width: 100%;
    max-height: 500px;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    overflow: scroll;
    margin-top: 20px;
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