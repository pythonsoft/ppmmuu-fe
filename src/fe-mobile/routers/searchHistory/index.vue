<template>
  <div class="page-wrap">
    <div class="return-bar">
      <i class="iconfont icon-arrow-left icon-return" @click="linkToPersonalCenter"></i>
      <h3 class="category-title has-return-btn">检索历史</h3>
    </div>
    <fj-cell v-for="item in items" :key="item._id" :title="item.keyword" :brief="formatTime(item.updatedTime)" right-icon="icon-close" @right-icon-click="deleteHistory(item)"></fj-cell>
    <li
      v-show="total > currentPage * pageSize"
      class="search-history-button"
      @click="currentPage += 1">
      {{ loadListBtnText }}
    </li>
  </div>
</template>
<script>
  import { formatTime } from '../../../fe/common/utils';
  const userAPI = require('../../../fe/api/user');
  export default {
    data() {
      return {
        currentPage: 1,
        pageSize: 24,
        items: [],
        total: 0,
        loadListBtnText: '加载更多'
      };
    },
    mounted() {
      this.updateList();
    },
    methods: {
      formatTime,
      linkToPersonalCenter() {
        this.$router.push({ name: 'personalCenter' });
      },
      updateList() {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        const data = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        userAPI.getSearchHistory({ params: data })
          .then((response) => {
            this.loadListBtnText = '加载更多';
            const responseData = response.data;
            this.items = this.items.concat(responseData.docs);
            this.currentPage = responseData.page;
            this.total = responseData.total;
          })
          .catch((error) => {
            this.loadListBtnText = '加载更多';
            this.$toast.error(error);
          });
      },
      deleteHistory(item) {
        const ids = [item._id];
        userAPI.removeSearchHistory({ ids: ids.join(',') })
          .then((response) => {
            const index = this.items.indexOf(item);
            this.items.splice(index, 1);
            this.$toast.success('删除成功');
          })
          .catch((error) => {
            this.$toast.error(error);
          });
      },
    }
  };
</script>
<style>
  .page-wrap {
    position: relative;
    padding-top: 45px;
    padding-bottom: 55px;
    background: #F8FAFB;
  }
  .return-bar {
    display: flex;
    position: relative;
    height: 49px;
    line-height: 49px;
    padding: 0 15px;
    background-color: #fff;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .return-bar .icon-return {
    position: absolute;
    top: 0;
    left: 15px;
    padding: 0 5px;
    font-size: 18px;
    color: #767676;
  }
  .category-title {
    flex: 1;
    font-size: 17px;
    font-weight: bold;
    color: #333333;
  }
  .category-title.has-return-btn {
    text-align: center;
  }
  .search-history-button {
    width: 100%;
  }
</style>
