<template>
  <div>
    <fj-tabs v-model="activeTab" @tab-click="handleTabClick">
      <fj-tab-pane
        v-for="(item, index) in TYPE_TO_MENU_CONFIG[type]"
        :label="item.label"
        :name="item.name"
        :key="item.label">
          <div :class="contentClass" v-if="parentIds[index - 1] || index === 0 || index === TYPE_TO_MENU_CONFIG[type].length - 1">
            <div class="clearfix role-wrapper" v-if="item.name !== 'effective'">
              <span class="role-title">角色</span>
              <div class="role-box">
                <fj-tag
                  v-for="role in roles"
                  type="primary"
                  :closable="index === 0"
                  :key="role._id"
                  @close="handleCloseTag(role._id)">{{ role.name }}</fj-tag>
                <fj-tag v-if="index === 0" :clickable="true" @click="handleOpenAddRoleDialog">添加角色 +</fj-tag>
              </div>
            </div>
            <permission-list
              :readonly="index !== 0"
              :permissionData="permissions"
              @add-permission="addPermission"
              @delete-permission="deletePermission"></permission-list>
            <div class="edit-permission-btn-group" v-if="index === 0">
              <fj-button @click="cancel">取消</fj-button><!--
              --><fj-button type="primary" @click="updatePermission">保存</fj-button>
            </div>
          </div>
          <div v-else>无</div>
        </fj-tab-pane>
    </fj-tabs>
    <fj-dialog
      title="添加角色"
      :visible.sync="dialogVisible">

      <fj-table :data="roleList" name="rolesTable" ref="rolesTable" @selection-change="handleSelectedRolesChange">
        <fj-table-column type="selection" width="50" align="center"></fj-table-column>
        <fj-table-column prop="_id" label="标志"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>

      <div slot="footer">
        <fj-button @click="dialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="addRoles">确定</fj-button>
      </div>

    </fj-dialog>
  </div>
</template>
<script>
  import groupAPI from '../../../../api/group';
  import roleAPI from '../../../../api/role';
  import { formatQuery, transferDataToFP } from '../../../../common/utils';
  import PermissionList from '../../role/permissionList';

  const TYPE_TO_MENU_CONFIG = {
    0: [{ label: '公司', name: 'company' }],
    1: [
      { label: '部门', name: 'department' },
      { label: '公司', name: 'company' },
      { label: '最终权限', name: 'effective' }
    ],
    2: [
      { label: '小组', name: 'group' },
      { label: '部门', name: 'department' },
      { label: '公司', name: 'company' },
      { label: '最终权限', name: 'effective' }
    ],
    3: [
      { label: '账户', name: 'account' },
      { label: '小组', name: 'group' },
      { label: '部门', name: 'department' },
      { label: '公司', name: 'company' },
      { label: '最终权限', name: 'effective' }
    ]
  };

  export default {
    props: {
      id: String,
      parentIds: Array,
      type: String,
      contentClass: String
    },
    data() {
      return {
        activeTab: '',
        roles: [],
        permissions: [],
        dialogVisible: false,
        roleList: [],
        selectedRoles: []
      };
    },
    watch: {
      id(val) {
        this.getPermission(val);
      },
      type(val) {
        this.updateActiveTab(val);
      }
    },
    created() {
      this.TYPE_TO_MENU_CONFIG = TYPE_TO_MENU_CONFIG;
      if (this.type) {
        this.updateActiveTab(this.type);
      }
      if (this.id) {
        this.getPermission(this.id);
      }
    },
    methods: {
      getPermission(id) {
        groupAPI.getOwnerPermission(formatQuery({ _id: id }, true))
          .then((response) => {
            const data = response.data;
            this.permissions = data.permissions;
            this.roles = transferDataToFP(data.roles).infos;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getEffectivePermission(requestData) {
        groupAPI.getOwnerEffectivePermission(formatQuery(requestData, true))
          .then((response) => {
            this.permissions = response.data;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateActiveTab(type) {
        this.activeTab = this.TYPE_TO_MENU_CONFIG[type][0].name;
      },
      handleTabClick(pane, index) {
        if (index === 0) {
          this.getPermission(this.id);
        } else if (index - 1 < this.parentIds.length && this.parentIds[index - 1]) {
          this.getPermission(this.parentIds[index - 1]);
        } else {
          this.getEffectivePermission({ _id: this.id, type: this.type });
        }
      },
      addPermission(isAllowed, selectedPermission) {
        let action = '拒绝';
        if (isAllowed) {
          action = '允许';
        }
        selectedPermission.forEach((item) => {
          this.permissions.push(Object.assign({}, item, { action: action }));
        });
      },
      deletePermission(selectedPermission) {
        const tempPermission = [];
        this.permissions.forEach((item) => {
          if (selectedPermission.indexOf(item) < 0) {
            tempPermission.push(item);
          }
        });
        this.permissions = tempPermission;
      },
      handleOpenAddRoleDialog() {
        this.dialogVisible = true;
        roleAPI.getRoleList()
          .then((response) => {
            this.roleList = response.data.docs;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSelectedRolesChange(val) {
        this.selectedRoles = val;
      },
      addRoles() {
        const tempRoles = transferDataToFP(this.selectedRoles).infos;
        this.roles = Object.assign({}, this.roles, tempRoles);
        this.dialogVisible = false;
      },
      handleCloseTag(id) {
        const keys = Object.keys(this.roles);
        const tempRoles = {};
        for (let i = 0; i < keys.length; i++) {
          const key = keys[i];
          if (key !== id) {
            tempRoles[key] = this.roles[key];
          }
        }
        this.roles = Object.assign({}, tempRoles);
      },
      cancel() {
        this.$emit('cancel');
      },
      updatePermission() {
        const requestData = {};
        requestData._id = this.id;
        requestData.type = this.type;
        requestData.roles = Object.values(this.roles);
        requestData.permissions = this.permissions;
        groupAPI.postUpdateOwnerPermission(requestData)
          .then((response) => {
            this.$message.success('保存成功');
            this.cancel();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      }
    },
    components: {
      PermissionList
    }
  };
</script>
<style>
  .role-title {
    float: left;
    width: 42px;
    text-align: right;
    color: #4C637B;
  }
  .role-box {
    margin-left: 62px;
  }
  .role-wrapper {
    margin-left: 16px;
  }
  .edit-permission-btn-group {
    margin-left: 16px;
    margin-top: 30px;
  }
  .edit-permission-btn-group button {
    margin-right: 10px;
  }
</style>
