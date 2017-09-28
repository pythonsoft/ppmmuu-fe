<template>
  <div>
    <fj-slide-dialog
            title="配置"
            :visible.sync="configSlideDialogVisible" @close="close">
      <div class="config-dialog-content">
        <div>{{configRow.name}}</div>
        <div v-if="configRow.description" class="config-description">{{configRow.description}}</div>
      </div>
      <permission-list :permissionData="permissionData" :readonly="readonly" @add-permission="addPermission" @delete-permission="deletePermissionConfirm"></permission-list>
    </fj-slide-dialog>
  </div>
</template>
<script>
  import { formatQuery, deepClone } from '../../../common/utils';
  import PermissionList from './permissionList';

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
        configSlideDialogVisible: false,
        addPermissionDialogVisible: false,
        permissionData: [],
        configRow: {},
        readonly: false
      };
    },
    components: {
      'permission-list': PermissionList
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
      },
      roleId(val){
        if(val && this.visible){
          this.getRoleDetail();
        }
      }
    },
    methods: {
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
              allowedPermissions[i].action = '允许';
            }

            for (let i = 0, len = deniedPermissions.length; i < len; i++) {
              deniedPermissions[i].action = '拒绝';
            }

            me.permissionData = allowedPermissions.concat(deniedPermissions);

            me.configSlideDialogVisible = true;
            me.deletePermissionDisabled = true;
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      deletePermissionConfirm(rows) {
        const me = this;
        const allowed = [];
        const denied = [];
        for (let i = 0, len = rows.length; i < len; i++) {
          if (rows[i].action === '允许') {
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
