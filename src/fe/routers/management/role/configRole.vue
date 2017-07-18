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
        addBtnDisabled: false,
        editBtnDisabled: true,
        configBtnDisabled: true,
        manageBtnDisabled: true,
        deleteBtnDisabled: true,
        keyword: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        slideDialogTitle: '添加角色',
        slideDialogVisible: false,
        configSlideDialogVisible: false,
        formData: {},
        currentRow: {},
        configRow: {},
        permissionData: [],
        permissionListData: [],
        deletePermissionDisabled: true,
        dialogVisible: false,
        permissionDialogVisible: false,
        deletePermissionDialogVisible: false,
        manageSlideDialogVisible: false,
        manageSearchDeleteDisabled: true,
        searchItems: [],
        searchItemTypeMap: {
          0: '公司',
          1: '部门',
          2: '小组',
          3: '用户'
        },
        keyword2: '',
        addOwnerTitle: '',
        keyword3: 'x',
        addOwnerDialogVisible: false,
        searchOwner: []
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.handleClickSearch();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleClickSearch() {
        this.resetBtn();
        this.resetDialog();
        this.getRoleList();
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
</style>
