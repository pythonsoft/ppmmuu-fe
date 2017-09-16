<template>
  <div>
    <fj-slide-dialog
            title="管理账户及组织"
            :visible.sync="manageSlideDialogVisible" @close="close">
      <div class="config-dialog-content">
        <div class="manage-operation">
          <fj-button type="info" size="mini" @click="assignUserClick">添加用户</fj-button>
          <fj-button type="info" size="mini" @click="assignGroupClick">添加组织</fj-button>
          <fj-button type="danger" size="mini" @click="manageSearchDeleteClick" v-bind:disabled="manageSearchDeleteDisabled">移除</fj-button>
        </div>
        <div class="manage-search">
          <fj-input placeholder="输入人名/组织名/小组名" size="mini" v-model="keyword2" icon="icon-search input-search-icon" @on-icon-click="manageSearchClick" @keydown.native.enter.prevent="manageSearchClick"></fj-input>
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

      <span>确定要移除吗?</span>

      <div slot="footer">
        <fj-button @click="dialogVisible=false">取消</fj-button>
        <fj-button type="primary" @click="confirmDialog">确定</fj-button>
      </div>

    </fj-dialog>
    <add-user :visible.sync="addUserDialogVisible" @add-owner="addOwner" :searchOwner="searchOwner" @search-user-api="searchOwnerClick" title="添加用户"></add-user>
    <add-group :visible.sync="addGroupDialogVisible"  @add-owner="addOwner" title="添加组织"></add-group>
  </div>
</template>

<script>
  import { formatQuery } from '../../../common/utils';
  import AddUser from './searchAddUser';
  import AddGroup from './searchAddGroup';

  const api = require('../../../api/role');

  export default {
    name: 'manageRole',
    props: {
      manageId: {
        type: String,
        default: ''
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    components: {
      'add-user': AddUser,
      'add-group': AddGroup
    },
    data() {
      return {
        manageSlideDialogVisible: false,
        manageSearchDeleteDisabled: true,
        keyword2: '',
        searchItems: [],
        searchItemTypeMap: {
          0: '公司',
          1: '部门',
          2: '小组',
          3: '用户'
        },
        addUserDialogVisible: false,
        addGroupDialogVisible: false,
        searchOwner: [],
        dialogVisible: false
      };
    },
    mounted() {
    },
    watch: {
      visible(val) {
        if (val) {
          this.manageSearchClick();
          this.manageSlideDialogVisible = val;
        } else {
          this.manageSlideDialogVisible = val;
        }
      }
    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      },
      assignUserClick() {
        this.addUserDialogVisible = true;
      },
      assignGroupClick() {
        this.addGroupDialogVisible = true;
      },
      manageSearchDeleteClick() {
        this.dialogVisible = true;
      },
      confirmDialog() {
        const postData = {
          roles: this.manageId,
          _id: this.manageSearchCurrentRow._id
        };
        const me = this;
        api.postDeleteOwnerRole(postData)
          .then((res) => {
            me.showSuccessInfo('移除成功');
            me.dialogVisible = false;
            this.manageSearchDeleteDisabled = true;
            me.manageSearchClick();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      manageSearchClick() {
        const query = {
          _id: this.manageId,
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
      addOwner(row) {
        row = row.info? row.info : role;
        const type = row.type || '3';
        const postData = {
          type: type,
          _id: row._id
        };
        const me = this;
        postData.roles = this.manageId;
        api.postAssignRole(postData)
          .then((res) => {
            me.showSuccessInfo('添加成功');
            me.addUserDialogVisible = false;
            me.addGroupDialogVisible = false;
            me.manageSearchClick();
          }).catch((error) => {
            me.showErrorInfo(error);
          });
      },
      searchOwnerClick(query) {
        const me = this;
        const defaultQuery = {
          type: '0'
        };
        query = Object.assign({}, defaultQuery, query);
        api.getRoleSearchUserOrGroup(formatQuery(query, true))
          .then((res) => {
            me.searchOwner = res.data;
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
    }
  };
</script>