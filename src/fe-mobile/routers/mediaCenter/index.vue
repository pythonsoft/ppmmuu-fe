<template>
  <div class="page-wrap">
    <template v-if="!listType">
      <div
        class="category-item"
        v-for="categoryItem in defaultList">
        <div class="category-header">
          <h3 class="category-title">{{ categoryItem.category }}</h3>
          <span class="category-more-btn" @click="linkToCategory(categoryItem.category)">更多<i class="iconfont icon-arrow-right"></i></span>
        </div>
        <ul class="clearfix" :style="{marginLeft: '-3px'}">
          <fj-card
            width="50%"
            v-for="(item, index) in categoryItem.docs"
            :key="item.id + index"
            :thumb="getThumb(item)"
            :title="getTitle(item)"
            :time="formatShowTime(item).value || '无发布时间'"
            :duration="getDuration(item)"
            :definition="getMediaFormat(item)"
            @click-card="linkToWatch(item)"></fj-card>
        </ul>
      </div>
    </template>
    <div v-else-if="listType === 'searchResult'">
      <div v-if="searchResult.length === 0" class="search-result-empty-box">
        <i class="iconfont icon-shipin"></i>
        <span class="empty-text">暂无搜索结果</span>
      </div>
      <template v-else>
        <ul class="clearfix" :style="{marginLeft: '-3px', marginTop: '15px'}">
          <fj-card
            width="50%"
            v-for="(item, index) in searchResult"
            :key="item.id + index"
            :thumb="getThumb(item)"
            :title="getTitle(item)"
            :time="formatShowTime(item).value || '无发布时间'"
            :duration="getDuration(item)"
            :definition="getMediaFormat(item)"
            @click-card="linkToWatch(item)"></fj-card>
        </ul>
        <li
          v-show="searchResultTotal > searchResultCurrentPage * pageSize"
          class="search-history-button"
          @click="searchResultCurrentPage += 1">
          {{ loadSearchResultBtnText }}
        </li>
      </template>
    </div>
    <div v-else>
      <div class="category-header">
        <i class="iconfont icon-arrow-left icon-return" @click="linkToHome"></i>
        <h3 class="category-title has-return-btn">{{ listType }}</h3>
      </div>
      <ul class="clearfix" :style="{marginLeft: '-3px'}">
        <fj-card
          width="50%"
          v-for="(item, index) in categoryList"
          :key="item.id + index"
          :thumb="getThumb(item)"
          :title="getTitle(item)"
          :time="formatShowTime(item).value || '无发布时间'"
          :duration="getDuration(item)"
          :definition="getMediaFormat(item)"
          @click-card="linkToWatch(item)"></fj-card>
      </ul>
      <li
        class="search-history-button"
        @click="currentPage += 1">
        {{ loadCategoryListBtnText }}
      </li>
    </div>
  </div>
</template>
<script>
  import {
    getDuration,
    getMediaFormat,
    getTitle,
    getThumb,
    formatShowTime
  } from '../../../fe/routers/mediaCenter/common';
  import { formatTime, isEmptyObject } from '../../../fe/common/utils';
  import {
    getTimeRange,
    getQuery,
    getSearchNotice,
    getOrder,
    formatMust,
    getHighLightFields,
    ORDER_OPTIONS,
    HHIGHLIGHT_FIELDS1,
    HHIGHLIGHT_FIELDS2,
    FILETR_FIELDS
  } from '../../../fe/routers/mediaCenter/config';

  const mediaAPI = require('../../../fe/api/media');
  const userAPI = require('../../../fe/api/user');

  export default {
    data() {
      return {
        listType: '',
        defaultList: [],
        categoryList: [],
        searchResult: [],
        datetimerange1: [],
        datetimerange2: [],
        pageSize: 24,
        currentPage: 1,
        searchResultCurrentPage: 1,
        searchResultTotal: 0,
        loadSearchResultBtnText: '加载更多',
        loadCategoryListBtnText: '加载更多'
      };
    },
    created() {
      const program_type = this.$route.params.program_type;
      if (program_type) {
        this.listType = program_type;
      } else {
        this.getDefaultMedia();
      }
    },
    watch: {
      '$route.params.program_type'(val) {
        this.listType = val;
      },
      listType(val) {
        if (val && val !== 'searchResult') {
          this.getMediaList();
        } else {
          this.getSearchResult(this.$parent.searchOptions);
        }
      },
      currentPage(val) {
        this.getMediaList();
      },
      searchResultCurrentPage(val) {
        const options = this.$parent.searchOptions;
        options.start = (val - 1) * this.pageSize;
        this.getSearchResult(options);
      },
      '$parent.searchOptions'(val) {
        if (isEmptyObject(val)) {
          this.listType = '';
          this.getDefaultMedia();
        }else {
          if (this.listType === 'searchResult') {
            this.searchResult = [];
            this.searchResultCurrentPage = 1;
            this.getSearchResult(val);
          }
          this.listType = 'searchResult';
        }
      }
    },
    methods: {
      getDuration,
      getMediaFormat,
      getTitle,
      formatTime,
      getThumb,
      formatShowTime,
      getDefaultMedia() {
        mediaAPI.defaultMedia({ params: { size: 4 } }, this)
        .then((res) => {
          this.defaultList = res.data;
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      linkToWatch(item) {
        this.$router.push({
          name: 'watch',
          params: { objectId: item.id, fromWhere: item.from_where }
        });
      },
      linkToCategory(name) {
        this.$router.push({ name: 'mediaCenter', params: { program_type: name } });
      },
      linkToHome() {
        this.$router.push({ name: 'mediaCenter' });
        this.listType = '';
      },
      getWatchHistory() {
        const data = {
          page: this.currentPage,
          pageSize: this.pageSize
        };
        userAPI.getWatchHistory({ params: data })
          .then((response) => {
            const responseData = response.data;
            const tempList = responseData.docs.map(item => Object.assign(item.videoContent, { _id: item._id }));
            this.categoryList = this.categoryList.concat(tempList);
            this.loadCategoryListBtnText = '加载更多';
          })
          .catch((error) => {
            this.$toast.error(error);
          });
      },
      getMediaList() {
        if (this.loadCategoryListBtnText === '加载中...') return;
        this.loadCategoryListBtnText = '加载中...';
        if (this.listType === '瀏覽歷史') {
          this.getWatchHistory();
          return;
        }
        const me = this;
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        const options = {
          source: FILETR_FIELDS,
          match: [],
          should: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: start,
          pageSize: this.pageSize
        };
        const must = options.match;
        must.push({ key: 'program_type', value: this.listType });

        options.sort = [{
          key: 'full_time',
          value: 'desc'
        }];

        mediaAPI.esSearch(options, this).then((res) => {
          this.categoryList = this.categoryList.concat(res.data.docs);
          this.loadCategoryListBtnText = '加载更多';
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      getSearchResult(options) {
        if (this.loadSearchResultBtnText === '加载中...') return;
        this.loadSearchResultBtnText = '加载中...';
        mediaAPI.esSearch(options, this).then((res) => {
          this.loadSearchResultBtnText = '加载更多';
          this.searchResult = this.searchResult.concat(res.data.docs);
          this.searchResultTotal = res.data.numFound;
        }).catch((error) => {
        });
      }
    }
  };
</script>
<style>
  .page-wrap {
    position: relative;
    padding-top: 45px;
    padding-bottom: 55px;
    /*flex-grow: 1;*/
    background: #F8FAFB;
    /*overflow-y: auto;*/
  }
  .category-item {
    margin-bottom: 15px;
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
  .category-header {
    position: relative;
    display: flex;
    height: 49px;
    line-height: 49px;
    padding: 0 15px;
    background: #fff;
  }
  .category-header .icon-return {
    position: absolute;
    top: 0;
    left: 15px;
    padding: 0 5px;
    font-size: 18px;
    color: #767676;
  }
  .category-more-btn,
  .category-more-btn .iconfont {
    font-size: 13px;
    color: #AAAAAA;
  }
  .search-result-empty-box {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 15px;
    background-color: #fff;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .search-result-empty-box .iconfont {
    display: block;
    width: 80px;
    height: 80px;
    line-height: 80px;
    text-align: center;
    border-radius: 50%;
    background: #E3EAF3;
    color: #fff;
    font-size: 38px;
  }
  .empty-text {
    display: block;
    margin-top: 10px;
    font-size: 12px;
    color: #AAAAAA;
  }
</style>
