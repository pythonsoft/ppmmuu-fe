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
        <SubscribeListItem v-for="item in categoryItem.docs" :item="item" :key="item.objectId"></SubscribeListItem>
      </ul>
    </div>
  </div>
</template>
<script>
  import SubscribeListItem from './subscribeListItem';
  const subscribeAPI = require('../../../api/subscribe');

  const LIST_WRAP_PADDING = 120;
  const LIST_ITEM_WIDTH = 192;
  const LIST_ITEM_MARGIN = 6;
  const MAX_LIST_ITEM_COUNT = 7;
  const MIN_LIST_ITEM_COUNT = 4;

  export default {
    data() {
      return {
        defaultList: [],
        sectionListWidth: 0
      };
    },
    created() {
      this.getEsMediaList();
    },
    mounted() {
      this.resetListWidth();
      window.addEventListener('resize', this.resetListWidth);
    },
    beforDestroy() {
      window.removeEventListener('resize', this.resetListWidth);
    },
    methods: {
      resetListWidth() {
        const maxWidth = MAX_LIST_ITEM_COUNT * LIST_ITEM_WIDTH + (MAX_LIST_ITEM_COUNT - 1) * LIST_ITEM_MARGIN;
        const listWrapWidth = this.$refs.listWrap.getBoundingClientRect().width;
        if (listWrapWidth > maxWidth + LIST_WRAP_PADDING) {
          this.sectionListWidth = maxWidth;
        } else {
          let width = MIN_LIST_ITEM_COUNT * LIST_ITEM_WIDTH + (MIN_LIST_ITEM_COUNT - 1) * LIST_ITEM_MARGIN;
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
        this.$router.push({ name: 'subscriptions', query: { channel: channelId, channel_name: channelName } });
      }
    },
    components: {
      SubscribeListItem
    }
  };
</script>
