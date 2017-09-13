<template>
  <four-row-layout-right-content>
    <template slot="search-left">检索历史</template>
    <template slot="operation">
      <fj-button size="mini" type="primary" :disabled="selectedItems.length<=0" @click="showDeleteHistoryDialog">删除</fj-button>
      <fj-button size="mini" type="primary" @click="">清空全部</fj-button>
    </template>
    <template slot="table">
      <fj-table :data="tableData" @selection-change="handleSelectionChange">
        <fj-table-column type="selection" width="50" align="center"></fj-table-column>
        <fj-table-column prop="keyword" label="检索词"></fj-table-column>
        <fj-table-column prop="updatedTime" label="时间">
          <template scope="props">{{ props.row.updatedTime | formatTime }}</template>
        </fj-table-column>
      </fj-table>
    </template>
    <template slot="pagination" v-show="tableData.length">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </template>
    <fj-dialog
      title="删除"
      :visible.sync="deleteHistoryDialogVisible">
      <p>您确定要删除吗？</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="deleteHistoryDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="isDeleteBtnLoading" @click.stop="deleteHistory">确定</fj-button>
      </div>
    </fj-dialog>
  </four-row-layout-right-content>
</template>
<script>
  import mediaAPI from '../../../api/media';
  import { formatQuery } from '../../../common/utils';
  import FourRowLayoutRightContent from '../../../component/layout/fourRowLayoutRightContent';

  export default {
    data() {
      return {
        selectedItems: [],
        tableData: [],
        pageSize: 20,
        total: 0,
        currentPage: 1,
        deleteHistoryDialogVisible: false,
        isDeleteBtnLoading: false
      };
    },
    mounted() {
      this.updateList();
    },
    methods: {
      handleSelectionChange(val) {
        this.selectedItems = val;
      },
      handleCurrentPageChange(newPage, oldPage) {
        if (oldPage !== 0 && newPage > 0) {
          this.updateList();
        }
      },
      showDeleteHistoryDialog() {
        this.deleteHistoryDialogVisible = true;
      },
      deleteHistory() {},
      updateList() {
        const data = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        mediaAPI.getSearchHistory(formatQuery(data, true))
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
      }
    },
    components: {
      FourRowLayoutRightContent
    }
  };
</script>
