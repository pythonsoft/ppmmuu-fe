<template>
  <transition name="slide-in-right">
    <div v-show="visible" class="slide-dialog-wrapper" v-clickoutside="handleClose">
      <div class="shelf-detail-video">
        <div v-if="url" class="media-video-wrap">
          <div class="media-video-content" id="video" ref="video">
            <player :videoId="videoId" :height="288" :width="448" :url="url" :streamInfo="streamInfo"></player>
          </div>
          <div >
            <div class="media-video-title-wrap">
              <div class="media-video-title" :title="streamInfo.FILENAME" v-html="streamInfo.FILENAME"></div>
            </div>
          </div>
        </div>
        <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
      </div>
      <div class="shelf-detail-video-panel">
        <fj-tabs v-model="activeTabName" class="media-video-panel-wrap">
          <fj-tab-pane label="文件信息" name="tab2">
            <table class="media-center-table">
              <tr v-for="(info, key) in programDetails" v-if="info.value" >
                <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                <td class="item-info-value clearfix">
                  <span v-if="info.isFoldedContent" class="inline-info">{{ formatValue(info.value) }}</span>
                  <span class="item-expand-btn" v-if="info.isFoldedContent" @click="expand(info, key)">详细<i class="tri-bottom"></i></span>
                  <template v-else>
                    <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
                    <span v-else>{{ formatValue(info.value) }}</span>
                  </template>
                  <span class="item-folded-btn" v-if="info.value.length > 60 && !info.isFoldedContent" @click="folded(info, key)">收起<i class="tri-top"></i></span>
                </td>
              </tr>
            </table>
          </fj-tab-pane>
        </fj-tabs>
        <div class="detail-operation" v-if="btnShow">
          <fj-button :type="btnType || 'danger'" @click="handleClick" size="small">{{btnText || '上架'}}</fj-button>
        </div>
      </div>
      <i class="iconfont icon-close closebtn" @click="handleClose"></i>
    </div>
  </transition>
</template>
<script>
  import {
    isEmptyObject,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    formatTime,
    formatQuery
  } from '../../../common/utils';
  import Player from '../../mediaCenter/components/player';
  import MoreView from '../../mediaCenter/moreView';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import '../../mediaCenter/index.css';
  const api = require('../../../api/media');
  const libraryAPI = require('../../../api/library');
  const FILE_TYPE_MAP = {
    0: { text: '源文件' },
    1: { text: '低码流' },
    2: { text: '字幕' },
    3: { text: '缩略图' },
    4: { text: '其它' }
  };

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      objectId: String,
      btnText: String,
      btnType: String,
      btnShow: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        programDetails: {},
        activeTabName: 'tab2',
        videoId: '',
        FILE_TYPE_MAP: FILE_TYPE_MAP
      };
    },
    watch: {
      objectId(val) {
        if (this.visible) {
          this.getDetail();
          this.getStream();
        }
      },
      visible(val) {
        if (!val) return;
        if (this.objectId) {
          this.getDetail();
          this.getStream();
        }
      }
    },
    methods: {
      isEmptyObject,
      formatSize,
      formatDuration,
      formatContent,
      getStreamURL,
      formatTime,
      getStream() {
        getStreamURL(this.objectId, (err, url, res) => {
          if (err) {
            console.log('err', err);
            return;
          }

          this.streamInfo = res.result;
          this.url = url;
        }, this);
      },
      getDetail() {
        const me = this;
        api.getObject(formatQuery({ objectid: me.objectId }, true))
          .then((res)=>{
            me.programDetails = res.data.result.detail.program;
            const keys = Object.keys(me.programDetails);
            for (let i = 0; i < keys.length; i++) {
              const info = me.programDetails[keys[i]];
              if (info.value.length > 60) {
                info.isFoldedContent = true;
              }
            }
          })
          .catch((error)=>{
            me.showErrorInfo(error);
          })
      },
      handleClose() {
        this.$emit('update:visible', false);
      },
      handleClick() {
        this.$emit('operation-click');
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        return rs;
      }
    },
    directives: { Clickoutside },
    components: {
      Player,
      MoreView
    }
  };
</script>
<style>
  .slide-dialog-wrapper {
    width: 449px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: 1px solid #CED9E5;
    background: #FFFFFF;
    box-shadow: 2px 2px 15px 0px #9FB3CA;
    overflow: auto;
  }
  .shelf-detail-video {
    height: 330px;
    width: 100%;
    text-align: center;
    background: #CED9E5;
    overflow: hidden;
    box-sizing: border-box;
    color: #E3EAF3;
  }
  .shelf-detail-video-panel {
    position: absolute;
    top: 330px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F8FAFB;
    font-size: 12px;
    color: #2A3E52;
  }

  .shelf-detail-video-panel .media-video-panel-wrap{
    height: 500px;
  }

  .shelf-detail-video-panel .fj-tabs-content{
    padding-top: 18px;
    padding-left: 15px;
  }
  .closebtn {
    position: absolute;
    top: 0;
    right: 0;
    cursor: default;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    text-align: center;
    color: #9FB3CA;
  }
  .closebtn:hover {
    background-color: #CED9E5;
    color: #fff;
  }
  .detail-operation {
    margin-top: 10px;
    margin-left: 72px;
  }
</style>
