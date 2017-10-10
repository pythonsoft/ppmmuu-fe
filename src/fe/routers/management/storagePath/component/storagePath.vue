<template>
  <layout-four-row :isIncludeArrow="showBack" @back="showBackClick">
    <template slot="search-left">
      <span>路径</span>
    </template>
    <template slot="search-right">
      <div class="layout-four-row-search-item" :style="{ width: '78px' }">
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
        <fj-input :rows="1" placeholder="请输入名称" v-model="formData.keyword" size="small"></fj-input>
      </div>
      <div class="layout-four-row-search-item">
        <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
        <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" @click="addBtnClick">增加</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">变更</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="deleteBtnClick">删除</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editTacticsClick">配置策略</fj-button>
      </span>

      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="setEnableClick">启用</fj-button>
      </span>
      <span class="layout-btn-mini-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="setDisableClick">挂起</fj-button>
      </span>

      <span class="layout-btn-margin">
        <fj-button type="info" size="mini" v-bind:disabled="isDisabled" @click="editBtnClick">查看详细</fj-button>
      </span>
    </template>
    <template slot="table">
      <fj-table style="font-size: 12px;" :data="tableData" name="table" ref="table" @current-change="handleCurrentChange" highlight-current-row>
        <fj-table-column prop="status" width="90" align="center" label="状态" >
          <template scope="props"><div v-html="formatStatus(props.row.status)"></div></template>
        </fj-table-column>
        <fj-table-column prop="_id" width="160" label="标识"></fj-table-column>
        <fj-table-column prop="viceId" width="160" label="副标识"></fj-table-column>
        <fj-table-column prop="name" label="名称"></fj-table-column>
        <fj-table-column prop="maxSize" width="160" label="容量 | 已使用">
          <template scope="props">{{ formatSize(props.row) }}</template>
        </fj-table-column>
        <fj-table-column prop="bucket" width="160" label="存储区名称">
          <template scope="props">{{ props.row.bucket.name }}</template>
        </fj-table-column>
        <fj-table-column prop="creator" width="160" label="创建人">
          <template scope="props">{{ props.row.creator.name }}</template>
        </fj-table-column>
        <fj-table-column prop="createdTime" width="160" align="center" label="创建时间">
          <template scope="props">{{ props.row.createdTime | formatTime }}</template>
        </fj-table-column>
        <fj-table-column prop="modifyTime" width="160" align="center" label="修改时间">
          <template scope="props">{{ props.row.modifyTime | formatTime }}</template>
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
    <edit-path
            :id="currentRow._id"
            :title="title"
            :type="type"
            :bucket="bucket"
            :visible.sync="editDialogVisible"
            @updateList="handleClickSearch">
    </edit-path>
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
  import editPath from './editPath';
  import utils from '../../../../common/utils';

  const config = require('../config');
  const api = require('../../../../api/storage');

  export default {
    components: {
      'layout-four-row': fourRowLayout,
      'edit-path': editPath
    },
    props: {
      showBack: {
        type: Boolean,
        default: false
      },
      bucket: {
        type: Object,
        default: null
      }
    },
    data() {
      return {
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
      this.handleClickSearch();
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      showBackClick() {
        this.$emit('show-back');
      },
      handleClickSearch() {
        const me = this;
        if (this.bucket && this.bucket._id) {
          me.formData.bucketId = this.bucket._id;
        }
        api.listPath({ params: me.formData }, me)
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
        this.title = '添加路径信息';
        this.type = 'add';
      },
      editBtnClick() {
        this.resetEditDialog();
        this.editDialogVisible = true;
        this.title = '编辑路径信息';
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
        api.deletePath({ _id: this.currentRow._id })
          .then((res) => {
            me.$message.success('删除成功');
            me.deleteDialogVisible = false;
            me.handleClickSearch();
          }).catch((error) => {
            me.$message.error(error);
          });
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
        api.enablePath({ _id: this.currentRow._id, status: status })
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
      formatSize(row) {
        return `${row.maxSize} | ${row.usage}`;
      },
      pageChange(val) {
        this.page = val;
        //        this.listEngine();
      }
    }
  };
</script>
