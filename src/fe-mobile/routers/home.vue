<template>
  <div :class="['root', {'cannotScroll': isShowSearchCondition}]" id="root">
    <fj-header
      title="凤凰卫视全媒体平台"
      v-model="tempKeyword"
      :default-content-type="headerContentType"
      :showClearBtn="!!(isShowSearchCondition && tempKeyword)"
      @on-content-type-change="changeContentType"
      @input-focus="handleFocus"
      @search="handleSearch"></fj-header>
    <div class="search-btn-group" v-show="isShowSearchCondition">
      <span class="search-btn-cancel" @touchstart="" @click="handleReset">重置</span>
      <span class="search-btn-submit" @touchstart="" @click="handleSearch">搜索</span>
    </div>
    <div :class="[{'search-condition-box': isShowSearchCondition}]" v-show="isShowSearchCondition">
      <ul class="search-history" v-if="tempKeyword.length === 0">
        <li v-for="item in keywordOptions.slice(0, keywordOptionsLen)" class="search-history-item">
          <i class="icon-clock iconfont"></i>
          <span class="search-history-label" @click="tempKeyword = item.label">{{ item.label }}</span>
          <i class="icon-close iconfont" @click.stop="removeSearchHistory(item.value)"></i>
        </li>
        <li
          v-if="keywordOptions.length === 0"
          class="search-history-button">
          暂无搜索记录
        </li>
        <li
          v-else-if="keywordOptionsLen < keywordOptions.length"
          class="search-history-button"
          @click="keywordOptionsLen = keywordOptions.length">
          全部搜索记录
        </li>
        <li
          v-else
          class="search-history-button"
          @click="clearHistory">
          清除搜索记录
        </li>
      </ul>
      <div :class="['media-category', { 'collapse': collapseOrder }]">
        <h4 class="media-category-label">
          排序
          <i class="iconfont icon-arrow-down" @click="collapseOrder = !collapseOrder"></i>
        </h4>
        <ul class="clearfix media-category-list">
          <li v-for="item in ORDER_OPTIONS" class="media-category-option-l">
            <span
              :class="[
                'media-category-option-content radio',
                {'selected': tempOrderVal === item.value}]"
              @click="tempOrderVal = item.value">{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div v-for="config in searchSelectConfigs" :class="['media-category', { 'collapse': config.collapse }]">
        <h4 class="media-category-label clearfix">
          {{config.label}}
          <i class="iconfont icon-arrow-down" @click="config.collapse = !config.collapse"></i>
        </h4>
        <ul class="clearfix media-category-list">
          <li v-for="item in config.items" class="media-category-option">
            <span
              :class="[
                'media-category-option-content',
                {'selected': config.tempSelected.indexOf(item.value)>-1}]"
              @click="setMultipleValue(config.tempSelected, item.value)">{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div v-for="config in searchRadioboxConfigs" :class="['media-category', { 'collapse': config.collapse }]">
        <h4 class="media-category-label">
          {{config.label}}
          <i class="iconfont icon-arrow-down" @click="config.collapse = !config.collapse"></i>
        </h4>
        <ul class="clearfix media-category-list">
          <li v-for="item in config.items" class="media-category-option">
            <span
              :class="[
                'media-category-option-content radio',
                {'selected': config.tempSelected === item.value}]"
              @click="config.tempSelected = item.value">{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div class="media-category">
        <h4 class="media-category-label">
          新聞日期
        </h4>
        <ul class="clearfix media-category-list">
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !datetimerange1.start }]" @click="showPicker(datetimerange1, 'start')">{{ formatTime(datetimerange1.start) || '开始时间' }}</div>
          </li>
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !datetimerange1.end }]" @click="showPicker(datetimerange1, 'end')">{{ formatTime(datetimerange1.end) || '结束时间' }}</div>
          </li>
        </ul>
      </div>
      <div class="media-category">
        <h4 class="media-category-label">
          首播日期
        </h4>
        <ul class="clearfix media-category-list">
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !datetimerange2.start }]" @click="showPicker(datetimerange2, 'start')">{{ formatTime(datetimerange2.start) || '开始时间' }}</div>
          </li>
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !datetimerange2.end }]" @click="showPicker(datetimerange2, 'end')">{{ formatTime(datetimerange2.end) || '结束时间' }}</div>
          </li>
        </ul>
      </div>
    </div>
    <fj-datetime-picker
      :visible.sync="pickerVisible"
      :startDate="pickerStartDate"
      :endDate="pickerEndDate"
      :value="pickerDate"
      @confirm="setDate"></fj-datetime-picker>
    <router-view></router-view>
    <fj-tabbar v-model="tabIndex" v-show="!hideTabbar">
      <fj-tab-item v-for="item in MENU" :id="item.route" :key="item.route">
        <i slot="icon" :class="['iconfont', item.icon]"></i>
        {{ item.text }}
      </fj-tab-item>
    </fj-tabbar>
  </div>
</template>
<script>
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
  } from '../../fe/routers/mediaCenter/config';
  import {
    isEmptyObject,
    formatTime
  } from '../../fe/common/utils';
  import './home.css';
  const mediaAPI = require('../../fe/api/media');
  const userAPI = require('../../fe/api/user');

  const MENU = [
    { text: '首页', route: 'trends', icon: 'icon-home' },
    { text: '媒体库', route: 'mediaCenter', icon: 'icon-media-library' },
    { text: '任务', route: 'taskCenter', icon: 'icon-menu' },
    { text: '个人中心', route: 'personalCenter', icon: 'icon-person' },
  ];
  const START_DATE = new Date(2000, 0, 1);
  const END_DATE = new Date(new Date().getFullYear() + 10, 11, 31);
  export default {
    created() {
      this.MENU = MENU;
      this.tabIndex = this.getActiveRoute(this.$route.path, 1);
      this.getSeachConfigs();

      if (this.$route.meta.hideTabbar) {
        this.hideTabbar = true;
      } else {
        this.hideTabbar = false;
      }
    },
    data() {
      return {
        ORDER_OPTIONS: ORDER_OPTIONS,
        keyword: '',
        tempKeyword: '',
        tabIndex: 'mediaCenter',
        isShowSearchCondition: false,
        searchSelectConfigs: [],
        searchRadioboxConfigs: [],
        keywordOptions: [],
        pageSize: 24,
        keywordOptionsLen: 2,
        orderVal: 'order1',
        tempOrderVal: 'order1',
        collapseOrder: false,
        searchOptions: {},
        headerContentType: 'default',
        pickerVisible: false,
        pickerDate: null,
        pickerBindValue: { obj: null, key: '' },
        datetimerange1: { start: null, end: null },
        datetimerange2: { start: null, end: null },
        pickerStartDate: START_DATE,
        pickerEndDate: END_DATE,
        hideTabbar: false
      };
    },
    watch: {
      tabIndex(val) {
        if (val !== this.$route.name) {
          this.$router.push({ name: val });
        }
        if (val !== 'mediaCenter') {
          this.headerContentType = 'default';
          this.handleReset();
        }
      },
      '$route' (to, from) {
        if (to.meta.hideTabbar) {
          this.hideTabbar = true;
        } else {
          this.hideTabbar = false;
        }
        this.tabIndex = this.getActiveRoute(this.$route.path, 1);
      }
    },
    methods: {
      formatTime,
      showPicker(dateObj, key) {
        if (key === 'start') {
          this.pickerStartDate = new Date(2000, 0, 1);
          this.pickerEndDate = dateObj.end ? new Date(dateObj.end) : END_DATE;
        } else {
          this.pickerStartDate = dateObj.start ? new Date(dateObj.start) : START_DATE;
          this.pickerEndDate = new Date(new Date().getFullYear() + 10, 11, 31);
        }
        this.pickerDate = dateObj[key] ? new Date(dateObj[key]) : null;
        this.pickerBindValue.obj = dateObj;
        this.pickerBindValue.key = key;
        this.pickerVisible = true;
      },
      setDate(date) {
        this.pickerBindValue.obj[this.pickerBindValue.key] = new Date(date);
      },
      setMultipleValue(target, value) {
        const index = target.indexOf(value);
        if (index > -1) {
          target.splice(index, 1);
        } else {
          target.push(value);
        }
      },
      getActiveRoute(path, level) {
        const pathArr = path.split('/');
        return pathArr[level] || '';
      },
      handleFocus() {
        this.isShowSearchCondition = true;
      },
      changeContentType(type) {
        if (type === 'searchInput') {
          this.isShowSearchCondition = true;
          this.getSearchHistory();
        } else {
          this.isShowSearchCondition = false;
          this.handleReset();
          this.searchOptions = {};
          this.$router.go(-1);
          // if (!isEmptyObject(this.searchOptions)) {
          //   this.$router.push({ name: 'mediaCenter' });
          //   this.searchOptions = {};
          //   this.tempKeyword = '';
          //   this.keyword = '';
          // }
        }
        this.headerContentType = type;
      },
      getSeachConfigs() {
        mediaAPI.getSearchConfig().then((res) => {
          const tempSelectConfigs = [];
          res.data.searchSelectConfigs.forEach(function(item) {
            if (item.key !== 'occur_country') {
              item.collapse = false;
              item.tempSelected = item.selected.slice();
              item.items.sort(function(a, b) {
                return a.label.length - b.label.length;
              });
              tempSelectConfigs.push(item);
            }
          });
          this.searchSelectConfigs = tempSelectConfigs;
          this.searchRadioboxConfigs = res.data.searchRadioboxConfigs.map(function(item) {
            item.collapse = false;
            item.tempSelected = item.selected;
            return item;
          });
          this.initSearchQuery();
        }).catch((error) => {
        });
      },
      initSearchQuery() {
        if (this.$route.name === 'mediaCenter') {
          // const keyword = this.$route.query.keyword;
          // if (keyword) {
          //   this.tempKeyword = keyword;
          //   this.headerContentType = 'searchInput';
          //   this.handleSearch();
          //   this.getSearchHistory();
          // }
          let search_query = this.$route.query.search_query;
          if (search_query) {
            this.headerContentType = 'searchInput';
            search_query = JSON.parse(search_query);
            this.tempKeyword = search_query.keyword;
            this.tempOrderVal = search_query.orderVal;
            this.datetimerange1 = { start: search_query.datetimerange1[0], end: search_query.datetimerange1[1] };
            this.datetimerange2 = { start: search_query.datetimerange2[0], end: search_query.datetimerange2[1] };
            const selectValue = search_query.selectValue;
            const radioValue = search_query.radioValue;
            this.searchSelectConfigs.forEach(function(item) {
              item.tempSelected = selectValue[item.key] || [];
            });
            this.searchRadioboxConfigs.forEach(function(item) {
              item.tempSelected = radioValue[item.key] || '';
            });
            this.handleSearch();
            this.getSearchHistory();
          }
        }
      },
      getSearchHistory() {
        mediaAPI.getSearchHistory().then((res) => {
          const data = res.data;
          this.keywordOptions = res.data.map((item) => {
            item.value = item._id;
            item.label = item.keyword;
            return item;
          });
        }).catch((error) => {
        });
      },
      clearHistory() {
        userAPI.clearSearchHistory()
          .then((response) => {
            this.getSearchHistory();
          })
          .catch((error) => {
          });
      },
      removeSearchHistory(id) {
        const ids = [id];
        userAPI.removeSearchHistory({ ids: ids.join(',') })
          .then((response) => {
            this.getSearchHistory();
          })
          .catch((error) => {
          });
      },
      handleReset() {
        // this.tempKeyword = this.keyword;
        // this.tempOrderVal = this.orderVal;
        // this.searchSelectConfigs.forEach(function(item) {
        //   item.tempSelected = item.selected.slice();
        // });
        // this.searchRadioboxConfigs.forEach(function(item) {
        //   item.tempSelected = item.selected;
        // });
        this.tempKeyword = '';
        this.tempOrderVal = 'order1';
        this.searchSelectConfigs.forEach(function(item) {
          item.tempSelected = [];
        });
        this.searchRadioboxConfigs.forEach(function(item) {
          item.tempSelected = '';
        });
        this.datetimerange1 = { start: null, end: null };
        this.datetimerange2 = { start: null, end: null };
      },
      handleSearch() {
        this.isShowSearchCondition = false;
        this.keyword = this.tempKeyword;
        this.orderVal = this.tempOrderVal;

        const selectValue = {};
        const radioValue = {};
        this.searchSelectConfigs.forEach(function(item) {
          selectValue[item.key] = item.tempSelected.slice();
          item.selected = item.tempSelected.slice();
        });
        this.searchRadioboxConfigs.forEach(function(item) {
          radioValue[item.key] = item.tempSelected;
          item.selected = item.tempSelected;
        });

        const search_query = {
          keyword: this.keyword,
          orderVal: this.orderVal,
          selectValue: selectValue,
          radioValue: radioValue,
          datetimerange1: [this.datetimerange1.start, this.datetimerange2.end],
          datetimerange2: [this.datetimerange2.start, this.datetimerange2.end]
        };
        const options = {
          source: FILETR_FIELDS,
          match: [],
          should: [],
          range: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: 0,
          pageSize: this.pageSize
        };
        const must = options.match;
        const f_date_162 = getTimeRange([
          this.datetimerange1.start,
          this.datetimerange1.end
        ], 'f_date_162'); // 新聞日期
        const f_date_36 = getTimeRange([
          this.datetimerange2.start,
          this.datetimerange2.end
        ], 'f_date_36'); // 首播日期
        options.range.push(f_date_162);
        options.range.push(f_date_36);
        getQuery(must, this.searchSelectConfigs.concat(this.searchRadioboxConfigs));
        // let searchNotice = `检索词: ${this.keyword}`;
        // const searchChoose = getSearchNotice(this.searchSelectConfigs.concat(this.searchRadioboxConfigs)).join(',');
        // if (this.keyword && searchChoose) {
        //   searchNotice += `,${searchChoose}`;
        // } else {
        //   searchNotice += searchChoose;
        // }
        // const noticeLength = getStringLength(searchNotice);
        // if (noticeLength > 15) {
        //   searchNotice = searchNotice.substr(0, 15);
        //   searchNotice += '...';
        // } else {
        //   searchNotice += '   ';
        // }
        // this.searchResult = searchNotice;

        const obj = {
          // f_str_187: me.houseNo,
          publish_status: 1,
          full_text: this.keyword
        };

        formatMust(must, obj);

        // 跟should和sort有关
        options.sort = getOrder(this.orderVal);
        if (this.keyword) {
          if (options.sort.length) {
            for (let k = 0, len = this.searchSelectConfigs[0].items.length; k < len; k++) {
              if (this.searchSelectConfigs[0].items[k].value === this.keyword) {
                options.hl = HHIGHLIGHT_FIELDS2;
              }
            }
          } else {
            formatMust(options.should, { name: this.keyword });
          }
        } else {
          if (!options.sort.length) {
            options.sort = [{
              key: 'publish_time',
              value: 'desc'
            }];
          }
        }
        this.searchOptions = options;

        this.linkToMediaSearch(search_query);

        // mediaAPI.esSearch(options).then((res) => {
        //   // me.items = res.data.docs;
        //   // me.total = res.data.numFound;
        //   // me.searchResult = `${searchNotice}耗时${res.data.QTime / 1000}秒,结果${me.total}条`;
        // }).catch((error) => {
        //   // me.$message.error(error);
        // });
      },
      linkToMediaSearch(options) {
        this.$router.push({ name: 'mediaCenter', params: { program_type: 'searchResult' }, query: { search_query: JSON.stringify(options) } });
      },
    }
  };
</script>
