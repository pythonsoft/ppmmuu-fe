<template>
  <div :class="$style.browseBox" ref="browseBox">
    <h1 :class="$style.title">观看历史</h1>
    <div :class="$style.contentHeader" class="clearfix">
      <p :class="$style.headerText">共{{ total }}条记录</p>
      <i class="iconfont icon-delete" :class="$style.headerRight"></i>
    </div>
    <grid-list-view
      :editable="true"
      type="grid"
      :width="listWidth"
      :items="items"
      @deleteItem="deleteItem"
    ></grid-list-view>
    <div :class="$style.pagination" v-show="items.length">
      <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
    </div>
  </div>
</template>
<script>
  import GridListView from '../../mediaCenter/gridAndList';
  import mediaAPI from '../../../api/media';
  import { formatQuery } from '../../../common/utils';

  export default {
    data() {
      return {
        listWidth: 0,
        items: [],
        pageSize: 24,
        total: 0,
        currentPage: 1
      };
    },
    mounted() {
      this.updateList();
      this.updateListWidth();
      window.addEventListener('resize', this.updateListWidth);
    },
    methods: {
      deleteItem(item) {
        console.log('item', item);
      },
      updateList() {
        // const data = {
        //   page: this.currentPage,
        //   pageSize: this.pageSize
        // };
        // mediaAPI.getWatchHistory(formatQuery(data, true))
        //   .then((response) => {
        //     const responseData = response.data;
        //     this.tableData = responseData.docs;
        //     this.currentPage = responseData.page;
        //     this.total = responseData.total;
        //     this.selectedItems = [];
        //   })
        //   .catch((error) => {
        //     this.$message.error(error);
        //   });
      },
      updateListWidth() {
        const browseBoxWidth = this.$refs.browseBox.getBoundingClientRect().width;
        this.listWidth = browseBoxWidth;
      },
      currentItemChange() {},
      handleCurrentPageChange() {}
    },
    components: {
      GridListView
    }
  }
</script>
<style module>
  .browseBox {
    max-width: 1182px;
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
