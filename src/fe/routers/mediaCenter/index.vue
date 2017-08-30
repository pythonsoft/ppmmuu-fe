<template>
  <layout-three-column :leftWidth="201" :rightWidth="442">
    <template slot="left">
      <div class="media-left">
        <div class="media-search">
          <fj-input
            placeholder="请输入检索关键词"
            size="small"
            v-model="keyword"
            icon="icon-search input-search-icon"
            @on-icon-click="searchClick"
            @keydown.native.enter.prevent="searchClick"
          ></fj-input>
        </div>
        <template v-for="config in searchSelectConfigs">
          <div class="media-category">
            <h4>{{config.label}}</h4>
            <fj-select placeholder="请选择" v-model="config.selected" size="small">
              <fj-option
                      v-for="item in config.items"
                      :key="item.key"
                      :label="item.label"
                      :value="item.value">
              </fj-option>
            </fj-select>
          </div>
        </template>

        <template v-for="config in searchRadioboxConfigs">
          <div class="media-category clearfix">
            <h4>{{config.label}}</h4>
            <fj-radio-group v-model="config.selected">
              <template v-for="item in config.items">
                <div class="category-checkbox">
                  <fj-radio :label="item.value">{{item.label}}</fj-radio>
                </div>
              </template>
            </fj-radio-group>
          </div>
        </template>

        <div class="media-category">
          <h4>新聞日期</h4>
          <div id="media-category-date">
            <fj-date-picker
              type="datetimerange"
              placeholder="请选择日期范围"
              v-model="datetimerange1"
            ></fj-date-picker>
          </div>
        </div>

        <div class="media-category">
          <h4>首播日期</h4>
          <div id="media-category-date">
            <fj-date-picker
                    type="datetimerange"
                    placeholder="请选择日期范围"
                    v-model="datetimerange2"
            ></fj-date-picker>
          </div>
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
              <span :class="viewTypeSelect('grid')" @click="setViewType('grid')"></span>
              <span :class="viewTypeSelect('list')" @click="setViewType('list')"></span>
            </div>
          </div>

          <div v-if="items.length === 0" class="media-center-empty-result">
            <div class="iconfont icon-media-library media-center-empty-result-bg"></div>
            <p class="media-center-empty-result-text">暂无搜索结果</p>
          </div>

          <grid-list-view
            v-else
            :type="viewType"
            :width="listWidth"
            :items="items"
            @currentItemChange="currentItemChange"
          ></grid-list-view>

          <div class="media-pagination" v-if="items.length">
            <fj-pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></fj-pagination>
          </div>
        </div>
      </div>
    </template>
    <template slot="right">
      <media-right
        :videoInfo="currentVideo"
        @showMovieEditor="setMovieEditorDisplay"
      ></media-right>
    </template>
  </layout-three-column>
</template>
<script>
  import Vue from 'vue';
  import { getTimeByStr, formatDuration, getPosition, appendToBody } from '../../common/utils';
  import './index.css';
  import { searchSelectConfigs, searchRadioboxConfigs, getTimeRange, getQuery } from './config';

  import threeColumn from '../../component/layout/threeColumn';
  import gridAndList from './gridAndList';
  import mediaRight from './right';

  const api = require('../../api/media');

  export default {
    components: {
      'layout-three-column': threeColumn,
      'media-right': mediaRight,
      'grid-list-view': gridAndList,
    },
    data() {
      return {
        defaultRoute: '/',
        keyword: '',
        searchSelectConfigs: searchSelectConfigs,
        searchRadioboxConfigs: searchRadioboxConfigs,
        pageSize: 24,
        total: 0,
        currentPage: 1,
        currentVideo: {},
        searchResult: '耗时0秒,结果0条',
        /* client */
        items: [],
        offsetWidth: 0,
        offsetHeight: 0,
        listWidth: 0,
        itemSize: { width: 266, height: 224 },
        timeId: '',

        viewType: 'grid',
        fl: 'id,duration,name,ccid,program_type,program_name_cn,hd_flag,program_name_en,last_modify,f_str_03',

        datetimerange1: [],
        datetimerange2: [],
        displayMovieEditor: false,

        parentSize: { width: '100', height: '100' }
      };
    },
    created() {
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
    },
    methods: {
      setMovieEditorDisplay(v) {
        this.displayMovieEditor = v;
      },
      setViewType(t) {
        this.viewType = t;
        this.fl = 'id,duration,name,ccid,program_type,program_name_cn,hd_flag,program_name_en,last_modify';
        if (t === 'list') {
          this.fl += ',f_str_03';
        }
      },
      viewTypeSelect(type) {
        let className = 'iconfont';

        if (type === 'grid') {
          className += ' icon-view-grid media-center-view-grid';
          if (this.viewType === 'grid') {
            className += ' media-center-view-selected';
          }
        } else if (type === 'list') {
          className += ' icon-view-list media-center-view-list';

          if (this.viewType === 'list') {
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
          const pageSize = (me.offsetWidth / me.itemSize.width | 0) *
            (me.offsetHeight / me.itemSize.height | 0);
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
      getMediaList() {
        const me = this;
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        const f_date_162 = getTimeRange(this.datetimerange1);   //新聞日期
        const f_date_36 = getTimeRange(this.datetimerange2);    //首播日期
        let q = getQuery(this.searchSelectConfigs.concat(this.searchRadioboxConfigs));


        if (this.keyword) {
          if (q) {
            q += ` AND full_text:${this.keyword}`;
          } else {
            q = `full_text:${this.keyword}`;
          }
        }


        const options = {
          q: q,
          fl: this.fl,
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
