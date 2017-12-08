<template>
  <div class="page-wrap">
    <div class="return-bar">
      <i class="iconfont icon-arrow-left icon-return" @click="linkToPersonalCenter"></i>
      <h3 class="category-title has-return-btn">观看历史</h3>
    </div>
    <ul class="clearfix" :style="{marginLeft: '-3px'}">
      <fj-card
        editable
        width="50%"
        v-for="item in items"
        :key="item.id"
        :thumb="getThumb(item)"
        :title="getTitle(item)"
        :time="formatTime(item.publish_time) || '无发布时间'"
        :duration="getDuration(item)"
        :definition="getMediaFormat(item)"
        @click-card="linkToWatch(item)"
        @delete-item="deleteItem(item)"></fj-card>
        <li
          v-show="total > currentPage * pageSize"
          class="search-history-button"
          @click="currentPage += 1">
          {{ loadListBtnText }}
        </li>
    </ul>
  </div>
</template>
<script>
  import {
    getDuration,
    getMediaFormat,
    getTitle,
    getThumb,
  } from '../../../fe/routers/mediaCenter/common';
  import { formatTime, isEmptyObject } from '../../../fe/common/utils';
  const userAPI = require('../../../fe/api/user');

  export default {
    data() {
      return {
        loadListBtnText: '加载更多',
        currentPage: 1,
        pageSize: 24,
        items: [],
        total: 0
      };
    },
    created() {
      this.updateList();
    },
    watch: {
      currentPage(val) {
        this.updateList();
      }
    },
    methods: {
      formatTime,
      getDuration,
      getMediaFormat,
      getTitle,
      getThumb,
      linkToPersonalCenter() {
        this.$router.push({ name: 'personalCenter' });
      },
      linkToWatch(item) {
        this.$router.push({ name: 'watch', params: { objectId: item.id, fromWhere: item.from_where } });
      },
      updateList() {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        const data = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        userAPI.getWatchHistory({ params: data }, this)
          .then((response) => {
            this.loadListBtnText = '加载更多';
            const responseData = response.data;
            const tempList =
              responseData.docs.map(item => Object.assign(item.videoContent, { _id: item._id }));
            this.items = this.items.concat(tempList);
            this.currentPage = responseData.page;
            this.total = responseData.total;
          })
          .catch((error) => {
            this.loadListBtnText = '加载更多';
            this.$toast.error(error);
          });
      },
      deleteItem(item) {
        const id = item._id;

        userAPI.removeWatchHistory({ ids: id })
          .then((response) => {
            // this.updateList();
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
