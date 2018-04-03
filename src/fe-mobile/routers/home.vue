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
      <div :class="['media-category', { 'collapse': collapseSearchType }]">
        <h4 class="media-category-label">
          搜索方式
          <i class="iconfont icon-arrow-up" @click="collapseSearchType = !collapseSearchType"></i>
        </h4>
        <ul class="clearfix media-category-list">
          <li class="media-category-option-l">
            <span
              :class="[
                'media-category-option-content radio',
                {'selected': isAccurate}]"
              @click="isAccurate = true">精确搜索</span>
          </li>
          <li class="media-category-option-l">
            <span
              :class="[
                'media-category-option-content radio',
                {'selected': !isAccurate}]"
              @click="isAccurate = false">模糊搜索</span>
          </li>
        </ul>
      </div>
      <div :class="['media-category', { 'collapse': collapseTime }]">
        <h4 class="media-category-label">
          时间
          <i class="iconfont icon-arrow-up" @click="collapseTime = !collapseTime"></i>
        </h4>
        <ul class="clearfix media-category-list">
          <li v-for="item in CREATED_TIME_OPTIONS" class="media-category-option-l">
            <span
              :class="[
                'media-category-option-content radio',
                {'selected': tempCreatedTimeVal === item.value}]"
              @click="tempCreatedTimeVal = item.value">{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div :class="['media-category', { 'collapse': collapseOrder }]">
        <h4 class="media-category-label">
          排序
          <i class="iconfont icon-arrow-up" @click="collapseOrder = !collapseOrder"></i>
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
      <div v-for="config in searchSelectConfigs" :class="['media-category', { 'collapse': config.collapse }]" v-show="getDisplayItem(config)">
        <h4 class="media-category-label clearfix">
          {{config.label}}
          <i class="iconfont icon-arrow-up" @click="config.collapse = !config.collapse"></i>
        </h4>
        <ul v-if="config.displayItems" class="clearfix media-category-list">
          <li v-for="row in config.displayItems" class="media-category-option-row">
            <span
              v-for="item in row"
              :class="[
                'media-category-option-row-content',
                {'selected': config.tempSelected.indexOf(item.value)>-1}
              ]"
              @click="setMultipleValue(config.tempSelected, item.value, config.key)">{{ item.label }}</span>
          </li>
        </ul>
        <ul v-else class="clearfix media-category-list">
          <li v-for="item in config.items" class="media-category-option">
            <span
              :class="[
                'media-category-option-content',
                {'selected': config.tempSelected.indexOf(item.value)>-1}]"
              @click="setMultipleValue(config.tempSelected, item.value, config.key)">{{ item.label }}</span>
          </li>
        </ul>
      </div>
      <div v-for="config in searchRadioboxConfigs" :class="['media-category', { 'collapse': config.collapse }]" v-show="getDisplayItem(config)">
        <h4 class="media-category-label">
          {{config.label}}
          <i class="iconfont icon-arrow-up" @click="config.collapse = !config.collapse"></i>
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
          日期范围
        </h4>
        <ul class="clearfix media-category-list">
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !full_time.start }]" @click="showPicker(full_time, 'start')">{{ formatTime(full_time.start) || '开始时间' }}</div>
          </li>
          <li class="media-category-option-l">
            <div :class="['datetime-input', { 'placeholder': !full_time.end }]" @click="showPicker(full_time, 'end')">{{ formatTime(full_time.end) || '结束时间' }}</div>
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
    fillOptions,
    ORDER_OPTIONS,
    CREATED_TIME_OPTIONS,
    HHIGHLIGHT_FIELDS1,
    HHIGHLIGHT_FIELDS2,
    FILETR_FIELDS
  } from '../../fe/routers/mediaCenter/config';
  import {
    isEmptyObject,
    formatTime
  } from '../../fe/common/utils';
  import searchConfig from './searchConfig';
  import './home.css';

  const mediaAPI = require('../../fe/api/media');
  const userAPI = require('../../fe/api/user');

  const MENU = [
    // { text: '首页', route: 'trends', icon: 'icon-home' },
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
      searchConfig.forEach((item) => {
        if (item.key === 'program_type') {
          this.programType = item.selected;
        }
      });
    },
    data() {
      return {
        CREATED_TIME_OPTIONS: CREATED_TIME_OPTIONS,
        ORDER_OPTIONS: ORDER_OPTIONS,
        programType: [],
        keyword: '',
        tempKeyword: '',
        tabIndex: 'mediaCenter',
        isShowSearchCondition: false,
        searchSelectConfigs: [],
        searchRadioboxConfigs: [],
        keywordOptions: [],
        pageSize: 24,
        keywordOptionsLen: 2,
        orderVal: 'order2',
        tempOrderVal: 'order2',
        tempCreatedTimeVal: 'all',
        datetimerangeCreated: [],
        isAccurate: true,
        collapseSearchType: false,
        collapseOrder: false,
        collapseTime: false,
        searchOptions: {},
        headerContentType: 'default',
        pickerVisible: false,
        pickerDate: null,
        pickerBindValue: { obj: null, key: '' },
        full_time: { start: null, end: null },
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
        if (val !== 'mediaCenter' && val !== 'watch') {
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
      },
      tempCreatedTimeVal(val) {
        const start = new Date();
        const end = new Date();
        if (val !== 'all') {
          start.setTime(start.getTime() - 1000 * 60 * 60 * 24 * Number(val));
        }
        this.datetimerangeCreated = [start, end];
      }
    },
    methods: {
      formatTime,
      getDisplayItem(item) {
        return item.show(this.programType);
      },
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
      setMultipleValue(target, value, key) {
        if (key === 'program_type') {
          const index = this.programType.indexOf(value);
          if (index > -1) {
            this.programType.splice(index, 1);
          } else {
            this.programType.push(value);
          }
        }
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
          if (!this.isShowSearchCondition) {
            this.$router.push({ name: 'mediaCenter' });
          }
          this.isShowSearchCondition = false;
          this.handleReset();
          this.searchOptions = {};
        }
        this.headerContentType = type;
      },
      getSeachConfigs() {
        const tempSelectConfigs = [];
        const tempRadioboxConfigs = [];
        searchConfig.forEach((item, index) => {
          if (item.type === 'select') {
            if (item.key !== 'occur_country') {
              item.collapse = index < 3 ? false : true;
              item.tempSelected = item.selected.slice();
              item.items.sort(function(a, b) {
                return a.label.length - b.label.length;
              });
              tempSelectConfigs.push(item);
            } else {
              item.collapse = true;
              item.tempSelected = item.selected.slice();
              const displayItems = [];
              let tempDisplayItem = [];
              for (let i = 0; i < item.items.length; i++) {
                const subItem = item.items[i];
                if (tempDisplayItem.length < 3) {
                  tempDisplayItem.push(subItem);
                } else {
                  displayItems.push(tempDisplayItem.slice());
                  tempDisplayItem = [subItem];
                }
              }
              item.displayItems = displayItems;
              tempSelectConfigs.push(item);
            }
          } else if (item.type === 'radio') {
            item.collapse = true;
            item.tempSelected = item.selected;
            tempRadioboxConfigs.push(item);
          }
        });
        this.searchSelectConfigs = tempSelectConfigs;
        this.searchRadioboxConfigs = tempRadioboxConfigs;
        this.initSearchQuery();
      },
      initSearchQuery() {
        if (this.$route.name === 'mediaCenter') {
          let search_query = this.$route.query.search_query;
          if (search_query) {
            this.headerContentType = 'searchInput';
            search_query = JSON.parse(search_query);
            this.tempKeyword = search_query.keyword;
            this.tempOrderVal = search_query.orderVal;

            this.full_time = { start: search_query.full_time[0], end: search_query.full_time[1] };
            const selectValue = search_query.selectValue;
            const radioValue = search_query.radioValue;
            this.searchSelectConfigs.forEach(function(item) {
              item.tempSelected = selectValue[item.key] || [];
            });
            this.searchRadioboxConfigs.forEach(function(item) {
              item.tempSelected = radioValue[item.key] || '';
            });
            this.programType = selectValue.programType || [];
            this.tempCreatedTimeVal = search_query.createdTimeVal;
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
        this.tempKeyword = '';
        this.tempOrderVal = 'order2';
        this.tempCreatedTimeVal = 'all';
        this.isAccurate = true;
        this.searchSelectConfigs.forEach(function(item) {
          item.tempSelected = [];
        });
        this.searchRadioboxConfigs.forEach(function(item) {
          item.tempSelected = '';
        });
        this.programType = [];
        this.full_time = { start: null, end: null };
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
          createdTimeVal: this.tempCreatedTimeVal,
          selectValue: selectValue,
          radioValue: radioValue,
          full_time: [this.full_time.start, this.full_time.end]
        };
        const options = {
          source: FILETR_FIELDS,
          match: [],
          should: [],
          range: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: 0,
          pageSize: this.pageSize,
          isAccurate: this.isAccurate
        };
        fillOptions(this.programType, options, this.searchSelectConfigs);
        fillOptions(this.programType, options, this.searchRadioboxConfigs);
        options.range.push(getTimeRange([this.full_time.start, this.full_time.end], 'full_time'));

        if (this.tempCreatedTimeVal !== 'all') {
          const created = getTimeRange(this.datetimerangeCreated, 'created');
          options.range.push(created);
        }
        formatMust(options.match, { full_text: this.keyword });

        // 跟should和sort有关
        options.sort = getOrder(this.orderVal);

        if (this.keyword) {
          if (options.sort.length) {
            for (let k = 0, len = this.programType.length; k < len; k++) {
              if (this.programType[k] === this.keyword) {
                options.hl = HHIGHLIGHT_FIELDS2;
              }
            }
          } else {
            formatMust(options.should, { full_name: this.keyword });
          }
        } else {
          if (!options.sort.length) {
            options.sort = [{
              key: 'full_time',
              value: 'desc'
            }];
          }
        }
        this.searchOptions = options;
        this.linkToMediaSearch(search_query);
      },
      linkToMediaSearch(options) {
        this.$router.push({ name: 'mediaCenter', params: { program_type: 'searchResult' }, query: { search_query: JSON.stringify(options) } });
      },
    }
  };
</script>
