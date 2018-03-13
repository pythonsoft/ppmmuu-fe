<template>
  <div class="subscribe-list-wrap" ref="listWrap">
    <div v-for="categoryItem in defaultList" :style="{ width: `${sectionListWidth}px` }" class="subscribe-section-list-wrap">
      <div class="clearfix">
        <h3 class="subscribe-section-title">{{ categoryItem.key }}</h3>
        <span class="subscribe-section-count" @click="linkToChannel(categoryItem._id, categoryItem.key)">
          共{{ categoryItem.total }}个
          <span class="iconfont icon-arrow-right arrow-right-btn"></span>
        </span>
      </div>
      <ul class="subscribe-grid subscribe-section-list">
        <SubscribeListItem
          v-for="item in categoryItem.docs"
          :item="item"
          :key="item.objectId"
          :download-fn="showDownloadList"
          :link-to-watch-fn="linkToWatch"
          :parent-el="parentEl"></SubscribeListItem>
      </ul>
    </div>
    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
  </div>
</template>
<script>
  import SubscribeListItem from './subscribeListItem';
  import DownloadListView from '../../management/template/download/component/downloadDialog';
  import {
    isEmptyObject,
    formatQuery,
    FROM_WHERE
  } from '../../../common/utils';
  import throttle from '../../../component/fjUI/utils/throttle';
  const subscribeAPI = require('../../../api/subscribe');
  const jobAPI = require('../../../api/job');

  const LIST_WRAP_PADDING = 120;
  const LIST_ITEM_WIDTH = 192;
  const LIST_ITEM_MARGIN = 6;
  const MAX_LIST_ITEM_COUNT = 7;
  const MIN_LIST_ITEM_COUNT = 4;

  export default {
    data() {
      return {
        defaultList: [],
        sectionListWidth: 0,
        downloadDialogDisplay: false,
        fileInfo: {},
        templateInfo: {},
        parentEl: null
      };
    },
    created() {
      this.getEsMediaList();
    },
    mounted() {
      this.resetListWidth();
      window.addEventListener('resize', throttle(this.resetListWidth));
      this.parentEl = this.$refs.listWrap;
    },
    beforDestroy() {
      window.removeEventListener('resize', throttle(this.resetListWidth));
    },
    methods: {
      showDownloadList(fileInfo) {
        this.fileInfo = fileInfo;
        this.downloadDialogDisplay = true;
      },
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          this.download(rs, type);
        }
      },
      download(rs, type) {
        const me = this;
        const templateInfo = rs[type];
        const param = {
          objectid: this.fileInfo.OBJECTID,
          inpoint: this.fileInfo.INPOINT,
          outpoint: 0,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: templateInfo._id,
          fromWhere: this.fileInfo.fromWhere || FROM_WHERE.MAM
        };

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      resetListWidth() {
        if (!this.$refs.listWrap) return;
        const maxWidth = MAX_LIST_ITEM_COUNT * LIST_ITEM_WIDTH
          + (MAX_LIST_ITEM_COUNT - 1) * LIST_ITEM_MARGIN;
        const listWrapWidth = this.$refs.listWrap.getBoundingClientRect().width;
        if (listWrapWidth > maxWidth + LIST_WRAP_PADDING) {
          this.sectionListWidth = maxWidth;
        } else {
          let width = MIN_LIST_ITEM_COUNT * LIST_ITEM_WIDTH
            + (MIN_LIST_ITEM_COUNT - 1) * LIST_ITEM_MARGIN;
          for (let i = MIN_LIST_ITEM_COUNT + 1; i <= MAX_LIST_ITEM_COUNT; i++) {
            const tempWidth = i * LIST_ITEM_WIDTH + (i - 1) * LIST_ITEM_MARGIN;
            if (listWrapWidth >= tempWidth + LIST_WRAP_PADDING) {
              width = tempWidth;
            } else {
              break;
            }
          }
          this.sectionListWidth = width;
        }
      },
      getEsMediaList() {
        subscribeAPI.getEsMediaList({ params: { pageSize: 7 } })
          .then((response) => {
            this.defaultList = response.data.category;
          })
          .catch((error) => {
          });
      },
      linkToChannel(channelId, channelName) {
        this.$emit('update-router', {
          name: 'subscriptions',
          query: { channel: channelId, channel_name: channelName }
        });
      },
      linkToWatch(item) {
        this.$emit('update-router', { name: 'subscriptions', query: { _id: item._id } });
      }
    },
    components: {
      SubscribeListItem,
      DownloadListView
    }
  };
</script>
