<template>
  <div>
    <div v-show="visible" :class="$style.browseBox" ref="browseBox">
      <h1 :class="$style.title">观看历史</h1>
      <div :class="$style.contentHeader" class="clearfix">
        <p :class="$style.headerText">共{{ total }}条记录</p>
        <i class="iconfont icon-delete" :class="$style.headerRight" @click="showClearHistoryDialog"></i>
      </div>
      <grid-list-view
        :editable="true"
        type="grid"
        :width="listWidth"
        :items="items"
        @deleteItem="deleteItem"
        @currentItemChange="currentItemChange"
      ></grid-list-view>
      <div :class="$style.pagination" v-show="items.length">
        <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
      </div>
      <fj-dialog
        title="清空"
        :visible.sync="clearHistoryDialogVisible">
        <p>您确定要清空吗？</p>
        <div slot="footer" class="dialog-footer">
          <fj-button @click.stop="clearHistoryDialogVisible=false">取消</fj-button><!--
          --><fj-button type="primary" :loading="isClearBtnLoading" @click.stop="clearHistory">确定</fj-button>
        </div>
      </fj-dialog>
    </div>
    <router-view></router-view>
  </div>
</template>
<script>
  import GridListView from '../../mediaCenter/gridAndList';
  import userAPI from '../../../api/user';
  import { formatQuery } from '../../../common/utils';

  export default {
    data() {
      return {
        listWidth: 0,
        items: [],
        pageSize: 24,
        total: 0,
        currentPage: 1,
        clearHistoryDialogVisible: false,
        isClearBtnLoading: false,
        visible: true
      };
    },
    mounted() {
      this.updateVisible();
    },
    watch: {
      '$route.path'(val) {
        this.updateVisible();
      }
    },
    methods: {
      updateVisible() {
        if (this.$route.path.indexOf('watch') > -1) {
          this.visible = false;
        } else {
          this.visible = true;
          this.updateList();
          this.updateListWidth();
          window.addEventListener('resize', this.updateListWidth);
        }
      },
      showClearHistoryDialog() {
        this.clearHistoryDialogVisible = true;
      },
      clearHistory() {
        this.isClearBtnLoading = true;
        userAPI.clearWatchHistory()
          .then((response) => {
            this.updateList();
            this.isClearBtnLoading = false;
            this.clearHistoryDialogVisible = false;
            this.$message.success('删除成功');
          })
          .catch((error) => {
            this.isClearBtnLoading = false;
            this.$message.error(error);
          });
      },
      currentItemChange(item) {
        this.$router.push({ name: 'historyWatch', params: { objectId: item.id, fromWhere: item.from_where } });
      },
      deleteItem(item) {
        const id = item._id;

        userAPI.removeWatchHistory({ ids: id })
          .then((response) => {
            this.updateList();
            this.$message.success('删除成功');
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateList() {
        const data = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        userAPI.getWatchHistory(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            const tempList =
              responseData.docs.map(item => Object.assign(item.videoContent, { _id: item._id }));
            this.items = tempList;
            this.currentPage = responseData.page;
            this.total = responseData.total;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      updateListWidth() {
        const browseBoxWidth = this.$refs.browseBox.getBoundingClientRect().width;
        this.listWidth = browseBoxWidth;
      },
      handleCurrentPageChange() {
        this.updateList();
      }
    },
    components: {
      GridListView
    }
  };
</script>
<style module>
  .browseBox {
    max-width: 1188px;
    margin: 0 20px;
  }
  .title {
    height: 62px;
    line-height: 62px;
    font-size: 14px;
    color: #2A3E52;
    border-bottom: 1px solid #EBF2FA;
  }
  .contentHeader {
    height: 50px;
    line-height: 50px;
  }
  .headerText {
    display: inline-block;
    font-size: 12px;
    color: #4C637B;
  }
  .headerRight {
    float: right;
    font-size: 14px;
    color: #4C637B;
    cursor: pointer;
  }
  .pagination {
    text-align: center;
    margin: 40px 0;
  }
</style>
