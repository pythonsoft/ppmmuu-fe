<template>
  <div :class="$style.watchContent">
    <div :class="[$style.mainBox, 'clearfix']" ref="mainBox">
    <div :class="$style.leftBox" :style="leftBoxStyle">
      <div :class="$style.leftBoxContent">
        <player
          :videoId="objectId"
          :height="leftBoxHeight"
          :width="leftBoxWidth"
          :url="url"
          :streamInfo="streamInfo"
          :fromWhere="fromWhere"
          :name="name"
          :files="files"
          :download-menu="DropdownMenu"></player>
      </div>
    </div>
    <i class="iconfont" :class="[rightBoxToggle, $style.rightBoxToggle]" :style="{ right: `${rightboxWidth}px` }" @click="foldedOrExpandRightBox"></i>
    <div :class="$style.rightBox" :style="rightBoxStyle">
      <h4 :class="$style.rightBoxTitle">内容简介</h4>
      <table class="subscriptions-program-table">
        <tr v-for="(info, index) in program" v-if="info.cn && info.value" >
          <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
          <td class="item-info-value clearfix">
            <template v-if="info.isFoldedContent">
              <span class="inline-info" v-html="formatContent(info.value).slice(0, 68) + '...'"></span>
              <span class="item-expand-btn" @click="expand(info, index)">详细<i class="tri-bottom"></i></span>
            </template>
            <template v-else>
              <span v-html="formatContent(info.value)"></span>
            </template>

            <span class="item-folded-btn" v-if="info.value.length > 68 && !info.isFoldedContent" @click="folded(info, index)">收起<i class="tri-top"></i></span>
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
  const subscribeAPI = require('../../../api/subscribe');

  const RIGHTBOX_WIDTH = 320;

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/source/photoBreak.png',
    attempt: 1
  });

  const PROGRAM_MAP = {
    name: { cn: '节目名称' },
    FIELD36: { cn: '播出时间' },
    lastModifyTime: { cn: '上架时间' },
    limit: { cn: '限制' },
    FIELD247: { cn: '内容介绍' },
  }

  export default {
    props: {
      query: {}
    },
    data() {
      return {
        DropdownMenu: DropdownMenu,
        rightBoxStatus: 'expand',
        rightBoxToggle: 'icon-fill-toggle-right',
        rightboxWidth: RIGHTBOX_WIDTH,
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
      rightBoxStatus(val) {
        // setTimeout(() => {
          if (this.rightBoxStatus === 'expand') {
            this.rightBoxToggle = 'icon-fill-toggle-right';
          } else if (this.rightBoxStatus === 'folded') {
            this.rightBoxToggle = 'icon-fill-toggle-left folded';
          }
        // }, 400);
      }
    },
    computed: {
      rightBoxStyle() {
        const width = this.rightboxWidth;
        return {
          width: `${width}px`,
          height: width === RIGHTBOX_WIDTH ? '100%' : '0',
          padding: width === RIGHTBOX_WIDTH ? '0 20px' : '0'
        };
      },
      leftBoxStyle() {
        const style = { width: `${this.leftBoxWidth}px` };
        if (this.rightBoxStatus === 'folded') {
          style.transition = 'width .4s cubic-bezier(0.23, 1, 0.32, 1) 100ms'
        }
        return style;
      }
    },
    mounted() {
      if (this.query._id) {
        this.refresh();
      }
      this.updateLeftBoxSize();
      window.addEventListener('resize', throttle(this.updateLeftBoxSize, 200));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.updateLeftBoxSize, 200));
    },
    methods: {
      formatSize,
      formatDuration,
      getTitle,
      getReplaceName,
      foldedOrExpandRightBox() {
        if (this.rightBoxStatus === 'expand') {
          this.rightBoxStatus = 'folded';
          this.leftBoxWidth = this.leftBoxWidth + RIGHTBOX_WIDTH;
          this.rightboxWidth = 0;
          // setTimeout(this.updatePlayerWidth, 400);
        } else if (this.rightBoxStatus === 'folded') {
          this.rightBoxStatus = 'expand';
          this.leftBoxWidth = this.leftBoxWidth - RIGHTBOX_WIDTH;
          this.rightboxWidth = RIGHTBOX_WIDTH;
          // setTimeout(this.updatePlayerWidth, 400);
        }
      },
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
        const leftBoxWidth = this.$refs.mainBox.getBoundingClientRect().width - this.rightboxWidth;
        const leftBoxHeight = this.$refs.mainBox.getBoundingClientRect().height;
        this.leftBoxWidth = leftBoxWidth;
        this.leftBoxHeight = leftBoxHeight;
      },
      updateList() {
        if (this.loadListBtnText === '加载中...') return;
        this.loadListBtnText = '加载中...';
        const options = {};
        options.subscribeType = this.subscribeType.split(',').join(' ');
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

          const details = data.details;
          const programKeys = Object.keys(PROGRAM_MAP);
          const tempProgram = [];
          for (let i = 0, len = details.length; i < len; i++) {
            const info = details[i];
            if (programKeys.indexOf(info.key) === -1) continue;
            if (info.value && this.formatContent(info.value).length > 68) {
              info.isFoldedContent = true;
            }
            info.cn = PROGRAM_MAP[info.key].cn;
            tempProgram.push(info);
          }
          this.program = tempProgram;
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
      formatContent(v) {
        let r = v;

        if(typeof r === 'string') {
          r = formatContent(this.formatValue(v));
        }

        return r;
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
  top: 63px;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: #fff;
  overflow-x: auto;
}
.mainBox {
  position: relative;
  min-width: 994px;
  height: 100%;
}

.rightBox {
  position: absolute;
  top: 0;
  right: 0;
  /*float: right;*/
  /*width: 320px;*/
  height: 100%;
  padding: 0 25px;
  background: #F8FAFB;
  font-size: 12px;
  color: #4C637B;
  overflow-x: hidden;
  overflow-y: auto;
  transition: width .4s cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}
.rightBoxTitle {
  margin: 15px 0;
  color: #38B1EB;
  font-weight: bold;
}
.leftBox {
  /*float: left;*/
  position: absolute;
  top: 0;
  left: 0;
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
.rightBoxToggle {
  position: absolute;
  top: 50%;
  /*right: 320px;*/
  font-size: 30px;
  color: #021120;
  cursor: pointer;
  z-index: 101;
  transition: right .4s cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}
.rightBoxToggle:after {
  content: '';
  position: absolute;
  top: 10px;
  right: 0;
  height: 23px;
  width: 13px;
  background: #fff;
  z-index: -1;
}
</style>
