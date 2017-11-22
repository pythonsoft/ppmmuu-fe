<template>
  <div class="edit-left-content">
    <div class="edit-left-video">
      <div v-if="url" class="edit-left-video-wrap">
        <div class="edit-left-video-content" id="video" ref="video">
          <player :videoId="videoId" :height="526" :url="url" :streamInfo="streamInfo" ref="player" :fromWhere="shelfInfo.fromWhere"></player>
        </div>
        <div class="media-video-title-wrap">
          <div class="media-video-title" v-html="shelfInfo.name"></div>
          <ul class="media-video-title-bar">
            <li>
              <span title="截图" class="iconfont icon-camera" @click.stop="screenshot"></span>
            </li>
          </ul>
        </div>
      </div>
      <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
    </div>
    <div class="edit-left-video-panel" :style="{height: detailWidth}">
      <div class="media-center-file-item">
        <table class="media-center-table">
          <tr v-for="(info, key) in programDetails" v-if="info.cn && info.value" >
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
      </div>
    </div>
    <fj-dialog
            :visible.sync="imageDialogVisible"
            :show-close="false"
            :close-on-click-modal="true"
            width="640px"
            type="basic">
      <div class="screenshot-wrap">
        <img :src="screenshotURL" width="100%">
        <a class="iconfont icon-download screenshot-download-icon" :href="screenshotURL" :download="screenshotTitle"></a>
      </div>
    </fj-dialog>
  </div>
</template>
<script>
  import '../../mediaCenter/index.css';
  import Vue from 'vue';
  import { getTitle, getThumb } from '../../mediaCenter/common';
  import {
    isEmptyObject,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    formatTime,
    formatQuery,
    transformSecondsToStr
  } from '../../../common/utils';
  import Player from '../../mediaCenter/components/player';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import ivideoAPI from '../../../api/ivideo';

  const api = require('../../../api/media');
  const shelfAPI = require('../../../api/shelves');


  export default {
    name: 'right',
    directives: { Clickoutside },
    components: {
      Player
    },
    props: {
      shelfInfo: { type: Object, default: {}}
    },
    data() {
      return {
        programDetails: {},
        editorInfo: {},
        detailWidth: '',
        poster: '',
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0
        },
        videoId: '',
        imageDialogVisible: false,
        screenshotURL: '',
        screenshotTitle: '',
      };
    },
    created(){
      this.initData();
      this.resize();
    },
    mounted() {
      window.addEventListener('resize', this.resize);
    },
    methods: {
      resize(e) {
        this.detailWidth = (document.body.clientHeight - 700) + 'px';
      },
      expand(info, key) {
        const newInfo = Object.assign({}, this.programDetails[key], { isFoldedContent: false });
        this.$set(this.programDetails, key, newInfo);
      },
      folded(info, key) {
        const newInfo = Object.assign({}, this.programDetails[key], { isFoldedContent: true });
        this.$set(this.programDetails, key, newInfo);
      },
      initData() {
        //this.videoId = this.shelfInfo.objectId;
        this.videoId = this.shelfInfo.objectId;
        this.editorInfo = this.shelfInfo.editorInfo;
        this.poster = this.getThumb({id: this.videoId});
        this.getStream();
        this.getObject();
      },
      getThumb,
      getTitle,
      isEmptyObject,
      formatSize,
      formatContent,
      formatDuration(input, output) {
        return formatDuration((output - input) / 25 * 1000);
      },
      getObject(){
        const me = this;
        api.getObject(formatQuery({ objectid: me.videoId, fromWhere: me.shelfInfo.fromWhere || 1 }, true))
          .then((res)=>{
            me.programDetails = Object.assign({'programNO': {cn: '节目编号', value: me.shelfInfo.programNO}},res.data.result.detail.program);
            const keys = Object.keys(me.programDetails);
            for (let i = 0; i < keys.length; i++) {
              const info = me.programDetails[keys[i]];
              if (info.value.length > 60) {
                info.isFoldedContent = true;
              }
            }
          })
          .catch((error)=>{
            me.$message.error(error);
          })
      },
      getStream() {
        const me = this;

        getStreamURL(me.videoId, me.shelfInfo.fromWhere || 1, (err, url, rs) => {
          if (err) {
            me.$message.error(err);
            return;
          }
          me.streamInfo = rs.result;
          me.url = url;
        }, me);

        return false;
      },
      screenshot() {
        this.screenshotURL = this.createImage();
        this.screenshotTitle = this.shelfInfo.name + transformSecondsToStr(this.currentTime);
        this.imageDialogVisible = true;
      },
      createImage() {
        const video = this.$refs.player.$refs.video;
        const canvas = document.createElement('CANVAS');
        const size = {
          width: this.$refs.video.offsetWidth,
          height: 526
        };
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const imageURL = canvas.toDataURL('image/png');
        return imageURL;
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        return rs;
      },
      showSuccessInfo(message) {
        this.$message.success(message);
      },
      showErrorInfo(message) {
        this.$message.error(message);
      }
    }
  };
</script>
<style>
  .edit-left-content {
    position: relative;
  }

  .edit-left-video {
    height: 568px;
    width: 100%;
    text-align: center;
    background: #CED9E5;
    overflow: hidden;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    color: #E3EAF3;
    top: 0;
    left: 4px;
  }

  .edit-left-video-wrap {
    line-height: 568px;
    font-size: 12px;
  }

  .edit-left-video-content{
    height: 526px;
    overflow: hidden;
    position: relative;
  }

  .edit-left-video-panel {
    background: #F8FAFB;
    font-size: 12px;
    color: #2A3E52;
    width: 100%;
    height: 600px;
    overflow: auto;
    position: relative;
    box-sizing: border-box;
  }

  .screenshot-wrap:hover .screenshot-download-icon {
    display: block;
  }
  .screenshot-download-icon {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    font-size: 32px;
    color: #fff;
    display: none;
  }
</style>
