<template>
  <template>
    <fj-slide-dialog
            title="配置"
            :visible.sync="configSlideDialogVisible">
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
            title="权限项"
            :visible.sync="permissionDialogVisible"
            @close="permissionDialogVisible=false">
      <div class="permission-list-table">
        <fj-table :data="permissionListData" name="table2" ref="table2" @selection-change="handleSelectionChange2">
          <fj-table-column type="selection" width="20"></fj-table-column>
          <fj-table-column prop="status" label="状态"><template scope="props"><span :class="props.row.status == '0' ? 'permission-status-span permission-enable': 'permission-status-span permission-disable'">{{ props.row.status == '0' ? '启用':'禁用'}}</span></template></fj-table-column>
          <fj-table-column prop="name" label="名称" ></fj-table-column>
        </fj-table>
      </div>
      <div slot="footer">
        <fj-button @click="permissionDialogVisible=false">取消</fj-button>
        <fj-button type="info" @click="addAllowedClick">添加允许权限</fj-button>
        <fj-button type="danger" @click="addDeniedClick">添加拒绝权限</fj-button>
      </div>

    </fj-dialog>

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
  </template>
</template>
<script>
  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent
    },
    data() {
      return {
        defaultRoute: '/',
        slideDialogTitle: '添加角色',
        permissionDialogVisible: false,
        configSlideDialogVisible: false,
        deletePermissionDisabled: true,
        deletePermissionDialogVisible: false,
        configRow: {},
        permissionData: [],
        permissionListData: [],

      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.handleClickSearch();
    },
    watch: {
      data(val) {
        this.configRow = val;
        this.clearSelection();
      }
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleSelectionChange(){
        if(rows.length > 0) {
          this.deletePermissionDisabled = false;
          this.selectedDeletePermissions = rows;
        }
      },
      addPermissionClick(){
        const me = this;
        api.getPermissionList({ params: formatQuery({ pageSize: 999 }) })
                .then((res) => {
          me.permissionListData = res.data.docs;
        me.permissionDialogVisible = true;
      }).catch((error) => {
          me.showErrorInfo(error);
      });
      },
      deletePermissionClick(){
        this.deletePermissionDialogVisible = true;
      },
      deletePermissionConfirm(){
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
          _id: this.configRow._id,
          allowedPermissions: allowed,
          deniedPermissions: denied
        };
        api.postUpdateRoleDeletePermission(postData)
                .then((res) => {
          me.deletePermissionDialogVisible = false;
        me.showSuccessInfo('删除权限成功!');
        me.getRoleList();
        me.getRoleDetail();
      }).catch((error) => {
          me.showErrorInfo(error);
      });
      },
      handleSelectionChange2(){
        this.selectedPermissionPaths = [];
        for (let i = 0, len = rows.length; i < len; i++) {
          this.selectedPermissionPaths.push(rows[i].path);
        }
      },
      addPermission(isAllowed) {
        const _id = this.configRow._id;
        const message = isAllowed ? '添加允许权限成功!' : '添加拒绝权限成功!';
        const key = isAllowed ? 'allowedPermissions' : 'deniedPermissions';
        const me = this;
        const postData = {
          _id: _id
        };
        postData[key] =  this.selectedPermissionPaths;
        api.postUpdateRoleAddPermission(postData)
                .then((res) => {
          me.showSuccessInfo(message);
        me.getRoleList();
        me.getRoleDetail();
      }).catch((error) => {
          me.showSuccessInfo(error);
      });
      },
      addAllowedClick(){
        this.addPermission(true);
      },
      addDeniedClick(){
        this.addPermission(false);
      }
    }
  }
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
    max-height: 5000px;
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

  .permission-list-table {
    width: 100%;
    height: 300px;
    overflow: scroll;
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
