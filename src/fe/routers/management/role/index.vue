<template>
  <four-row-layout-right-content>
    <template slot="search-left">角色</template>
    <template slot="search-right">
      <div class="role-search-item">
        <fj-input placeholder="请输入名称或标识" v-model="keyword"></fj-input>
      </div>
      <div class="role-search-item">
        <fj-button type="primary" @click="handleClickSearch">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
     <span class="role-btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="addBtnDisabled" @click="addBtnClick">增加</fj-button>
     </span>
     <span class="role-btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="editBtnDisabled" @click="editBtnClick">编辑</fj-button>
     </span>
     <span class="role-btn-mini-margin">
      <fj-button type="info" size="mini" v-bind:disabled="configBtnDisabled" @click="configBtnClick">配置</fj-button>
     </span>
      <span class="role-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="manageBtnDisabled" @click="manageBtnClick">管理账户及组织</fj-button>
      </span>
      <span class="role-btn-margin">
        <fj-button type="danger" size="mini" v-bind:disabled="deleteBtnDisabled" @click="deleteBtnClick">删除</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="_id" label="标识"></fj-table-column>
        <fj-table-column prop="name" label="名称" ></fj-table-column>
        <fj-table-column prop="description" label="描述"></fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <fj-slide-dialog
            :title="slideDialogTitle"
            :visible.sync="slideDialogVisible">

      <fj-form :model="formData" :rules="rules" ref="form" label-width="80px">
        <fj-form-item label="标识" prop="_id">
          <fj-input v-model="formData._id" :readonly="isEdit()"></fj-input>
        </fj-form-item>
        <fj-form-item label="名称" prop="name">
          <fj-input v-model="formData.name"></fj-input>
        </fj-form-item>
        <fj-form-item label="描述" prop="description">
          <fj-input type="textarea" :rows="5" v-model="formData.description"></fj-input>
        </fj-form-item>
      </fj-form>

      <div slot="footer">
        <fj-button @click="slideDialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="confirmSlideDialogClick">保存</fj-button>
      </div>

    </fj-slide-dialog>

    <fj-dialog
            title="提示"
            :visible.sync="dialogVisible"
            @close="dialogVisible=false">

      <span>确定要删除这个角色吗?</span>

      <div slot="footer">
        <fj-button @click="dialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>

    </fj-dialog>

    <config-role :roleId="roleId" :visible.sync="configRoleDialogVisible" ></config-role>
    <manage-role :manageId="manageId" :visible.sync="manageRoleDialogVisible" ></manage-role>
  </four-row-layout-right-content>
</template>
<script>
  import './role.css';
  import { formatQuery, deepClone } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/fourRowLayoutRightContent';
  import ConfigRole from './configRole';
  import ManageRole from './manageRole';

  const api = require('../../../api/role');

  export default {
    components: {
      'config-role': ConfigRole,
      'manage-role': ManageRole,
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
        formData: {},
        currentRow: {},
        roleId: '',
        manageId: '',
        configRoleDialogVisible: false,
        manageRoleDialogVisible: false,
        rules: {
          _id: [
            { required: true, message: '请输入标识' }
          ],
          name: [
            { required: true, message: '请输入名称' }
          ],
          description: [
            { message: '长度不能超过500位字符',
              validator: (rule, value) => {
                if (value && value.length > 500) return false;
                return true;
              } }
          ]
        },
        dialogVisible: false
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
      },
      getRoleList() {
        const me = this;
        const searchObj = {
          page: me.currentPage,
          pageSize: me.pageSize,
          keyword: me.keyword
        };
        api.getRoleList(formatQuery(searchObj, true))
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      isEdit() {
        if (this.slideDialogTitle === '编辑角色') {
          return true;
        }
        return false;
      },
      resetDialog() {
        this.dialogVisible = false;
        this.slideDialogVisible = false;
        this.configRoleDialogVisible = false;
        this.manageRoleDialogVisible = false;
      },
      resetBtn() {
        this.editBtnDisabled = true;
        this.configBtnDisabled = true;
        this.manageBtnDisabled = true;
        this.deleteBtnDisabled = true;
      },
      enableBtn() {
        this.editBtnDisabled = false;
        this.configBtnDisabled = false;
        this.manageBtnDisabled = false;
        this.deleteBtnDisabled = false;
      },
      addBtnClick() {
        this.resetDialog();
        this.formData = {};
        this.slideDialogTitle = '添加角色';
        this.slideDialogVisible = true;
      },
      editBtnClick() {
        const me = this;
        this.resetDialog();
        api.getRoleDetail(formatQuery({ _id: this.currentRow._id }, true))
          .then((res) => {
            me.formData = res.data;
            me.slideDialogTitle = '编辑角色';
            me.slideDialogVisible = true;
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      configBtnClick() {
        this.resetDialog();
        this.configRoleDialogVisible = true;
        this.roleId = this.currentRow._id;
      },
      deleteBtnClick() {
        this.dialogVisible = true;
      },
      confirmDialog() {
        const _ids = this.currentRow._id;
        const me = this;
        api.postDeleteRole({ _ids: _ids })
          .then((res) => {
            me.showSuccessInfo('删除成功');
            me.handleClickSearch();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      confirmSlideDialogClick() {
        const me = this;
        this.$refs.form.validate((valid) => {
          if (!valid) {
            return false;
          }
          return true;
        });

        const apiFunc = this.isEdit() ? api.postUpdateRole : api.postAddRole;
        const postData = {
          _id: this.formData._id,
          name: this.formData.name,
          description: this.formData.description
        };
        apiFunc(postData)
          .then((res) => {
            me.handleClickSearch();
            me.showSuccessInfo('保存成功');
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      resetSlideDialog() {
        this.slideDialogTitle = '';
        this.slideDialogVisible = false;
        this.formData = {};
      },
      handleCurrentChange(row) {
        this.currentRow = row;
        this.slideDialogVisible = false;
        this.enableBtn();
      },
      manageBtnClick() {
        this.resetDialog();
        this.manageRoleDialogVisible = true;
        this.manageId = this.currentRow._id;
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
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

