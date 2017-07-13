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
    <fj-slide-dialog
            title="配置"
            :visible.sync="configSlideDialogVisible">
       <div class="config-dialog-content">
         <div>{{configRow.name}}</div>
         <div class="config-description">{{configRow.description}}</div>
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
             <fj-table-column prop="description" label="行为"></fj-table-column>
           </fj-table>
         </div>
       </div>


    </fj-slide-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery, deepClone } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/fourRowLayoutRightContent';

  const api = require('../../../../../build/api/role');

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
        configSlideDialogVisible: true,
        formData: {},
        currentRow: {},
        rules: {
          _id:[
            { required: true, message: '请输入标识' }
          ],
          name:[
            { required: true, message: '请输入名称' }
          ],
          description:[
            { message: '长度不能超过500位字符', validator: (rule, value) => {
              if (value && value.length > 500) return false;
              return true;
            }}
          ]
        },
        configRow: {},
        permissionData: [],
        deletePermissionDisabled: true
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
            me.resetBtn();
          })
          .catch((error) => {
            me.showErrorInfo(error);
          });
      },
      isEdit(){
        if(this.slideDialogTitle === '编辑角色'){
          return true;
        }
        return false;
      },
      resetBtn(){
        this.editBtnDisabled = true;
        this.configBtnDisabled = true;
        this.manageBtnDisabled = true;
        this.deleteBtnDisabled = true;
      },
      enableBtn(){
        this.editBtnDisabled = false;
        this.configBtnDisabled = false;
        this.manageBtnDisabled = false;
        this.deleteBtnDisabled = false;
      },
      addBtnClick() {
        this.formData = {};
        this.slideDialogTitle = '添加角色';
        this.slideDialogVisible = true;
      },
      editBtnClick() {
        this.formData = deepClone(this.currentRow);
        this.slideDialogTitle = '编辑角色';
        this.slideDialogVisible = true;
      },
      configBtnClick() {
        this.configRow = deepClone(this.currentRow);
        const allowedPermissions = this.configRow.allowedPermissions;
        const deniedPermissions = this.configRow.deniedPermissions;

        this.configSlideDialogVisible = true;
      },
      manageBtnClick() {

      },
      deleteBtnClick() {

      },
      confirmSlideDialogClick() {
        const me = this;
        console.log("heloo");
        this.$refs['form'].validate((valid) => {
          if (!valid) {
            return false;
          }
        });

        const apiFunc = this.isEdit()? api.postUpdateRole : api.postAddRole;
        apiFunc(this.formData)
        .then(function(res){
          me.handleClickSearch();
          me.showSuccessInfo('保存成功');
        })
        .catch(function(error){
          me.showErrorInfo(error);
        })
      },
      resetSlideDialog() {
        this.slideDialogTitle = '';
        this.slideDialogVisible = false;
        this.formData = {};
      },
      handleCurrentChange(row) {
        this.currentRow = deepClone(row);
        this.slideDialogVisible = false;
        this.enableBtn();
      },
      addPermissionClick() {

      },
      deletePermissionClick() {

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
<style>

  .role-search-item{
    float: left;
    margin-left: 10px;
  }

  .role-btn-mini-margin {
    margin-left: 6px;
    font-size: 12px;
  }

  .role-btn-margin {
    margin-left: 18px;
    font-size: 12px;
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

  .permission-operation {
    margin-top: 20px;
  }

  .permission-title {
    margin-right: 20px;
  }

  .permissions {
    width: 100%;
    max-height: 350px;
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



</style>
