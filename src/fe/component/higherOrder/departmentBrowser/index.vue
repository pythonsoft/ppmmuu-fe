<template>
  <fj-dialog :title="title" :visible.sync="display" :width="width + 'px'" @close="cancelDialog">
    <template>
      <div v-if="display" class="ui-department-browser-content" :style="'height: '+ height +'px'">
        <panel-view
          :parentSize="{ width: width - 42, height: height }"
          panels="200, #-p0"
          direction="x"
          :canResize="true"
        >
          <template slot="0">
            <div class="ui-department-browser-content-fix-scroll">
              <tree-view
                :showUpper="false"
                :vueInstance="vueInstance"
                :listGroup="listGroup"
                :treeNodeCurrentChange="treeNodeCurrentChange"
              ></tree-view>
            </div>
          </template>
          <template slot="1">
            <div class="ui-department-browser-content-user">
              <div class="ui-department-browser-content-user-bar">
                <div class="title">{{departmentName}}</div>
                <div class="ui-department-browser-search-item">
                  <fj-button size="small" type="primary" @click="handleSearch">查询</fj-button>
                </div>
                <div class="ui-department-browser-search-item" :style="{ width: '190px' }">
                  <fj-input theme="fill" size="small" placeholder="请输入账户名" v-model="keyword"></fj-input>
                </div>
              </div>
              <div class="ui-department-browser-content-user-list" :style="'height:'+ (height - 54) +'px'">
                <fj-table style="font-size: 12px;" :data="tableData" name="accountTable" @selection-change="handleSelectionChange">
                  <fj-table-column type="selection" width="50" align="center"></fj-table-column>
                  <fj-table-column prop="status" label="状态" width="50" align="center">
                    <template slot-scope="props">
                      <span :class="STATUS_CONFIG[props.row.status].class">{{ STATUS_CONFIG[props.row.status].text }}</span>
                    </template>
                  </fj-table-column>
                  <fj-table-column prop="name" label="姓名"></fj-table-column>
                  <fj-table-column prop="email" label="邮箱"></fj-table-column>
                </fj-table>
              </div>
            </div>
          </template>
        </panel-view>
      </div>
    </template>
    <div slot="footer" class="dialog-footer">
      <fj-button @click="cancelDialog">取消</fj-button><!--
      --><fj-button type="primary" @click="confirmDialog">确定</fj-button>
    </div>
  </fj-dialog>

</template>
<script>
  import Vue from 'vue';
  import './index.css'
  import PanelView from "../../layout/panel/index.vue";
  import groupApi from '../../../api/group'
  import treeView from '../../../component/higherOrder/tree/_index';
  import { formatQuery, getTree, getTreeNode } from '../../../common/utils';

  import {
    STATUS_OPTIONS,
    STATUS_CONFIG,
    VERIFY_TYPE_CONFIG,
    PERMISSION_TYPE_CONFIG,
    GROUP_CONFIG
  } from '../../../routers/management/account/config';


  export default {
    components: {
      PanelView,
      treeView
    },
    name: 'departmentBrowser',
    props: {
      parentId: { type: String },
      visible: { type: Boolean },
    },
    watch: {
      visible(v) {
        this.display = v;
        if(v) {
          this.vueInstance.$emit('tree.listGroup');
        }
      }
    },
    data() {
      return {
        width: '760',
        height: '400',
        title: '通讯录',
        display: false,
        vueInstance: null,
        currentNode: null,
        currentNodeParent: null,
        tableData: [],
        currentPage: 1,
        total: 0,
        selectedItems: [],
        keyword: '',
        departmentName: ''
      }
    },
    created() {
      this.STATUS_OPTIONS = STATUS_OPTIONS;
      this.STATUS_CONFIG = STATUS_CONFIG;
      this.VERIFY_TYPE_CONFIG = VERIFY_TYPE_CONFIG;
      this.PERMISSION_TYPE_CONFIG = PERMISSION_TYPE_CONFIG;

      this.vueInstance = new Vue({
        name: 'departmentBrowser'
      });
    },
    methods: {
      cancelDialog() {
        this.$emit('update:visible', false);
      },
      confirmDialog() {
        if (!this.currentNode) {
          this.$message.error('没有选中的组织');
          return false;
        }
        this.$emit('confirm', this.selectedItems);
        this.$emit('update:visible', false);
        return true;
      },
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      updateList(requestData) {
        const data = {
          _id: this.currentNode._id,
          type: this.currentNode.type,
          status: this.status === 'all' ? '' : this.status,
          keyword: this.keyword,
          page: this.currentPage,
          pageSize: this.pageSize
        };

        Object.assign(data, requestData);

        groupApi.getGroupUserList(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            this.tableData = responseData.docs;
            this.currentPage = responseData.page;
            this.total = responseData.total;
            this.selectedItems = [];
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      handleSearch() {
        this.currentPage = 1;
        this.updateList();
      },
      listGroup(id = '', cb) {
        if (!this.visible) { return false; }

        const query = {
          parentId: id ? id : (this.parentId || '')
        };

        groupApi.getGroupList(formatQuery(query, true)).then((res) => {
          const docs = res.data.docs || [];
          if (docs.length === 0) {
            this.close();
            this.$message.error('没有部门信息');
          }
          cb && cb(res.data.docs);
        }).catch((err) => {
          this.$message.error(err);
        });
        return false;
      },
      treeNodeCurrentChange(treeNode, parentNode) {
        this.currentNode = treeNode;
        this.currentNodeParent = parentNode;
        this.departmentName = treeNode.name;
        this.updateList();
      },
    }
  }
</script>
