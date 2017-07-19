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
            title="管理账户及组织"
            :visible.sync="manageSlideDialogVisible">
       <div class="config-dialog-content">
         <div class="manage-operation">
           <fj-button type="info" size="mini" @click="assignUserClick">添加用户</fj-button>
           <fj-button type="info" size="mini" @click="assignGroupClick">添加组织</fj-button>
           <fj-button type="danger" size="mini" @click="manageSearchDeleteClick" v-bind:disabled="manageSearchDeleteDisabled">移除</fj-button>
         </div>
         <div class="manage-search">
            <fj-input placeholder="输入人名/组织名/小组名" size="mini" v-model="keyword2" icon="icon-sousuo" @on-icon-click="manageSearchClick"></fj-input>
         </div>
         <div v-if="searchItems.length" class="manage-search-content">
           <fj-table :data="searchItems" name="table3" ref="table3" @current-change="manageSearchHandleCurrentChange" :showThead=false highlight-current-row>
             <fj-table-column prop="_id">
               <template scope="props">
                 <div class="search-item-icon"><img class="search-item-icon-img" :src="props.row.photo ? props.row.photo : props.row.logo"></div>
                 <span>{{props.row.name}}</span>
                 <span :class="getSearchItemClass(props.row)">{{searchItemTypeMap[props.row.type]}}</span>
               </template>
             </fj-table-column>
           </fj-table>
           <li class="manage-search-li manage-dark-li">
             <div class="manage-search-content-bottom">更多内容请搜索</div>
           </li>
         </div>
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

    <fj-dialog
            :title="addOwnerTitle"
            :visible.sync="addOwnerDialogVisible"
            @close="addOwnerDialogVisible=false">

      <div class="manage-search">
        <fj-input placeholder="输入名字搜索" size="mini" v-model="keyword3" icon="icon-sousuo" on-icon-click="searchOwnerClick"></fj-input>
      </div>
      <div v-if="searchOwner.length" class="manage-search-content">
        <fj-table :data="searchOwner" name="table4" ref="table4" @current-change="searchOwnerHandleCurrentChange" :showThead=false highlight-current-row>
          <fj-table-column prop="_id">
            <template scope="props">
              <div class="search-item-icon"><img class="search-item-icon-img" :src="props.row.photo ? props.row.photo : props.row.logo"></div>
              <span>{{props.row.name}}</span>
            </template>
          </fj-table-column>
        </fj-table>
      </div>
      <div slot="footer">
        <fj-button @click="addOwnerDialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="addOwnerConfirm">确定</fj-button>
      </div>
    </fj-dialog>
    <config-role :roleId="roleId" :visible.sync="configRoleDialogVisible" ></config-role>
  </four-row-layout-right-content>
</template>
<script>
  import './role.css';
  import { formatQuery, deepClone } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/fourRowLayoutRightContent';
  import ConfigRole  from './configRole';

  const api = require('../../../api/role');

  export default {
    components: {
      'config-role': ConfigRole,
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
        permissionDialogVisible: false,
        formData: {},
        currentRow: {},
        roleId: "",
        configRoleDialogVisible: false,
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
        dialogVisible: false,
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
        this.configSlideDialogVisible = false;
        this.permissionDialogVisible = false;
        this.manageSlideDialogVisible = false;
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
        console.log("fafsafsafasf");
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
      getSearchItemClass(item) {
        let rs = 'search-item-type ';
        if (item.type === '0') {
          rs += 'search-item-type-user';
        } else if (item.type === '1') {
          rs += 'search-item-type-company';
        } else if (item.type === '2') {
          rs += 'search-item-type-department';
        } else if (item.type === '3') {
          rs += 'search-item-type-team';
        }
        return rs;
      },
      manageBtnClick() {
        this.resetDialog();
        this.manageSlideDialogVisible = true;
        this.manageRow = this.currentRow;
        this.manageSearchClick();
      },
      manageSearchClick() {
        const query = {
          _id: this.manageRow._id,
          keyword: this.keyword2
        };
        const me = this;
        api.getRoleOwners(formatQuery(query, true))
          .then((res) => {
            me.searchItems = res.data;
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      manageSearchHandleCurrentChange(row) {
        this.manageSearchCurrentRow = row;
        this.manageSearchDeleteDisabled = false;
      },
      manageSearchDeleteClick() {
        const postData = {
          roles: this.manageRow._id,
          _id: this.manageSearchCurrentRow._id
        };
        const me = this;
        api.postDeleteOwnerRole(postData)
          .then((res) => {
            me.showSuccessInfo('移除成功');
            me.manageSearchClick();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      assignUserClick() {
        this.addOwnerTitle = '添加用户';
        this.addOwnerDialogVisible = true;
        this.searchOwnerClick();
      },
      assignGroupClick() {
        this.addOwnerTitle = '添加组织';
        this.addOwnerDialogVisible = true;
        this.searchOwnerClick();
      },
      searchOwnerClick() {
        const type = this.addOwnerTitle === '添加用户' ? '0' : '1';
        const query = {
          type: type,
          keyword: this.keyword3
        };
        const me = this;
        api.getRoleSearchUserOrGroup(formatQuery(query, true))
          .then((res) => {
            me.searchOwner = res.data;
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      addOwnerConfirm() {
        const type = this.addOwnerTitle === '添加用户' ? '3' : '0';
        const postData = {
          type: type,
          _id: this.searchOwnerCurrentRow._id,
          roles: this.manageRow._id
        };
        const me = this;

        api.postAssignRole(postData)
          .then((res) => {
            me.showSuccessInfo('添加成功');
            me.addOwnerTitle = '';
            me.addOwnerDialogVisible = false;
            me.addOwner = [];
            me.manageSearchClick();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      searchOwnerHandleCurrentChange(row) {
        this.searchOwnerCurrentRow = row;
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

