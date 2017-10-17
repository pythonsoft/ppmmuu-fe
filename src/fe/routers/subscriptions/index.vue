<template>
  <layout-three-column :leftWidth="201" :rightWidth="0">
    <template slot="left">
      <div :class="$style.leftMenu">
        <h3 :class="$style.leftMenuTitle">共订阅{{ total }}个节目</h3>
        <ul>
          <li :class="$style.menuItem">
            <span class="iconfont icon-company" :style="{ color: '#9FB3CA' }"></span>
            <span :class="$style.menuItemText">首页</span>
            <span></span>
          </li>
          <li :class="$style.menuItem" v-for="item in subscriptionMenu">
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
              <span :class="['iconfont icon-arrow-left', $style.btnBack]"></span>
              <span :class="['iconfont icon-arrow-right', $style.btnForward]"></span>
            </div>
            <div :style="{ width: '676px', float: 'left' }">
              <fj-select
                remote
                :clear-history-method="() => {}"
                :history-method="() => {}"
                :remote-method="() => {}"
                :loading="loading"
                v-model="query"
                placeholder="请输入检索关键词"
                theme="fill">
                <fj-option
                  v-for="item in queryOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </fj-option>
              </fj-select>
            </div>
            <div :class="$style.time" title="剩余时间">
              <span class="iconfont icon-clock" :class="$style.iconClock"></span>
              {{ transformSecondsToHours(remainTime) + ' / ' + transformSecondsToHours(totalTime) }}
            </div>
          </div>
          <home v-if="contentType === 'default'"></home>
          <channel v-else-if="contentType === 'channel'"></channel>
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
  import './index.css';

  const subscribeAPI = require('../../api/subscribe');

  export default {
    data() {
      return {
        query: '',
        queryOptions: [],
        total: 0,
        subscriptionMenu: [],
        remainTime: 0,
        totalTime: 0,
        contentType: 'default',
        loading: false
      };
    },
    created() {
      this.getSubscribeInfo();
      this.getSubscribeTypeSummary();
      this.updateContentType();
    },
    watch: {
      '$route'(val) {
        console.log('route', val);
        this.updateContentType();
      }
    },
    methods: {
      transformSecondsToHours,
      updateContentType() {
        if (this.$route.query.channel) {
          this.contentType = 'channel';
        } else {
          this.contentType = 'default';
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
      }
    },
    components: {
      LayoutThreeColumn,
      Home,
      Channel
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
    overflow: auto;
    background: #F8FAFB;
  }
  .topBar {
    padding: 28px 60px 24px;
    background: #fff;
  }
  .topBar .btnGroup {
    float: left;
    margin-right: 10px;
  }
  .btnBack,
  .btnForward {
    float: left;
    width: 36px;
    height: 36px;
    line-height: 36px;
    background: #F2F6FA;
    border-radius: 4px;
    text-align: center;
    font-size: 12px;
    color: #9FB3CA;
  }
  .btnBack:hover,
  .btnForward:hover {
    background: #E3EAF3;
  }
  .btnBack {
    margin-right: 1px;
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
  }
  .btnForward {
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
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
    /*position: absolute;
    top: 0;
    width: 18px;
    height: 18px;*/
  }
</style>