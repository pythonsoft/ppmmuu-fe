<template>
  <four-row-layout-right-content>
    <template slot="search-left">大洋稿件入库</template>
    <template slot="search-right">
      <div class="permission-search-item">
        <fj-select placeholder="请选择" v-model="status" size="small" multi>
          <fj-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
          </fj-option>
        </fj-select>
      </div>
      <div class="permission-search-item">
        <fj-input placeholder="请输入关键字" v-model="keyword" size="small" @keydown.native.enter.prevent="handleClickSearch"></fj-input>
      </div>
      <div class="permission-search-item">
        <fj-button type="primary" @click="handleClickSearch" size="small">查询</fj-button>
      </div>
    </template>
    <template slot="operation">
      <div class="operation-btn-group">
        <fj-button type="primary" size="mini" v-bind:disabled="currentStatus != '0'" @click="dialogVisible=true">再次提交</fj-button>
        <fj-button type="primary" size="mini" v-bind:disabled="!currentRow" @click="detailDialogVisible=true">查看</fj-button>
      </div>
    </template>
    <template slot="table">
      <fj-table :data="tableData" name="table1" ref="table" @current-change="handleCurrentChange">
        <fj-table-column prop="status" label="状态" width="90">
          <template slot-scope="props"><div :class="['copy-status-base', getSubmitStatus(props.row.status).class]">{{getSubmitStatus(props.row.status).text}}</div></template>
        </fj-table-column>
        <fj-table-column prop="title" label="标题"></fj-table-column>
        <fj-table-column prop="viceTitle" label="副标题">
          <template slot-scope="props">{{props.row.viceTitle | valueLengthLimit(15)}}</template>
        </fj-table-column>
        <fj-table-column prop="modifyTime" label="修改时间" width="340">
          <template slot-scope="props">{{props.row.modifyTime | formatTime}}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <fj-dialog
            title="提示"
            :visible.sync="dialogVisible"
            @close="dialogVisible=false">

      <span>确定要再次提交吗</span>

      <div slot="footer" class="dialog-footer">
        <fj-button @click="dialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :isLoading="isBtnLoading" @click="handleClickResubmit">确定</fj-button>
      </div>

    </fj-dialog>
    <fj-slide-dialog
            title="详情"
            :visible.sync="detailDialogVisible"
            @close="detailDialogVisible=false">

      <fj-form :model="currentRow" ref="editForm" label-width="110px" v-if="currentRow">
        <fj-form-item label="标题">
          <fj-input :value="currentRow.title" :readonly="true"></fj-input>
        </fj-form-item>
        <fj-form-item label="副标题">
          <fj-input :value="currentRow.viceTitle" :readonly="true"></fj-input>
        </fj-form-item>
        <fj-form-item label="状态">
          <fj-input :value="getSubmitStatus(currentRow.status).text" :readonly="true"></fj-input>
        </fj-form-item>
        <fj-form-item label="内容">
          <fj-input :value="currentRow.editContent[0].content" :readonly="true" :rows="3" type="textarea"></fj-input>
        </fj-form-item>
        <fj-form-item label="创建者">
          <fj-input :value="currentRow.creator.Name" :readonly="true"></fj-input>
        </fj-form-item>
        <fj-form-item label="协作人员">
          <div v-if="currentRow.collaborators && currentRow.collaborators.length" style="padding-top: 5px;">
            <fj-tag
                    v-for="item in currentRow.collaborators"
                    :key="item.Id"
                    type="primary">{{ item.Name }}</fj-tag>
          </div>
          <fj-input value="" :readonly="true" v-else></fj-input>
        </fj-form-item>
        <fj-form-item label="创建时间">
          <fj-input v-model="currentRow.createdTime" :readonly="true"></fj-input>
        </fj-form-item>
        <fj-form-item label="修改时间">
          <fj-input v-model="currentRow.modifyTime" :readonly="true"></fj-input>
        </fj-form-item>
      </fj-form>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="detailDialogVisible=false">取消</fj-button>
      </div>
    </fj-slide-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import { formatQuery } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent/index';
  import { getSubmitStatus, SUBMIT_MENUS } from './config';

  const api = require('../../../api/manuscript');

  export default {
    components: {
      'four-row-layout-right-content': FourRowLayoutRightContent,
    },
    data() {
      return {
        defaultRoute: '/',
        dialogVisible: false,
        options: SUBMIT_MENUS,
        keyword: '',
        status: '',
        tableData: [],
        currentPage: 1,
        total: 0,
        pageSize: 15,
        detailDialogVisible: false,
        currentStatus: '',
        currentRow: null,
        isBtnLoading: false
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.handleClickSearch();
    },
    watch: {
      status(val) {
        this.currentPage = 1;
        this.handleClickSearch();
      }
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
          keyword: me.keyword,
          status: me.status
        };
        if(searchObj.status === 'all'){
          searchObj.status = '';
        }
        api.listManageSubmitScript(formatQuery(searchObj, true), me)
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.handleSelectionChange();
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      handleCurrentChange(row) {
        this.currentRow = row;
        this.currentStatus = row.status;
      },
      handleCurrentPageChange(val) {
        this.handleClickSearch();
      },
      handleClickResubmit() {
        const data = {
          _id: this.currentRow._id
        }
        const me = this;
        me.isBtnLoading = true;
        api.manageResubmitScript(data)
          .then((res) => {
            const data = res.data;
            me.tableData = data ? data.docs : [];
            me.currentPage = data.page;
            me.total = data.total;
            me.pageSize = data.pageSize;
            me.$message.success('再次提交成功!');
            me.handleClickSearch();
            me.dialogVisible = false;
            me.isBtnLoading = false;
          })
          .catch((error) => {
            me.$message.error(error);
            me.dialogVisible = false;
            me.isBtnLoading = false;
          });
      },
      getSubmitStatus
    }
  };
</script>
<style slot-scope>
  .permission-search-item{
    float: left;
    margin-left: 10px;
    line-height: 100%;
  }

  .operation-btn-group {
    display: inline-block;
    margin-right: 18px;
  }
  .operation-btn-group button {
    margin-right: 6px;
  }

  .submit-dealing {
    background: #9B9B07;
  }

  .submit-dealed {
    background: #20B1A3;
  }

  .submit-error {
    background: #FF3366;
  }

  .copy-status-base {
    font-size: 12px;
    color: #FFFFFF;
    width: 60px;
    height: 20px;
    line-height: 20px;
    border-radius: 2px;
    text-align:center;
    display: block;
  }
</style>
