<template>
  <div class="permission-panel-warpper">
    <h1>引用策略（{{ name }}）</h1>
    <div class="config-dialog-content">
      <div class="permission-operation">
        <fj-button type="info" size="mini" @click="addGroupDialogVisible=true">增加组织</fj-button>
        <fj-button type="info" size="mini" @click="addUserClick">增加用户</fj-button>
        <fj-button type="danger" size="mini" @click="deletePermissionClick" v-bind:disabled="selectedRows.length < 1">删除</fj-button>
      </div>
      <div class="permissions">
        <fj-table :data="permissionData" name="table" ref="table" @selection-change="handleSelectionChange">
          <fj-table-column type="selection" width="20"></fj-table-column>
          <fj-table-column prop="_id" label="授权组织/人">
            <template scope="props">
              <div class="search-item-icon"><img class="search-item-icon-img" :src="props.row.photo ? props.row.photo : props.row.logo"></div>
              <span>{{props.row.name}}</span>
              <span :class="getSearchItemClass(props.row)">{{searchItemTypeMap[props.row.type]}}</span>
            </template>
          </fj-table-column>
        </fj-table>
      </div>
      <div class="edit-permission-btn-group">
        <fj-button @click="cancel">取消</fj-button><!--
              --><fj-button type="primary" :loading="isUpdatePermissionBtnLoading" @click="updateGroupUser">保存</fj-button>
      </div>
      <add-user :visible.sync="addUserDialogVisible" @add-owner="addOwner" :searchOwner="searchOwner" @search-user-api="searchOwnerClick" title="添加用户"></add-user>
      <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" title="添加组织"></add-group>
      <add-user :visible.sync="addUserDialogVisible" @add-owner="addOwner" :searchOwner="searchOwner" @search-user-api="searchOwnerClick" title="添加用户"></add-user>
      <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" title="添加组织"></add-group>
    </div>
  </div>
</template>
<script>
  import '../../../role/role.css';
  import { formatQuery } from '../../../../../common/utils';
  import AddUser from '../../../role/searchAddUser';
  import AddGroup from '../../../role/searchAddGroup';

  const api = require('../../../../../api/template');

  export default {
    props: {
      id: String,
      name: String
    },
    data(){
      return {
        isUpdatePermissionBtnLoading: false,
        addUserDialogVisible: false,
        addGroupDialogVisible: false,
        permissionData: [],
        searchItemTypeMap: {
          0: '公司',
          1: '部门',
          2: '小组',
          3: '用户'
        },
        selectedRows: [],
        searchOwner: []
      }
    },
    components: {
      'add-user': AddUser,
      'add-group': AddGroup
    },
    watch:{
      id(val){
        if(val){
          this.getTemplateGroup();
        }
      }
    },
    methods: {
      cancel() {
        this.$emit('cancel');
      },
      getTemplateGroup(){
        const me = this;
        api.getGroup(formatQuery({groupId: me.id}, true))
            .then((res) => {
              me.permissionData = res.data.users || [];
            }).catch((error) => {
          me.showErrorInfo(error);
        });
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
      updateGroupUser(){
        const me = this;
        const postData = {
          _id: me.id,
          users: me.permissionData
        };
        api.updateGroupUser(postData)
            .then((res) => {
              me.showSuccessInfo('保存成功');
              me.getTemplateGroup();
            }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      addUserClick(){
        this.searchOwnerClick();
      },
      addOwner(row) {
        row = row.info ? row.info : row;
        const me = this;
        const type = row.type || '3';
        const users = this.permissionData;
        const user = {
          type: type,
          name: row.name,
          _id: row._id,
          photo: row.photo || row.logo
        }
        let flag = true;
        for(let i =0; i< users.length; i++){
          if(users[i]._id === user._id){
            flag = false;
          }
        }
        if(flag) {
          users.push(user);
        }
        me.addUserDialogVisible = false;
        me.addGroupDialogVisible = false;
      },
      handleSelectionChange(rows){
        this.selectedRows = rows;
      },
      deletePermissionClick(){
        const me = this;
        const users = this.permissionData;
        const updateUsers = [];
        console.log(this.selectedRows, users);
        for(let j = 0, len1 = this.selectedRows.length; j < len1; j++) {
          let flag = false;
          for (let i = 0; i < users.length; i++) {
            if(users[i]._id === this.selectedRows[j]._id){
              users.splice(i, 1);
            }
          }
        }
      },
      searchOwnerClick(query) {
        const me = this;
        const defaultQuery = {
          type: '0'
        };
        query = Object.assign({}, defaultQuery, query);
        api.getTemplateSearchUserOrGroup(formatQuery(query, true))
            .then((res) => {
              me.searchOwner = res.data;
              me.addUserDialogVisible = true;
            }).catch((error) => {
          me.showErrorInfo(error);
        });
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    },
  };
</script>
<style>
  .permission-panel-warpper {
    margin-left: 20px;
    margin-bottom: 20px;
    color: #2A3E52;
  }
  .permission-panel-warpper h1 {
    font-size: 16px;
    line-height: 62px;
    border-bottom: 1px solid #EBF3FB;
  }
  .permission-content {
    width: 80%;
  }

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

  .edit-permission-btn-group {
    margin-left: 16px;
    margin-top: 30px;
  }
  .edit-permission-btn-group button {
    margin-right: 10px;
  }
</style>
