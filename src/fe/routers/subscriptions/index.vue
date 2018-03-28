<template>
  <layout-three-column :leftWidth="201" :rightWidth="0">
    <template slot="left">
      <div :class="$style.leftMenu">
        <h3 :class="$style.leftMenuTitle">共订阅{{ total }}个节目</h3>
        <ul>
          <li :class="$style.menuItem" @click="linkToHome">
            <span class="iconfont icon-company" :style="{ color: '#9FB3CA' }"></span>
            <span :class="$style.menuItemText">首页</span>
            <span></span>
          </li>
          <li :class="$style.menuItem" v-for="item in subscriptionMenu" @click="linkToChannel(item._id, item.name)">
            <span :class="$style.menuItemImgBox">
              <img :class="$style.menuItemImg" :src="item.photo" width="18" height="18" />
            </span>
            <span :class="$style.menuItemText" :title="item.name">{{ item.name }}</span>
            <span :class="$style.menuItemCount">{{ item.count }}</span>
          </li>
        </ul>
      </div>
    </template>
    <template slot="center">
      <div :class="$style.centerContent">
        <div :style="{ minWidth: '1080px' }">
          <div :class="[$style.topBar, 'clearfix']">
            <div :class="$style.btnGroup">
              <span :class="['iconfont icon-arrow-left', 'btnBack', {'disabled': routeIndex <= 0}]" @click="back"></span>
              <span :class="['iconfont icon-arrow-right', 'btnForward', {'disabled': history.length > 0 && routeIndex === history.length - 1}]" @click="forward"></span>
            </div>
            <div class="search-box">
              <fj-select
                remote
                :clear-history-method="clearHistory"
                :history-method="getSearchHistory"
                :remote-method="() => {}"
                :loading="loading"
                @search="searchClick"
                v-model="query"
                placeholder="请输入检索关键词"
                theme="fill">
                <fj-option
                  v-for="item in keywordOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </fj-option>
              </fj-select>
            </div>
            <div :class="$style.time" title="剩余时间／总时间">
              <span class="iconfont icon-clock" :class="$style.iconClock"></span>
              {{ transformSecondsToHours(remainTime) + ' / ' + transformSecondsToHours(totalTime) }}
            </div>
          </div>
          <home v-if="contentType === 'default'" @update-router="updateRouter"></home>
          <channel v-else-if="contentType === 'channel'" :query="routeQuery" @update-router="updateRouter"></channel>
          <search v-else ref="search" :query="routeQuery" @update-router="updateRouter"></search>
          <watch v-if="isShowWatch" :query="routeQuery" @update-router="updateRouter"></watch>
        </div>
      </div>
    </template>
  </layout-three-column>
</template>
<script>
  import LayoutThreeColumn from '../../component/layout/threeColumn';
  import { transformSecondsToHours } from '../../common/utils';
  import Home from './component/home';
  import Channel from './component/channel';
  import Watch from './component/watch';
  import Search from './component/search';
  import './index.css';

  const subscribeAPI = require('../../api/subscribe');
  const userAPI = require('../../api/user');
  const mediaAPI = require('../../api/media');

  export default {
    data() {
      return {
        query: '',
        keywordOptions: [],
        total: 0,
        subscriptionMenu: [],
        remainTime: 0,
        totalTime: 0,
        contentType: 'default',
        loading: false,
        routeQuery: {},
        history: [],
        routeIndex: 0,
        route: {},
        isShowWatch: false
      };
    },
    created() {
      this.route = this.$route;
      this.history.push(this.route);
      if (this.$route.query.query) {
        this.query = this.$route.query.query;
      }
      this.getSubscribeInfo();
      this.getSubscribeTypeSummary();
      this.updateContentType();
    },
    watch: {
      '$route'(val) {
        this.route = val;
        this.updateContentType();
        if (val.query.query) {
          this.query = val.query.query;
        }
      }
    },
    methods: {
      transformSecondsToHours,
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
        mediaAPI.getSearchHistory().then((res) => {
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
      searchClick() {
        this.updateRouter({ name: 'subscriptions', query: { query: this.query } });
      },
      updateContentType() {
        if (this.$refs.search) {
          this.$refs.search.unmountDropdownMenu();
        }
        this.routeQuery = this.route.query;
        if (this.routeQuery && this.routeQuery.channel) {
          this.contentType = 'channel';
        } else if (this.routeQuery && this.routeQuery.query) {
          this.contentType = 'search';
        } else {
          this.contentType = 'default';
        }
        if (this.routeQuery && this.routeQuery._id) {
          this.isShowWatch = true;
        } else {
          this.isShowWatch = false;
        }
      },
      getSubscribeInfo() {
        subscribeAPI.getSubscribeInfo()
          .then((response) => {
            const data = response.data;
            this.remainTime = data.remainDownloadSeconds;
            this.totalTime = data.downloadSeconds;
          })
          .catch((error) => {
          });
      },
      getSubscribeTypeSummary() {
        subscribeAPI.getSubscribeTypeSummary()
          .then((response) => {
            const data = response.data;
            this.subscriptionMenu = data.subscribeTypes;
            this.total = data.total;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      linkToChannel(channelId, channelName) {
        this.updateRouter({
          name: 'subscriptions',
          query: { channel: channelId, channel_name: channelName }
        });
      },
      linkToHome() {
        this.updateRouter({ name: 'subscriptions' });
      },
      updateRouter(route) {
        this.history.splice(this.routeIndex + 1, this.history.length - 1 - this.routeIndex, route);
        this.routeIndex = this.history.length - 1;
        this.$router.push(route);
      },
      back() {
        if (this.routeIndex <= 0) return;
        this.routeIndex -= 1;
        const route = {
          name: this.history[this.routeIndex].name,
          query: this.history[this.routeIndex].query
        };
        this.$router.push(route);
      },
      forward() {
        if (this.history.length > 0 && this.routeIndex === this.history.length - 1) return;
        this.routeIndex += 1;
        const route = {
          name: this.history[this.routeIndex].name,
          query: this.history[this.routeIndex].query
        };
        this.$router.push(route);
      }
    },
    components: {
      LayoutThreeColumn,
      Home,
      Channel,
      Watch,
      Search
    }
  };
</script>
<style module>
  .leftMenu {
    width: 100%;
    height: 100%;
    border-right: 4px solid #F2F6FA;
    overflow: auto;
    font-size: 12px;
  }
  .leftMenuTitle {
    height: 63px;
    line-height: 62px;
    padding: 0 16px 0;
    border-bottom: 1px solid #F2F6FA;
    color: #4C637B;
    font-weight: bold;
  }
  .centerContent {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background: rgba(248, 250, 251, .5);
  }
  .topBar {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 28px 60px 24px;
    background: #fff;
  }
  .topBar .btnGroup {
    float: left;
    margin-right: 10px;
  }

  .topBar .time {
    float: right;
    font-size: 12px;
    color: #4C637B;
    line-height: 36px;
  }
  .iconClock {
    font-size: 14px;
    color: #4C637B;
  }
  .menuItem {
    position: relative;
    height: 48px;
    line-height: 48px;
    padding: 0 15px 0 24px;
  }
  .menuItem:hover {
    background: #F2F6FA;
  }
  .menuItemText {
    position: absolute;
    left: 50px;
    right: 38px;
    line-height: 48px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    cursor: default;
    color: #4C637B;
  }
  .menuItemCount {
    position: absolute;
    right: 15px;
    color: #9FB3CA;
    line-height: 48px;
  }
  .menuItemImgBox {
    position: absolute;
    top: 15px;
    border-radius: 50%;
    overflow: hidden;
    width: 18px;
    height: 18px;
  }

  .menuItemImg {
    position: absolute;
    top: 0;
    width: 18px;
    height: 18px;
  }
</style>
