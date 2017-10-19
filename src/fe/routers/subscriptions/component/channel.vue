<template>
  <div class="channel-wrap" ref="channelWrap">
    <div class="channel-header clearfix">
      <h3 class="channel-name">{{ this.query.channel_name }}</h3>
      <span class="channel-count">共{{ total }}个</span>
      <div class="media-center-view-bar">
        <span :class="viewTypeSelect('grid')" @click="setViewType('grid')"></span><!--
        --><span :class="viewTypeSelect('list')" @click="setViewType('list')"></span><!--
        --><div class="order-select">
          <fj-select v-model="orderVal" size="small">
            <fj-option
              v-for="item in ORDER_OPTIONS"
              :key="item.value"
              :value="item.value"
              :label="item.label"></fj-option>
          </fj-select>
        </div>
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
  import GridListView from './gridAndList';
  import Pagination from '../../mediaCenter/components/pagination';
  import DownloadListView from '../../management/template/download/component/downloadDialog';
  import {
    isEmptyObject,
    formatQuery
  } from '../../../common/utils';

  const jobAPI = require('../../../api/job');
  const subscribeAPI = require('../../../api/subscribe');

  export default {
    props: {
      query: {}
    },
    created() {
      this.getSubscribeSearchConfig();
      if (this.query.viewType) this.viewType = this.query.viewType;
      if (this.query.page) this.currentPage = Number(this.query.page);
      if (this.query.order) this.orderVal = this.query.order;
      this.updateList();
    },
    mounted() {
      this.resetListWidth();
      window.addEventListener('resize', this.resetListWidth);
      this.parentEl = this.$refs.channelWrap;
    },
    beforDestroy() {
      window.removeEventListener('resize', this.resetListWidth);
    },
    watch: {
      query(val) {
        if (val.viewType && this.viewType !== val.viewType) {
          this.viewType = val.viewType;
        } else {
          this.updateList();
        }
      },
      orderVal(val, oldVal) {
        if (!oldVal) return;
        this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, { order: val }) });
      }
    },
    data() {
      return {
        total: 0,
        orderVal: '',
        viewType: 'grid',
        ORDER_OPTIONS: [],
        items: [],
        pageSize: 20,
        currentPage: 1,
        listWidth: 1080,
        downloadDialogDisplay: false,
        fileInfo: {},
        templateInfo: {},
        parentEl: null
      };
    },
    methods: {
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
      getSubscribeSearchConfig() {
        subscribeAPI.getSubscribeSearchConfig().then((res) => {
          const data = res.data;
          for (let i = 0; i < data.length; i++) {
            if (data[i].key === 'sort') {
              this.ORDER_OPTIONS = data[i].items;
              if (!this.orderVal) this.orderVal = this.ORDER_OPTIONS[0].value;
            }
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      resetListWidth() {
        if (!this.$refs.channelWrap) return;
        this.listWidth = this.$refs.channelWrap.getBoundingClientRect().width;
      },
      setViewType(t) {
        this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, { viewType: t }) });
      },
      currentPageChange() {
        this.$emit('update-router', { name: 'subscriptions', query: Object.assign({}, this.query, { page: this.currentPage }) });
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
      updateList() {
        const options = {};
        options.subscribeType = this.query.channel;
        if (this.orderVal) {
          options.sort = this.orderVal;
        }
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
    components: {
      GridListView,
      Pagination,
      DownloadListView
    }
  };
</script>
