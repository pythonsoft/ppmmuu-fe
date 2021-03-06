<template>
    <layout-four-row>
      <template slot="search-left">存储区</template>
      <template slot="search-right">
        <div class="layout-four-row-search-item" :style="{ width: '100px' }">
          <fj-select placeholder="请选择" v-model="formData.status" size="small">
            <fj-option
              v-for="item in status"
              :key="item.value"
              :label="item.text"
              :value="item.value">
            </fj-option>
          </fj-select>
        </div>
        <div class="layout-four-row-search-item" :style="{ width: '190px' }">
          <fj-input :rows="1" placeholder="请输入存储区名称" v-model="formData.keyword" size="small"></fj-input>
        </div>
        <div class="layout-four-row-search-item">
          <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
        </div>
      </template>
      <template slot="operation">
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" @click="addBtnClick">增加</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">变更</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="deleteBtnClick">删除</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="editPathClick">配置路径</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="editTacticsClick">配置策略</fj-button>
        </div>
        <div class="operation-btn-group">
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="setEnableClick">启用</fj-button>
          <fj-button type="primary" size="mini" v-bind:disabled="isDisabled" @click="setDisableClick">挂起</fj-button>
        </div>
      </template>
      <template slot="table">
        <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
          <fj-table-column prop="status" width="90" align="center" label="状态" >
            <template slot-scope="props"><div v-html="formatStatus(props.row.status)"></div></template>
          </fj-table-column>
          <fj-table-column prop="_id" width="150" label="标识" ></fj-table-column>
          <fj-table-column prop="name" label="名称"></fj-table-column>
          <fj-table-column prop="type" label="存储类型">
            <template slot-scope="props">{{ formatType(props.row.type) }}</template>
          </fj-table-column>
          <fj-table-column prop="permission" label="读写权限">
            <template slot-scope="props">{{ formatPermission(props.row.permission) }}</template>
          </fj-table-column>
          <fj-table-column prop="creator" label="创建人">
            <template slot-scope="props">{{ props.row.creator.name }}</template>
          </fj-table-column>
          <fj-table-column prop="createdTime" width="160" align="center" label="创建时间">
            <template slot-scope="props">{{ props.row.createdTime | formatTime }}</template>
          </fj-table-column>
          <fj-table-column prop="modifyTime" width="160" align="center" label="修改时间">
            <template slot-scope="props">{{ props.row.modifyTime | formatTime }}</template>
          </fj-table-column>
        </fj-table>
      </template>
      <template slot="pagination">
        <fj-pagination
          :page-size="pageSize"
          :total="total"
          :current-page.sync="page"
          @current-change="pageChange">
        </fj-pagination>
      </template>
      <edit-bucket
              :id="currentRow._id"
              :title="title"
              :type="type"
              :visible.sync="editDialogVisible"
              @updateList="handleClickSearch">
      </edit-bucket>
      <fj-dialog
              title="提示"
              :visible.sync="deleteDialogVisible"
              @close="deleteDialogVisible=false">

        <span>确定要删除这个存储区吗?</span>

        <div slot="footer" class="dialog-footer">
          <fj-button @click="deleteDialogVisible=false">取消</fj-button><!--
          --><fj-button type="primary" @click="confirmDeleteDialog">确定</fj-button>
        </div>

      </fj-dialog>
    </layout-four-row>
</template>
<script>
  import '../index.css';
  import fourRowLayout from '../../../../component/layout/fourRowLayoutRightContent/index';
  import editBucket from './editBucket';
  import utils from '../../../../common/utils';

  const config = require('../config');
  const api = require('../../../../api/storage');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'edit-bucket': editBucket
    },
    pros: {
      showBucket: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        defaultRoute: '/',
        deleteDialogVisible: false,
        isDisabled: true,
        status: config.STATUS,
        formData: {
          keyword: '',
          status: ''
        },
        currentRow: {},
        tableData: [],
        /* bucket param */
        page: 1,
        pageSize: 20,
        total: 0,
        editDialogVisible: false,
        title: '',
        type: ''
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
        me.formData.page = me.page;
        me.formData.pageSize = me.pageSize;
        api.listBucket({ params: me.formData }, me)
          .then((res) => {
            me.tableData = res.data.docs;
            me.total = res.data.total;
            me.isDisabled = true;
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      addBtnClick() {
        this.resetEditDialog();
        this.editDialogVisible = true;
        this.title = '添加存储区信息';
        this.type = 'add';
      },
      editBtnClick() {
        this.resetEditDialog();
        this.editDialogVisible = true;
        this.title = '编辑存储区信息';
        this.type = 'edit';
      },
      resetEditDialog() {
        this.editDialogVisible = false;
        this.title = '';
        this.type = '';
      },
      deleteBtnClick() {
        this.deleteDialogVisible = true;
      },
      confirmDeleteDialog() {
        const me = this;
        api.deleteBucket({ _id: this.currentRow._id })
          .then((res) => {
            me.$message.success('删除成功');
            me.deleteDialogVisible = false;
            me.handleClickSearch();
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      editPathClick() {
        this.$emit('edit-path', this.currentRow);
      },
      editTacticsClick() {
        this.$emit('edit-tactics', this.currentRow);
      },
      setEnableClick() {
        this.updateStatus('0');
      },
      setDisableClick() {
        this.updateStatus('1');
      },
      updateStatus(status) {
        const me = this;
        const info = status === '0' ? '启用成功' : '挂起成功';
        api.enableBucket({ _id: this.currentRow._id, status: status })
          .then((res) => {
            me.$message.success(info);
            me.handleClickSearch();
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      /* table */
      handleCurrentChange(current) {
        this.currentRow = current;
        this.isDisabled = false;
        this.resetEditDialog();
      },
      formatStatus(v) {
        if (v === config.STATUS.NORMAL.value) {
          return '<span class="bucket-status-span bucket-enable">正常</span>';
        }
        return '<span class="bucket-status-span bucket-disable">挂起</span>';
      },
      formatType(v) {
        return utils.getTextByValue(config, v, 'TYPE');
      },
      formatPermission(v) {
        return utils.getTextByValue(config, v, 'PERMISSION');
      },
      pageChange(val) {
        this.page = val;
        this.handleClickSearch();
      }
    }
  };
</script>
