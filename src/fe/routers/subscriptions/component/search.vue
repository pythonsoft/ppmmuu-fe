<template>
  <div class="search-wrap" ref="searchWrap">
    <div class="search-sub-menu clearfix">
      <span class="result-count">大约{{ total }}条结果</span>
      <div class="button-group clearfix">
        <span
          class="iconfont icon-filter media-center-view-list media-center-view-selected"
          ref="filterBtn"
          @click.stop="handleFilterBtnClick"
          v-clickoutside="handleCloseMenu"></span><!--
        --><span :class="viewTypeSelect('grid')" @click="setViewType('grid')"></span><!--
        --><span :class="viewTypeSelect('list')" @click="setViewType('list')"></span>
      </div>
    </div>
    <grid-list-view
      :type="viewType"
      :width="listWidth"
      :items="items"
      @currentItemChange="()=>{}"
      :downloadFn="showDownloadList"
      :link-to-watch-fn="linkToWatch"
      :parentEl="parentEl"
    ></grid-list-view>
    <div class="media-pagination" v-if="items.length">
      <pagination :page-size="pageSize" :total="total" :current-page.sync="currentPage" @current-change="currentPageChange"></pagination>
    </div>
    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
  </div>
</template>
<script>
  import Vue from 'vue';
  import GridListView from './gridAndList';
  import Pagination from '../../mediaCenter/components/pagination';
  import DropdownMenu from './searchFilterMenu';
  import DownloadListView from '../../management/template/download/component/downloadDialog';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import {
    isEmptyObject,
    formatQuery
  } from '../../../common/utils';
  import { getPosition } from '../../../component/fjUI/utils/position';

  const subscribeAPI = require('../../../api/subscribe');
  const jobAPI = require('../../../api/job');

  export default {
    props: {
      query: {}
    },
    data() {
      return {
        pageSize: 20,
        currentPage: 1,
        total: 0,
        items: [],
        menus: [],
        viewType: 'list',
        parentEl: null,
        listWidth: 1080,
        fileInfo: {},
        templateInfo: {},
        downloadDialogDisplay: false,
        filterList: {}
      };
    },
    watch: {
      query(val) {
        if (val.viewType && this.viewType !== val.viewType) {
          this.viewType = val.viewType;
        } else {
          const keys = Object.keys(this.filterList);
          for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            this.filterList[key] = val[key] || '';
          }
          this.updateList();
        }
      },
      listWidth(val) {
        if (this.dropdownMenu) {
          this.dropdownMenu.menuStyle.width = `${val}px`;
        }
      },
      filterList(val) {
        // if (this.dropdownMenu) {
        //   this.dropdownMenu.filterList = val;
        // }
      }
    },
    created() {
      this.getSubscribeSearchConfig();
      if (this.query.page) this.currentPage = Number(this.query.page);
      if (this.query.viewType) this.viewType = this.query.viewType;
      this.updateList();
    },
    mounted() {
      this.resetListWidth();
      window.addEventListener('resize', this.resetListWidth);
      this.parentEl = this.$refs.searchWrap;
    },
    beforDestroy() {
      if (this.dropdownMenu) {
        this.unmountDropdownMenu();
      }
      window.removeEventListener('resize', this.resetListWidth);
    },
    methods: {
      handleFilterBtnClick() {
        if (this.dropdownMenu) return;
        this.mountDropdownMenu();
      },
      mountDropdownMenu() {
        console.log('mountDropdownMenu', this.filterList);
        this.dropdownMenu = new Vue(DropdownMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updateMenuPosition);
        this.updateMenuPosition();
        this.dropdownMenu.menus = this.menus;
        this.dropdownMenu.selfFilterList = Object.assign({}, this.filterList);
        this.dropdownMenu.defaultDatetimerange = { FIELD162: this.filterList.FIELD162 || '', FIELD36: this.filterList.FIELD36 || '' };
        this.dropdownMenu.$on('update-filter-list', this.updateFilterList);
        this.dropdownMenu.$on('unmount', this.unmountDropdownMenu);
      },
      updateFilterList(filterList) {
        console.log(filterList);
        // this.filterList = filterList;
        this.unmountDropdownMenu(() => {
          this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, filterList) });
        });
      },
      updateMenuPosition() {
        if (this.dropdownMenu) {
          const position = this.getDropdownMenu();
          this.dropdownMenu.menuStyle = { top: `${position.top + 30}px`, left: `${position.left - this.listWidth + 108}px`, width: `${this.listWidth}px` };
        }
      },
      getDropdownMenu() {
        const downloadBtnPosition = getPosition(this.$refs.filterBtn);
        const position = { top: downloadBtnPosition.y, left: downloadBtnPosition.x };
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        position.top = position.top - parentElScrollTop;
        return position;
      },
      unmountDropdownMenu(cb) {
        if (this.dropdownMenu) {
          console.log('unmountDropdownMenu');
          this.dropdownMenu.$destroy();
          document.body.removeChild(this.dropdownMenu.$el);
          const parentEl = this.parentEl || document.body;
          parentEl.removeEventListener('scroll', this.updateMenuPosition);
          this.dropdownMenu = null;
          cb && cb();
        }
      },
      handleCloseMenu(target) {
        // if (this.dropdownMenu && this.dropdownMenu.$el.contains(target)) return;
        // this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, this.filterList) });
        // this.unmountDropdownMenu();
      },
      currentPageChange() {
        this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, { page: this.currentPage }) });
      },
      linkToWatch(objectId) {
        this.$emit('update-router', { name: 'subscriptions', query: { objectId: objectId } });
      },
      showDownloadList(fileInfo) {
        this.fileInfo = fileInfo;
        this.downloadDialogDisplay = true;
      },
      downloadListConfirm(templateInfo) {
        this.templateInfo = templateInfo || {};
        if (!isEmptyObject(templateInfo)) {
          this.download();
        }
      },
      download() {
        const me = this;

        const param = {
          objectid: this.fileInfo.OBJECTID,
          inpoint: this.fileInfo.INPOINT,
          outpoint: this.fileInfo.OUTPOINT,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: this.templateInfo._id
        };

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      resetListWidth() {
        if (!this.$refs.searchWrap) return;
        this.listWidth = this.$refs.searchWrap.getBoundingClientRect().width;
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
      setViewType(t) {
        this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, { viewType: t }) });
      },
      getSubscribeSearchConfig() {
        subscribeAPI.getSubscribeSearchConfig().then((res) => {
          const data = res.data;
          this.menus = data;
          data.forEach(menu => {
            this.filterList[menu.key] = '';
          });
          const keys = Object.keys(this.query);
          for (let i = 0, len = keys.length; i < len; i++) {
            const key = keys[i];
            if (key === 'viewType' || key === 'query' || key === 'page') continue;
            this.filterList[key] = this.query[key];
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      updateList() {
        const options = Object.assign({}, this.filterList);
        options.keyword = this.query.query;
        // options.subscribeType = [this.query.channel];
        // if (this.orderVal) {
        //   options.sort = JSON.parse(this.orderVal);
        // }
        options.start = (this.currentPage - 1) * this.pageSize;
        options.pageSize = this.pageSize;
        subscribeAPI.esSearch(options, this).then((res) => {
          this.total = res.data.total;
          this.items = res.data.docs;
        }).catch((error) => {
          this.$message.error(error);
        });
      }
    },
    directives: { Clickoutside },
    components: {
      GridListView,
      Pagination,
      DownloadListView
    }
  };
</script>
