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
          </div>
          <div class="media-category">
            <h4>HOUSENO</h4>
            <fj-input
              placeholder="请输入HOUSENO"
              size="small"
              theme="fill"
              v-model="houseNo"
              icon="icon-search input-search-icon"
              @on-icon-click="searchHouseNoClick"
              @keydown.native.enter.prevent="searchHouseNoClick"
            ></fj-input>
          </div>
          <template v-for="config in searchSelectConfigs">
            <div class="media-category">
              <h4>{{config.label}}</h4>
              <fj-select :parent-el="selectParentEl" placeholder="请选择" v-model="config.selected" size="small" theme="fill" :controlLength="10" clearable multiple>
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
                :parent-el="(()=>{return this.$refs.mediaLeft})()"
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
                :parent-el="(()=>{return this.$refs.mediaLeft})()"
                type="datetimerange"
                placeholder="请选择日期范围"
                v-model="datetimerange2"
              ></fj-date-picker>
            </div>
          </div>
        </div>
      </div>
    </template>
    <template slot="center">
      <div class="media-center-wrap" ref="mediaCenter">
        <div class="media-center" :style="{ width: !listWidth ? '100%' : (listWidth - 6) + 'px', height: items.length === 0 ? '100%' : 'auto' }">
          <div v-if="listType === 'default'">
            <div :style="{ padding: '0 26px'}"
              v-for="categoryItem in defaultList">
              <h3 class="category-title">{{ categoryItem.category }}</h3>
              <grid-list-view
                class="media-center-category-list"
                type="grid"
                :width="listWidth"
                :items="categoryItem.docs"
                @currentItemChange="currentItemChange"
              ></grid-list-view>
            </div>
          </div>
          <template v-else>
            <div class="media-center-result-bar">
              <span class="media-center-result-count">
                {{searchResult}}
              </span>
              <div class="media-center-view-bar">
                <span :class="viewTypeSelect('grid')" @click="setViewType('grid')"></span><!--
                --><span :class="viewTypeSelect('list')" @click="setViewType('list')"></span><!--
                --><div class="order-select">
                  <fj-select :parent-el="selectParentEl" v-model="orderVal" size="small">
                    <fj-option
                      v-for="item in ORDER_OPTIONS"
                      :key="item.value"
                      :value="item.value"
                      :label="item.label"></fj-option>
                  </fj-select>
                </div>
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

            <div class="media-pagination" v-if="items.length > 1">
              <pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="handleCurrentPageChange"></pagination>
            </div>
          </template>
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

    <!--<im></im>-->
  </layout-three-column>
</template>
<script>
  import Vue from 'vue';
  import {
    getTimeByStr,
    formatDuration,
    getPosition,
    appendToBody,
    getStringLength
  } from '../../common/utils';
  import './index.css';
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
  } from './config';
  import Pagination from './components/pagination';
  import bubble from '../../component/higherOrder/bubble/index'

  import threeColumn from '../../component/layout/threeColumn';
  import gridAndList from './gridAndList';
  import mediaRight from './right';

 import im from '../../component/im/index';

  const api = require('../../api/media');
  const userAPI = require('../../api/user');

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
        ORDER_OPTIONS: ORDER_OPTIONS,
        orderVal: 'order1',
        defaultRoute: '/',
        keyword: '',
        houseNo: '',
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
        listWidth: 0,
        itemSize: { width: 198, height: 180 },
        timeId: '',

        viewType: 'list',
        fl: FILETR_FIELDS,

        datetimerange1: [],
        datetimerange2: [],
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
      this.getSeachConfigs();
      this.getDefaultMedia();
      bubble.on('mediaCenterDefaultViewType', function(v) {
        me.listType = v;
      });
    },
    mounted() {
      this.selectParentEl = this.$refs.mediaLeft;
    },
    watch: {
      orderVal(val) {
        this.currentPage = 1;
        this.getMediaList();
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
          this.loading = false;
          const data = res.data;
          this.keywordOptions = res.data.map((item) => {
            item.value = item.keyword;
            item.label = item.keyword;
            return item;
          });
        }).catch((error) => {
          this.loading = false;
          this.$message.error(error);
        });
      },
      remoteMethod() {},
      getDefaultMedia() {
        api.defaultMedia().then((res) => {
          this.defaultList = res.data;
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
        this.currentPage = 1;
        this.resize();
      },
      getSeachConfigs() {
        const me = this;
        api.getSearchConfig().then((res) => {
          const searchSelectConfigs = res.data.searchSelectConfigs;
          for(let i = 0; i < searchSelectConfigs.length; i++){
            searchSelectConfigs[i].selected = [];
          }
          me.searchSelectConfigs = searchSelectConfigs;
          me.searchRadioboxConfigs = res.data.searchRadioboxConfigs;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      getMediaList() {
        this.listType = 'normal';
        const me = this;
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        const f_date_162 = getTimeRange(this.datetimerange1, 'news_data'); // 新聞日期
        const f_date_36 = getTimeRange(this.datetimerange2, 'airdata'); // 首播日期
        console.log(this.fl);
        const options = {
          source: this.fl,
          match: [],
          should: [],
          range: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: start,
          pageSize: this.pageSize
        };
        const must = options.match;
        options.range.push(f_date_162);
        options.range.push(f_date_36);
        getQuery(must, this.searchSelectConfigs.concat(this.searchRadioboxConfigs));
        let searchNotice = `检索词: ${this.keyword}`;
        const searchChoose = getSearchNotice(this.searchSelectConfigs.concat(this.searchRadioboxConfigs)).join(',');
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
          publish_status: 1,
          full_text: this.keyword
        };

        formatMust(must, obj);

        options.sort = getOrder(this.orderVal);

        if (this.keyword) {
          if (options.sort.length) {
            for (let k = 0, len = this.searchSelectConfigs[0].items.length; k < len; k++) {
              if (this.searchSelectConfigs[0].items[k].value === this.keyword) {
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
          if (!options.sort.length) {
            options.sort = [{
              key: 'publish_time',
              value: 'desc'
            }];
          }
        }

        api.esSearch(options, me).then((res) => {
          me.items = res.data.docs;
          me.total = res.data.numFound;
          me.searchResult = `${searchNotice}耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      searchHouseNoClick() {
        this.currentPage = 1;
        const me = this;
        this.listType = 'normal';
        if (!me.houseNo) {
          return;
        }
        let searchNotice = `检索词: ${me.houseNo}`;
        const noticeLength = getStringLength(searchNotice);
        if (noticeLength > 15) {
          searchNotice = searchNotice.substr(0, 15);
          searchNotice += '...';
        } else {
          searchNotice += '   ';
        }
        const start = this.currentPage ? (this.currentPage - 1) * this.pageSize : 0;
        const options = {
          source: this.fl,
          match: [],
          should: [],
          sort: {},
          start: start,
          pageSize: this.pageSize
        };
        const obj = {
          house_num: me.houseNo,
          publish_status: 1,
        };
        formatMust(options.match, obj);
        api.esSearch(options, me).then((res) => {
          me.items = res.data.docs;
          me.total = res.data.numFound;
          me.searchResult = `${searchNotice}耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
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
