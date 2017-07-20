<template>
  <div>
    <fj-slide-dialog
            title="配置"
            :visible.sync="configSlideDialogVisible" @close="close">
      <div class="config-dialog-content">
        <div>{{configRow.name}}</div>
        <div v-if="configRow.description" class="config-description">{{configRow.description}}</div>
        <div class="permission-operation">
          <span class="permission-title">权限项</span>
          <fj-button type="info" size="mini" @click="addPermissionClick">增加</fj-button>
          <fj-button type="danger" size="mini" @click="deletePermissionClick" v-bind:disabled="deletePermissionDisabled">删除</fj-button>
        </div>
        <div class="permissions">
          <fj-table :data="permissionData" name="table1" ref="table1" @selection-change="handleSelectionChange">
            <fj-table-column type="selection" width="20"></fj-table-column>
            <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
            <fj-table-column prop="name" label="名称" ></fj-table-column>
            <fj-table-column prop="allowed" label="行为"></fj-table-column>
          </fj-table>
        </div>
      </div>
    </fj-slide-dialog>

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
    <add-permission :visible.sync="addPermissionDialogVisible" @add-permission="addPermission"></add-permission>
  </div>
</template>
<script>
  import { formatQuery, deepClone } from '../../../common/utils';
  import AddPermission from './searchAddPermission';
  const api = require('../../../api/role');

  export default {
    name: 'configRole',
    props: {
      roleId: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        permissionDialogVisible: false,
        configSlideDialogVisible: false,
        deletePermissionDisabled: true,
        deletePermissionDialogVisible: false,
        addPermissionDialogVisible: false,
        permissionData: [],
        permissionListData: [],
        configRow: {}
      };
    },
    components: {
      'add-permission': AddPermission
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.getRoleDetail();
          this.configSlideDialogVisible = val;
        } else {
          this.configSlideDialogVisible = val;
        }
      }
    },
    methods: {
      handleSelectionChange(rows) {
        if (rows.length > 0) {
          this.deletePermissionDisabled = false;
          this.selectedDeletePermissions = rows;
        }
      },
      getRoleDetail() {
        const me = this;
        api.getRoleDetail(formatQuery({ _id: this.roleId }, true))
          .then((res) => {
            const data = deepClone(res.data);
            const allowed = [];
            const denied = [];

            for (let i = 0, len = data.allowedPermissions.length; i < len; i++) {
              allowed.push(data.allowedPermissions[i].path);
            }

            for (let i = 0, len = data.deniedPermissions.length; i < len; i++) {
              denied.push(data.deniedPermissions[i].path);
            }

            data.allowedPermissions = allowed;
            data.deniedPermissions = denied;
            me.configRow = data;

            me.roleDetail = res.data;
            const allowedPermissions = me.roleDetail.allowedPermissions;
            const deniedPermissions = me.roleDetail.deniedPermissions;
            for (let i = 0, len = allowedPermissions.length; i < len; i++) {
              allowedPermissions[i].allowed = '允许';
            }

            for (let i = 0, len = deniedPermissions.length; i < len; i++) {
              deniedPermissions[i].allowed = '拒绝';
            }

            me.permissionData = allowedPermissions.concat(deniedPermissions);

            me.configSlideDialogVisible = true;
            me.deletePermissionDisabled = true;
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      addPermissionClick() {
        this.addPermissionDialogVisible = true;
      },
      deletePermissionClick() {
        this.deletePermissionDialogVisible = true;
      },
      deletePermissionConfirm() {
        const me = this;
        const rows = this.selectedDeletePermissions;
        const allowed = [];
        const denied = [];
        for (let i = 0, len = rows.length; i < len; i++) {
          if (rows[i].allowed === '允许') {
            allowed.push(rows[i].path);
          } else {
            denied.push(rows[i].path);
          }
        }
        const postData = {
          _id: this.roleId,
          allowedPermissions: allowed,
          deniedPermissions: denied
        };
        api.postUpdateRoleDeletePermission(postData)
          .then((res) => {
            me.deletePermissionDialogVisible = false;
            me.showSuccessInfo('删除权限成功!');
            me.getRoleDetail();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      addPermission(isAllowed, selectedPermission) {
        const selectedPermissionPaths = [];
        for (let i = 0, len = selectedPermission.length; i < len; i++) {
          selectedPermissionPaths.push(selectedPermission[i].path);
        }
        const _id = this.configRow._id;
        const message = isAllowed ? '添加允许权限成功!' : '添加拒绝权限成功!';
        const key = isAllowed ? 'allowedPermissions' : 'deniedPermissions';
        const me = this;
        const postData = {
          _id: _id
        };
        postData[key] = selectedPermissionPaths;
        api.postUpdateRoleAddPermission(postData)
          .then((res) => {
            me.showSuccessInfo(message);
            me.getRoleDetail();
          }).catch((error) => {
            me.showSuccessInfo(error);
          });
      },
      close() {
        this.$emit('update:visible', false);
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style>
  .permission-operation {
    margin-top: 20px;
    margin-bottom: 15px;
  }

  .permission-title {
    margin-right: 20px;
  }

  .permissions {
    width: 100%;
    max-height: 500px;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    overflow: scroll;
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

  .config-dialog-content {
    margin-left:16px;
    width: 100%;
  }

  .config-description {
    margin-top: 14px;
    padding: 14px 15px 13px 16px;
    border: 1px solid #CED9E5;
    border-radius: 2px;
    width: 100%;
  }
</style>
