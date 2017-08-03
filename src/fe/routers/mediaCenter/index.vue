<template>
  <layout-three-column :leftWidth="201" :rightWidth="439">
    <template slot="left">
      <div class="media-left">
        <div class="media-search">
          <fj-input placeholder="铿锵三人行" size="mini" v-model="keyword" icon="icon-search input-search-icon" @on-icon-click="searchClick" @keydown.native.enter.prevent="searchClick"></fj-input>
        </div>
        <div class="media-category" v-if="categories.length">
          <h4>类别</h4>
          <fj-checkbox-group v-model="checkboxCategory">
            <template v-for="category in categories">
              <div class="category-checkbox">
                <fj-checkbox :label="category">{{category}}</fj-checkbox>
              </div>
            </template>
          </fj-checkbox-group>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>高级</h4>
          <fj-radio-group v-model="checkboxTime">
            <template v-for="time in times">
              <div class="category-checkbox">
                <fj-radio :label="time">{{time}}</fj-radio>
              </div>
            </template>
          </fj-radio-group>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>开始时间</h4>
          <fj-input v-model="startTime"></fj-input>
        </div>
        <div class="media-category" v-if="times.length">
          <h4>结束时间</h4>
          <fj-input v-model="endTime"></fj-input>
        </div>
      </div>
    </template>
    <template slot="center">
      <div class="media-center">
        <div class="media-search-result">
          <span>{{searchResult}}</span>
        </div>
        <ul class="media-list">
          <li class="media-item-li" v-for="item in items" @click="currentItemChange(item)">
            <div class="media-item">
              <img class="media-thumb" v-lazy="getThumb(item)" :alt="getReplaceName(item)">
              <span class="media-duration">{{getDuration(item)}}</span>
            </div>
            <div class="media-item-name" :title="getReplaceName(item)">
              <span :class="getMediaFormatStyle(item)">{{getMediaFormat(item)}}</span>
              <span class="media-title" v-html="getShortName(item)"></span>
            </div>
            <div class="media-item-category">
              <span class="media-item-category-title">类别: </span>
              <span class="media-item-category-value" v-html="item.program_type || ''"></span>
            </div>
            <div class="media-item-storage-time">
              <span class="media-item-category-title">入库时间: </span>
              <span class="media-item-category-value">{{item.last_modify}}</span>
            </div>
          </li>
        </ul>
        <div class="media-pagination">
          <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
        </div>
      </div>
    </template>
    <template slot="right">
      <media-right :currentVideo="currentVideo"></media-right>
    </template>
  </layout-three-column>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import './mediaCenter.css';
  import threeColumn from '../../component/layout/threeColumn';
  import mediaRight from './right';
  import { getTimeByStr, formatDuration } from '../../common/utils';

  const api = require('../../api/media');

  Vue.use(VueLazyload);
  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: 'dist/error.png',
    loading: 'dist/loading.gif',
    attempt: 1
  });

  export default {
    data() {
      return {
        defaultRoute: '/',
        keyword: '',
        checkboxCategory: [],
        checkboxTime: '',
        startTime: '',
        endTime: '',
        categories: ['宣傳', '素材', '廣告'],
        times: ['不限', '3小时内', '5小时内', '7小时内'],
        items: [],
        pageSize: 24,
        total: 0,
        currentPage: 1,
        currentVideo: {},
        searchResult: ''
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.getSearchConfig();
      this.searchClick();
    },
    components: {
      'layout-three-column': threeColumn,
      'media-right': mediaRight
    },
    methods: {
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      searchClick() {
        this.getMediaList();
      },
      getSearchConfig() {
        const me = this;
        api.getSearchConfig()
          .then((res) => {
            me.categories = res.data.category;
            me.times = res.data.duration;
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      getMediaList() {
        const me = this;
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        let program_type = '';
        let duration = '';
        let last_modify = '';
        let q = '';
        if (me.checkboxCategory.length) {
          program_type = me.checkboxCategory.join(' OR ');
        }
        if (me.startTime && !me.endTime) {
          last_modify = `[${me.startTime} TO *]`;
        } else if (!me.startTime && me.endTime) {
          last_modify = `[0 TO ${me.endTime}]`;
        } else if (me.startTime && me.endTime) {
          last_modify = `[${me.startTime} TO ${me.endTime}]`;
        }
        duration = `[0 TO ${getTimeByStr(me.checkboxTime)}]`;
        if (program_type) {
          q = `(program_type:${program_type})`;
        }
        if (duration) {
          if (q) {
            q += ` AND duration:${duration}`;
          } else {
            q = `duration:${duration}`;
          }
        }
        if (this.keyword) {
          if (q) {
            q += ` AND full_text:${this.keyword}`;
          } else {
            q = `full_text:${this.keyword}`;
          }
        }
        if (last_modify) {
          if (q) {
            q += ` AND last_modify:${last_modify}`;
          } else {
            q = `last_modify:${last_modify}`;
          }
        }
        const options = {
          q: q,
          fl: 'id,duration,name,ccid,program_type,program_name_cn,hd_flag,program_name_en,last_modify',
          sort: 'last_modify desc',
          start: start,
          hl: 'on',
          indent: 'on',
          'hl.fl': 'program_type,name,program_name_cn,program_name_en',
          rows: this.pageSize
        };
        api.solrSearch({ params: options })
          .then((res) => {
            me.items = res.data.docs;
            me.total = res.data.numFound;
            me.searchResult = `耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
            if (me.items.length) {
              me.currentVideo = me.items[0];
            }
          })
          .catch((error) => {
            me.$message.error(error);
          });
      },
      handleCurrentPageChange(page) {
        this.getMediaList();
      },
      currentItemChange(item) {
        this.currentVideo = item;
      },
      getThumb(item) {
        return api.getIcon(item.id);
      },
      getDuration(item) {
        return formatDuration(item.duration);
      },
      getMediaFormatStyle(item) {
        if (item.hd_flag === 0) {
          return 'media-format _480P';
        }
        return 'media-format _1080P';
      },
      getMediaFormat(item) {
        if (item.hd_flag === 0) {
          return '480P';
        }
        return '1080P';
      },
      getReplaceName(item) {
        let name = item.program_name_en || '';
        if(name) {
          name = name.replace('<em>', '');
          name = name.replace('</em>', '');
        }
        return name
      },
      getShortName(item) {
        let name = item.program_name_en || '';
        if(name && name.length > 15) {
          name = name.substr(0, 10) + '...';
        }
        return name;
      }
    }
  };
</script>
