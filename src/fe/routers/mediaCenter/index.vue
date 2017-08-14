<template>
  <layout-three-column :leftWidth="201" :rightWidth="442">
    <template slot="left">
      <div class="media-left">
        <div class="media-search">
          <fj-input
            placeholder="请输入检索关键词"
            size="mini"
            v-model="keyword"
            icon="icon-search input-search-icon"
            @on-icon-click="searchClick"
            @keydown.native.enter.prevent="searchClick"
          ></fj-input>
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
      <div class="media-center-wrap" ref="mediaCenter">
        <div class="media-center" :style="{ width: !listWidth ? '100%' : (listWidth - 26) + 'px', height: items.length === 0 ? '100%' : 'auto' }">
          <div class="media-center-result-bar">
            <span class="media-center-result-count">
              {{searchResult}}
            </span>
            <div class="media-center-view-bar">
              <span :class="viewTypeSelect('grid')" @click="viewType='grid'"></span>
              <span :class="viewTypeSelect('list')" @click="viewType='list'"></span>
            </div>
          </div>

          <div v-if="items.length === 0" class="media-center-empty-result">
            <div class="iconfont icon-media-library media-center-empty-result-bg"></div>
            <p class="media-center-empty-result-text">暂无搜索结果</p>
          </div>

          <grid-view
            v-else
            :type="viewType"
            :width="listWidth"
            :items="items"
            @currentItemChange="currentItemChange"
          ></grid-view>

          <div class="media-pagination" v-if="items.length">
            <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
          </div>
        </div>
      </div>
    </template>
    <template slot="right">
      <media-right
        :videoInfo="currentVideo"
      ></media-right>
    </template>
  </layout-three-column>
</template>
<script>
  import './index.css';

  import threeColumn from '../../component/layout/threeColumn';
  import gridView from './grid';
  import mediaRight from './right';
  import { getTimeByStr, formatDuration,  } from '../../common/utils';

  const api = require('../../api/media');

  export default {
    components: {
      'layout-three-column': threeColumn,
      'media-right': mediaRight,
      'grid-view': gridView,
    },
    data() {
      return {
        defaultRoute: '/',
        keyword: '',
        checkboxCategory: [],
        checkboxTime: '',
        startTime: '',
        endTime: '',
        categories: [],
        times: [],
        items: [],
        pageSize: 24,
        total: 0,
        currentPage: 1,
        currentVideo: {},
        searchResult: '耗时0秒,结果0条',
        /* client */

        offsetWidth: 0,
        offsetHeight: 0,
        listWidth: 0,
        itemSize: { width: 266, height: 224 },
        timeId: '',

        viewType: 'list'
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      this.getSearchConfig();
    },
    methods: {
      viewTypeSelect(type) {
        let className = 'iconfont';

        if(type === 'grid') {
          className += ' icon-Group media-center-view-grid';
          if(this.viewType === 'grid') {
            className += ' media-center-view-selected';
          }
        }else if(type === 'list') {

          className += ' icon-Group1 media-center-view-list';

          if(this.viewType === 'list') {
            className += ' media-center-view-selected';
          }
        }

        return className;
      },
      resize() {
        clearTimeout(this.timer);
        const me = this;
        me.timer = setTimeout(() => {
          me.offsetWidth = me.$refs.mediaCenter.offsetWidth - 26 * 2;
          me.offsetHeight = document.body.clientHeight - 53;
          me.listWidth = (me.offsetWidth / me.itemSize.width | 0) * me.itemSize.width;
          const pageSize = (me.offsetWidth / me.itemSize.width | 0) * (me.offsetHeight / me.itemSize.height | 0);
          me.pageSize = pageSize < 20 ? 20 : pageSize;

          me.getMediaList();
        }, 400);
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      searchClick() {
        this.resize();
      },
      getSearchConfig() {
        const me = this;
        api.getSearchConfig().then((res) => {
          me.categories = res.data.category;
          me.times = res.data.duration;
        }).catch((error) => {
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

        api.solrSearch({ params: options }, me).then((res) => {
          me.items = res.data.docs;
          me.total = res.data.numFound;
          me.searchResult = `耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      handleCurrentPageChange(page) {
        this.getMediaList();
      },
      currentItemChange(item) {
        this.currentVideo = item;
      }
    }
  };
</script>
