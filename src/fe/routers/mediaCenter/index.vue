<template>
  <layout-three-column :leftWidth="217" :rightWidth="448">
    <template slot="left">
      <div class="media-left" ref="mediaLeft">
        <div :style="{ width: '165px' }">
          <div class="media-search">
            <!-- <fj-input
              placeholder="请输入检索关键词"
              size="small"
              theme="fill"
              v-model="keyword"
              icon="icon-search input-search-icon"
              @on-icon-click="searchClick"
              @keydown.native.enter.prevent="searchClick"
            ></fj-input> -->
            <fj-select
              remote
              :parent-el="selectParentEl"
              :clear-history-method="clearHistory"
              :history-method="getSearchHistory"
              :remote-method="remoteMethod"
              :loading="loading"
              @search="searchClick"
              v-model="keyword"
              placeholder="请输入检索关键词"
              size="small"
              theme="fill">
              <fj-option
                v-for="item in keywordOptions"
                :key="item._id"
                :label="item.label"
                :value="item.value">
              </fj-option>
            </fj-select>
            <fj-radio-group v-model="isAccurate">
              <div class="category-checkbox-l">
                <fj-radio :label="true">精确搜索</fj-radio>
              </div>
              <div class="category-checkbox-l">
                <fj-radio :label="false">模糊搜索</fj-radio>
              </div>
            </fj-radio-group>
          </div>
          <template v-for="config in searchConfig">
            <div class="media-category" v-if="getType(config) === 'select'">
              <h4>{{config.label}}</h4>
              <fj-select :parent-el="selectParentEl" placeholder="请选择" v-if="config.key==='program_type'" v-model="programType" size="small" theme="fill" :controlLength="10" clearable multiple>
                <fj-option
                  v-for="item in config.items"
                  :key="item.key"
                  :label="item.label"
                  :value="item.value">
                </fj-option>
              </fj-select>
              <fj-select :parent-el="selectParentEl" placeholder="请选择" v-else v-model="config.selected" size="small" theme="fill" :controlLength="10" clearable multiple>
                <fj-option
                        v-for="item in config.items"
                        :key="item.key"
                        :label="item.label"
                        :value="item.value">
                </fj-option>
              </fj-select>
            </div>
            <div class="media-category clearfix" v-else-if="getType(config) === 'radio'">
              <h4>{{config.label}}</h4>
              <fj-radio-group v-model="config.selected">
                <template v-for="item in config.items">
                  <div class="category-checkbox">
                    <fj-radio :label="item.value">{{item.label}}</fj-radio>
                  </div>
                </template>
              </fj-radio-group>
            </div>
            <div class="media-category" v-else-if="getType(config) === 'daterange'">
              <h4>{{config.label}}</h4>
              <div id="media-category-date">
                <fj-date-picker
                        theme="fill"
                        :parent-el="selectParentEl"
                        type="datetimerange"
                        placeholder="请选择日期范围"
                        v-model="config.selected"
                ></fj-date-picker>
              </div>
            </div>
          </template>
        </div>
      </div>
    </template>
    <template slot="center">
      <div class="media-center-wrap" ref="mediaCenter">
        <div
          class="media-center"
          :style="{ width: !listWidth ? '100%' : listWidth + 'px' }">
          <div v-if="listType === 'default'" :style="{ padding: '0 26px'}">
            <template v-for="categoryItem in defaultList">
              <h3 class="category-title">{{ categoryItem.category }}</h3>
              <grid-list-view
                class="media-center-category-list"
                type="grid"
                :width="listWidth"
                :items="categoryItem.docs"
                :current-item.sync="currentVideo"
              ></grid-list-view>
            </template>
          </div>
          <div v-else :style="{ padding: '0 26px'}">
            <div class="media-center-result-bar clearfix">
              <span class="media-center-result-count">
                {{searchResult}}
              </span>
              <div :class="['media-center-view-bar', {'media-center-view-bar-left': listWidth < MIN_RESULT_BAR_WIDTH}]">
                <div class="order-select">
                  <fj-select :parent-el="selectParentEl" v-model="createdTimeVal" size="small">
                    <fj-option
                      v-for="item in CREATED_TIME_OPTIONS"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"></fj-option>
                  </fj-select>
                </div><!--
                --><div class="order-select">
                  <fj-select :parent-el="selectParentEl" v-model="orderVal" size="small">
                    <fj-option
                      v-for="item in ORDER_OPTIONS"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"></fj-option>
                  </fj-select>
                </div><!--
                --><span :class="viewTypeSelect('grid')" @click="setViewType('grid')"></span><!--
                --><span :class="viewTypeSelect('list')" @click="setViewType('list')"></span>
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
              :current-item.sync="currentVideo"
            ></grid-list-view>

            <div class="media-pagination" v-if="items.length > 1">
              <pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></pagination>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="right">
      <media-right
        :videoInfo="currentVideo"
        @showMovieEditor="setMovieEditorDisplay"
        @update-list="(data)=>{items = data;total = data.length;searchResult = ''}"
      ></media-right>
    </template>

    <!-- <im></im> -->
  </layout-three-column>
</template>
<script>
  import Vue from 'vue';
  import {
    getTimeByStr,
    formatDuration,
    getPosition,
    appendToBody,
    getStringLength,
  } from '../../common/utils';
  import './index.css';
  import {
    getTimeRange,
    getQuery,
    getSearchNotice,
    getOrder,
    formatMust,
    getHighLightFields,
    fillOptions,
    ORDER_OPTIONS,
    CREATED_TIME_OPTIONS,
    HHIGHLIGHT_FIELDS1,
    HHIGHLIGHT_FIELDS2,
    FILETR_FIELDS
  } from './config';
  import Pagination from './components/pagination';
  import bubble from '../../component/higherOrder/bubble/index'

  import threeColumn from '../../component/layout/threeColumn';
  import gridAndList from './gridAndList';
  import mediaRight from './right';

  import im from '../../component/im/index';

  const api = require('../../api/media');
  const userAPI = require('../../api/user');
  const searchConfig = require('./searchConfig');

  const MIN_LIST_WIDTH = 448;
  const MIN_RESULT_BAR_WIDTH = 612;

  export default {
    components: {
      'layout-three-column': threeColumn,
      'media-right': mediaRight,
      'grid-list-view': gridAndList,
      Pagination,
      im
    },
    data() {
      return {
        isAccurate: true,
        CREATED_TIME_OPTIONS: CREATED_TIME_OPTIONS,
        ORDER_OPTIONS: ORDER_OPTIONS,
        createdTimeVal: 'all',
        orderVal: 'order2',
        defaultRoute: '/',
        keyword: '',
        houseNo: '',
        programType: [],
        searchConfig: searchConfig,
        searchSelectConfigs: [],
        searchRadioboxConfigs: [],
        pageSize: 24,
        total: 0,
        currentPage: 1,
        currentVideo: {},
        searchResult: '',
        /* client */
        items: [],
        offsetWidth: 0,
        offsetHeight: 0,
        MIN_LIST_WIDTH: MIN_LIST_WIDTH,
        MIN_RESULT_BAR_WIDTH: MIN_RESULT_BAR_WIDTH,
        listWidth: 0,
        itemSize: { width: 198, height: 180 },
        timeId: '',

        viewType: 'list',
        fl: FILETR_FIELDS,

        datetimerange1: [],
        datetimerange2: [],
        datetimerangeCreated: [],
        displayMovieEditor: false,

        parentSize: { width: '100', height: '100' },
        listType: 'default',
        defaultList: [],
        loading: false,
        keywordOptions: [],
        selectParentEl: null
      };
    },
    created() {
      const me = this;
      this.defaultRoute = this.getActiveRoute(this.$route.path, 2);
      // this.getSeachConfigs();
      this.getDefaultMedia();
      bubble.on('mediaCenterDefaultViewType', function(v) {
        me.listType = v;
      });
      searchConfig.forEach((item) => {
        if (item.key === 'program_type') {
          me.programType = item.selected;
        }
      });
    },
    mounted() {
      this.selectParentEl = this.$refs.mediaLeft;
      // if (this.$refs.mediaCenter.offsetWidth < MIN_LIST_WIDTH) this.listWidth = MIN_LIST_WIDTH;
      this.offsetWidth = this.$refs.mediaCenter.offsetWidth;
      let tempListWidth = (this.offsetWidth / this.itemSize.width | 0) * this.itemSize.width + 26 * 2;
      this.listWidth = tempListWidth < MIN_LIST_WIDTH ? MIN_LIST_WIDTH : tempListWidth;
    },
    watch: {
      orderVal(val) {
        this.currentPage = 1;
        this.getMediaList();
      },
      createdTimeVal(val) {
        this.currentPage = 1;
        const start = new Date();
        const end = new Date();
        if (val !== 'all') {
          start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * Number(val));
        }
        this.datetimerangeCreated = [start, end];
        this.getMediaList();
      },
      programType(val) {
        searchConfig.forEach((item) => {
          if (item.key === 'program_type') {
            item.selected = val;
          }
        });
      },
      isAccurate(val) {
        this.orderVal = val ? 'order2' : 'order1';
      }
    },
    methods: {
      clearHistory() {
        userAPI.clearSearchHistory()
          .then((response) => {
            this.getSearchHistory();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getSearchHistory() {
        this.loading = true;
        api.getSearchHistory().then((res) => {
          const data = res.data;
          this.keywordOptions = res.data.map((item) => {
            item.value = item.keyword;
            item.label = item.keyword;
            return item;
          });
        }).catch((error) => {
          this.$message.error(error);
        }).then(() => {
          this.loading = false;
        });
      },
      remoteMethod() {},
      getDefaultMedia() {
        api.defaultMedia().then((res) => {
          this.defaultList = res.data;
          if (res.data.length > 0) {
            this.currentVideo = res.data[0].docs[0];
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      setMovieEditorDisplay(v) {
        this.displayMovieEditor = v;
      },
      setViewType(t) {
        this.viewType = t;
        this.fl = FILETR_FIELDS;
        if (t === 'list') {
          this.fl += ',resource_location'; // f_str_314 资源所属部门，f_str_187 houseNo
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
          me.offsetWidth = me.$refs.mediaCenter.offsetWidth;
          me.offsetHeight = document.body.clientHeight - 53;
          let tempListWidth = (me.offsetWidth / me.itemSize.width | 0) * me.itemSize.width + 26 * 2;
          me.listWidth = tempListWidth < MIN_LIST_WIDTH ? MIN_LIST_WIDTH : tempListWidth;

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
        this.currentPage = 1;
        this.createdTimeVal = 'all';
        this.datetimerangeCreated = [];
        this.resize();
      },
      setDatetimerange(type) {
        // const start = new Date();
        // const end = new Date();
        // if (type === 'lastMonth') {
        //   start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 30);
        // } else if (type === 'lastWeek') {
        //   start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * 7);
        // }
        // this.datetimerangeCreated = [start, end];
        // this.getMediaList();
      },
      getMediaList() {
        this.listType = 'normal';
        const me = this;
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        const options = {
          source: this.fl,
          match: [],
          should: [],
          range: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: start,
          pageSize: this.pageSize,
          isAccurate: this.isAccurate
        };
        fillOptions(this.programType, options, this.searchConfig);
        // 把时间限定参数加进去
        if (this.datetimerangeCreated.length) {
          const created = getTimeRange(this.datetimerangeCreated, 'created');
          options.range.push(created);
        }
        // 检索词提示
        let searchNotice = `检索词: ${this.keyword}`;
        const searchChoose = getSearchNotice(this.searchConfig).join(',');
        if (this.keyword && searchChoose) {
          searchNotice += `,${searchChoose}`;
        } else {
          searchNotice += searchChoose;
        }
        const noticeLength = getStringLength(searchNotice);
        if (noticeLength > 15) {
          searchNotice = searchNotice.substr(0, 15);
          searchNotice += '...';
        } else {
          searchNotice += '   ';
        }
        this.searchResult = searchNotice;

        const obj = {
          house_num: me.houseNo,
          full_text: this.keyword
        };

        formatMust(options.match, obj);

        options.sort = getOrder(this.orderVal);

        if (this.keyword) {
          if (options.sort.length) {
            // 关键字与节目类型相同不高亮
            for (let k = 0, len = this.programType.length; k < len; k++) {
              if (this.programType[k] === this.keyword) {
                options.hl = HHIGHLIGHT_FIELDS2;
              }
            }
          } else {
            const item = {
              match: {}
            };
            formatMust(options.should, { full_name: this.keyword });
          }
        } else {
          // 默认排序为关联度排序
          if (!options.sort.length) {
            options.sort = [{
              key: 'full_time',
              value: 'desc'
            }];
          }
        }

        api.esSearch(options, me).then((res) => {
          me.items = res.data.docs;
          if (res.data.docs.length > 0) {
            if (me.listType === 'default' || (me.listType === "normal" && me.currentPage === 1)) {
              me.currentVideo = res.data.docs[0];
            }
          } else {
            me.currentVideo = {};
          }
          me.total = res.data.numFound;
          me.searchResult = `${searchNotice}耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      handleCurrentPageChange(page) {
        this.getMediaList();
      },
      getType(item) {
        if (item.show === true || (item.show && item.show(this.programType))) {
          return item.type;
        }
        return '';
      },
    }
  };
</script>
