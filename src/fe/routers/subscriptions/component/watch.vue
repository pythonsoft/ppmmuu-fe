<template>
  <div :class="$style.watchContent">
    <div :class="[$style.mainBox, 'clearfix']" ref="mainBox">
    <div :class="$style.leftBox" :style="{ width: `${leftBoxWidth}px` }">
      <div :class="$style.leftBoxContent">
        <player
          :videoId="objectId"
          :height="leftBoxHeight"
          :width="leftBoxWidth"
          :url="url"
          :streamInfo="streamInfo"
          :fromWhere="fromWhere"
          :name="name"
          :files="files"></player>
      </div>
    </div>
    <div :class="$style.rightBox">
      <h4 :class="$style.rightBoxTitle">内容简介</h4>
      <table class="subscriptions-program-table">
        <tr v-for="(info, index) in program" v-if="info.cn && info.value" >
          <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
          <td class="item-info-value clearfix">
            <template v-if="info.isFoldedContent">
              <span class="inline-info">{{ formatValue(info.value) }}</span>
              <span class="item-expand-btn" @click="expand(info, index)">详细<i class="tri-bottom"></i></span>
            </template>
            <template v-else>
              <span v-html="formatContent(info.value)"></span>
            </template>

            <span class="item-folded-btn" v-if="info.value.length > 60 && !info.isFoldedContent" @click="folded(info, index)">收起<i class="tri-top"></i></span>
          </td>

        </tr>
      </table>
      <h4 :class="$style.rightBoxTitle">更多节目</h4>
      <ul v-if="items.length > 0">
        <li :class="[$style.itemThumb, 'clearfix']" v-for="item in items" @click="currentItemChange(item)">
          <div :class="['iconfont icon-phoenixtv', $style.itemThumbWrap]">
            <img :class="$style.thumb" v-lazy="item.poster" width="112" height="62">
          </div>
          <div :class="$style.itemTitleWrap">
            <p :class="$style.itemTitle" :title="getReplaceName(item)" v-html="getTitle(item)"></p>
            <p title="上架时间">{{ item.storageTime | formatTime }}</p>
          </div>
        </li>
      </ul>
      <p v-else :class="$style.emptyText">暂无更多节目推荐</p>
        <li class="load-list-button">
          <fj-button type="text" v-show="total > currentPage * pageSize" @click="currentPage += 1">{{ loadListBtnText }}</fj-button>
        </li>
    </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import {
    getStringLength,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    isEmptyObject,
    formatQuery,
    formatTime,
    FROM_WHERE
  } from '../../../common/utils';
  import Player from './player';
  import { getTitle, getThumb, getReplaceName } from '../../mediaCenter/common';
  import DropdownMenu from './dropdownMenu';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import throttle from '../../../component/fjUI/utils/throttle';

  const config = require('../../mediaCenter/config');
  const mediaAPI = require('../../../api/media');
  const ivideoAPI = require('../../../api/ivideo');
  const userAPI = require('../../../api/user');
  const subscribeAPI = require('../../../api/subscribe');

  const RIGHTBOX_WIDTH = 320;

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/source/photoBreak.png',
    attempt: 1
  });

  export default {
    props: {
      query: {}
    },
    data() {
      return {
        activeTabName: 'tab1',
        files: [],
        _id: '',
        objectId: '',
        name: '',
        poster: '',
        leftBoxWidth: 0,
        leftBoxHeight: 0,
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        program: [],
        items: [],
        templateInfo: {},
        fromWhere: FROM_WHERE.MAM,
        FROM_WHERE: config.getConfig('FROM_WHERE'),
        UMP_FILETYPE_VALUE: config.getConfig('UMP_FILETYPE_VALUE'),
        loadListBtnText: '加载更多',
        currentPage: 1,
        pageSize: 10,
        total: 0,
        subscribeType: ''
      };
    },
    watch: {
      query(val) {
        if (val._id) {
          this.refresh();
        }
      },
      currentPage(val) {
        this.updateList();
      },
    },
    mounted() {
      if (this.query._id) {
        this.refresh();
      }
      this.updateLeftBoxSize();
      window.addEventListener('resize', throttle(this.updateLeftBoxSize, 1000));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.updateLeftBoxSize, 1000));
    },
    methods: {
      formatSize,
      formatDuration,
      formatContent,
      getTitle,
      getReplaceName,
      expand(info, key) {
        const newInfo = Object.assign({}, this.program[key], { isFoldedContent: false });
        this.$set(this.program, key, newInfo);
      },
      folded(info, key) {
        const newInfo = Object.assign({}, this.program[key], { isFoldedContent: true });
        this.$set(this.program, key, newInfo);
      },
      getTitle(item) {
        const content = getReplaceName(item);
        const limit = 35;
        return getStringLength(content) > limit ? `${content.slice(0, limit)}...` : content;
      },
      refresh() {
        this._id = this.query._id;
        this.getDetail();
        // this.getStream(this.objectId);
        // this.poster = getThumb({ id: this.objectId });
      },
      currentItemChange(item) {
        this.$emit('update-router', { name: 'subscriptions', query: { _id: item._id } });
      },
      updateLeftBoxSize() {
        if (!this.$refs.mainBox) return;
        const leftBoxWidth = this.$refs.mainBox.getBoundingClientRect().width - RIGHTBOX_WIDTH;
        const leftBoxHeight = this.$refs.mainBox.getBoundingClientRect().height;
        this.leftBoxWidth = leftBoxWidth;
        this.leftBoxHeight = leftBoxHeight;
      },
      updateList() {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        const options = {};
        options.subscribeType = this.subscribeType;
        options.start = (this.currentPage - 1) * this.pageSize;
        options.pageSize = this.pageSize;
        subscribeAPI.esSearch(options, this).then((res) => {
          res.data.docs.forEach(item => {
            if (item._id !== this._id) {
              this.items.push(item);
            }
          });
          this.total = res.data.total;
          this.loadListBtnText = '加载更多';
        }).catch((error) => {
          this.$message.error(error);
          this.loadListBtnText = '加载更多';
        });
      },
      getDetail() {
        subscribeAPI.getVideoInfo({ params: { _id: this._id } }).then((res) => {
          const data = res.data;
          this.objectId = data.objectId;
          this.name = data.name;
          this.fromWhere = data.fromWhere || FROM_WHERE.MAM;
          this.getStream(this.objectId, this.fromWhere);
          this.items = [];
          this.currentPage = 1;
          this.subscribeType = data.editorInfo.subscribeType;
          this.updateList();
          this.program = data.details.map((info) => {
            if (info.value && info.value.length > 60) {
              info.isFoldedContent = true;
            }
            return info;
          });
          this.files = data.files;

        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream(id, fromWhere) {
        getStreamURL(id, fromWhere, (err, url, rs) => {
          if (err) {
            this.$message.error(err);
            return;
          }
          this.streamInfo = rs.result;
          document.title = rs.result.FILENAME;
          this.url = url;
        }, this);
      },
      back() {
        this.$router.push({ name: 'history' });
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        return rs;
      }
    },
    components: {
      Player
    },
    directives: { Clickoutside }
  };
</script>
<style module>
.watchContent {
  position: absolute;
  top: 90px;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: #fff;
  overflow-x: auto;
}
.mainBox {
  min-width: 994px;
  height: 100%;
}

.rightBox {
  float: right;
  width: 320px;
  height: 100%;
  padding: 0 25px;
  background: rgba(248, 250, 251, .5);
  font-size: 12px;
  color: #4C637B;
  overflow-x: hidden;
  overflow-y: auto;
}
.rightBoxTitle {
  margin: 15px 0;
  color: #38B1EB;
  font-weight: bold;
}
.leftBox {
  float: left;
  height: 100%;
  background: #021120;
}
.leftBoxContent {
  overflow: hidden;
}
.footerTitle {
  position: relative;
  height: 20px;
  margin-top: 20px;
  margin-bottom: 14px;
  padding-left: 9px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.footerTitle:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: #20A4F3;
}
.emptyText {
}
.itemThumb {
  height: 62px;
  margin: 0 0 16px;
  cursor: pointer;
}
.itemThumbWrap {
  float: left;
  position: relative;
  height: 62px;
  line-height: 62px;
  width: 112px;
  text-align: center;
  overflow: hidden;
  border-radius: 2px;
  box-sizing: border-box;
  background: #EBF3FB;
  color: #D4DFEC;
  font-size: 28px;
}
.thumb {
  position: absolute;
  top: 0;
  left: 0;
}
.itemTitleWrap {
  margin-left: 124px;
}
.itemTitle {
  color: #2A3E52;
  word-break: break-all;
}
.itemThumb:hover .itemTitle {
  color: #38B1EB;
}
</style>
