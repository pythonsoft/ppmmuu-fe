<template>
  <div
    :class="['video-source-wrap', {'active-panel':isActivePanel}]"
    @click="()=>{this.$emit('update:activePanel', 'sourcePanel')}">
    <div
      class="video-source-title"
      :title="`源：${title || videoInfo.FILENAME || '素材名称'} ${displayDuration}`"
      v-html="`源：${title || videoInfo.FILENAME || '素材名称'} ${displayDuration}`"
      ></div>
    <div class="video-source-box">
      <div class="videoSourceLoadingMask" v-if="loading"></div>
      <video v-on:contextmenu.prevent="contextMenuStop" :src="videoSource" ref="video" :style="{ width: '100%', height: '100%' }" crossorigin="anonymous"></video>
      <div v-show="currentVideoSRT" class="video-srt">
        <span class="video-srt-text">{{ currentVideoSRT }}</span>
      </div>
    </div>
    <div class="video-source-bottom">
      <div v-if="duration===0" class="player-mask"></div>
      <div class="player-time-box clearfix">
        <span :style="{float: 'left'}">{{ displayCurrentTime }}</span>
        <span :style="{float: 'right'}">{{ displayClipDuration }}</span>
      </div>
      <div
        v-show="duration > 0"
        class="player-progress-bar-box"
        @mouseenter="mouseenter"
        @mousemove="mousemove"
        @mouseleave="mouseleave"
        @click="handleProgressBarClick">
        <div
          class="player-progress-bar"
          ref="progressBar"></div>
        <i class="iconfont icon-video-pull-indicator player-pull-indicator" :style="indicatorStyle" @mousedown="indicatorMousedown"></i>
        <div class="player-tooltip" :style="tooltipStyle" ref="tooltip">
          <div class="player-tooltip-text">
            {{ tooltipText }}
          </div>
        </div>
        <div v-show="isShowInPoint && isShowOutPoint" :style="clipRangeStyle" class="clip-range"></div>
        <i v-show="isShowInPoint" :style="inPointStyle" class="iconfont icon-in-point player-in-point"></i>
        <i v-show="isShowOutPoint" :style="outPointStyle" class="iconfont icon-out-point player-out-point"></i>
      </div>
      <div class="player-controls">
        <div v-for="item in controllerList" class="player-control-item-wrap">
          <div class="player-control-item" @click="item.clickFn">
            <i :class="['iconfont', getControlerIcon(item.icon, item.name)]"></i>
          </div>
          <div class="player-control-tooltip">{{ item.tooltip }}</div>
        </div>
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
  import { getStreamURL, getSRT, secondsToTimeCode } from '../../../common/utils';
  import './videoPanel.css';
  const config = require('../../mediaCenter/config');
  const mediaConfig = require('../../mediaCenter/config');
  const api = require('../../../api/media');

  export default {
    props: {
      activePanel: String,
      imageSize: {
        type: Object,
        default() {
          return { width: 640, height: 360 };
        }
      },
      title: {
        type: String,
        default: ''
      },
      sourceFromWhere: String,
      videoId: {
        type: String,
        default: ''
      },
      videoSnippet: {
        type: Object,
        default() {
          return { fileTypeId: '' };
        }
      },
      size: {
        type: Object,
        default() {
          return { width: 0, height: 0 };
        }
      },
      fps: {
        type: Number,
        default: 25
      },
      controller: {
        type: String,
        default: 'markIn,markOut,gotoInPoint,prevFrame,play,nextFrame,gotoOutPoint,insert,camera'
      }
    },
    data() {
      return {
        files: '',
        fileId: '',
        fileTypeId: '',
        detail: '',
        currentTime: 0,
        clipDuration: 0,
        controllerList: this.getControllerList(this.controller),
        offset: 0,
        isPlaying: false,
        moveIndicatorTimer: null,
        isShowInPoint: false,
        isShowOutPoint: false,
        inPointOffset: -9,
        outPointOffset: -5,
        inTime: 0,
        outTime: 0,
        inTimeScreenshot: '',
        tooltipTimeId: null,
        tooltipStyle: { display: 'none' },
        tooltipTime: 0,
        tooltipText: '00:00:00:00',
        moveIndicatorTimeId: null,
        updateCurrentTimeTimeId: null,
        imageDialogVisible: false,
        screenshotURL: '',
        screenshotTitle: '',
        videoSource: '',
        videoSRT: [],
        videoSRTPosition: 0,
        currentVideoSRT: '',
        videoInfo: {
          FILENAME: '',
          FILETYPEID: '',
          INPOINT: 0,
          OUTPOINT: 0
        },
        loading: true,
        fromWhere: '',
        FROM_WHERE: config.getConfig('FROM_WHERE'),
        UMP_FILETYPE_VALUE: config.getConfig('UMP_FILETYPE_VALUE')
      };
    },
    computed: {
      innerCurrentTime() {
        return this.currentTime - this.videoInfo.INPOINT > this.videoInfo.OUTPOINT
          ? this.videoInfo.OUTPOINT : this.currentTime - this.videoInfo.INPOINT;
      },
      duration() {
        return this.videoInfo.OUTPOINT - this.videoInfo.INPOINT;
      },
      interval() {
        return Math.floor(1000 / this.fps);
      },
      indicatorStyle() {
        return { transform: `translateX(${this.offset}px)` };
      },
      inPointStyle() {
        return { transform: `translateX(${this.inPointOffset}px)` };
      },
      outPointStyle() {
        return { transform: `translateX(${this.outPointOffset}px)` };
      },
      clipRangeStyle() {
        const progressBar = this.getProgressBarStyle();
        const left = this.inPointOffset + 10;
        const right = progressBar.width - this.outPointOffset - 4;
        return { left: `${left}px`, right: `${right}px` };
      },
      isActivePanel() {
        return this.activePanel === 'sourcePanel';
      },
      displayDuration() {
        return secondsToTimeCode(this.duration);
      },
      displayCurrentTime() {
        return secondsToTimeCode(this.innerCurrentTime);
      },
      displayClipDuration() {
        return secondsToTimeCode(this.clipDuration);
      }
    },
    watch: {
      'videoInfo.INPOINT'(val) {
        // this.clipDuration = this.videoInfo.OUTPOINT - this.videoInfo.INPOINT;
        // this.inTime = val;
        this.reset();
      },
      'videoInfo.OUTPOINT'(val) {
        // this.clipDuration = this.videoInfo.OUTPOINT - this.videoInfo.INPOINT;
        // this.outTime = val;
        this.reset();
      },
      videoId(val) {
        this.loading = true;
        this.reset();
        this.videoSource = '';
        this.fromWhere = this.sourceFromWhere;
        this.getStream(val);
        this.getSRTArr(val);
        this.getDetail(val);
      },
      sourceFromWhere(val) {
        this.fromWhere = val;
      },
      videoSnippet(val) {
        this.fileTypeId = val.fileTypeId;
      },
      isActivePanel(val) {
        if (val) {
          if (!this.video.duration) return;
          window.addEventListener('keyup', this.keyup);
          window.addEventListener('keydown', this.keydown);
        } else {
          window.removeEventListener('keyup', this.keyup);
          window.removeEventListener('keydown', this.keydown);
        }
      },
      controller(val) {
        this.controllerList = this.getControllerList(val);
      },
      currentTime(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = (this.currentTime - this.videoInfo.INPOINT) / this.duration * progressBarWidth;
      },
      inTime(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        if (progressBarWidth > 0) {
          this.inPointOffset = (val - this.videoInfo.INPOINT) / this.duration * progressBarWidth - 9;
          if (val <= this.outTime) {
            this.clipDuration = this.outTime - val;
          }
        }
        this.inTimeScreenshot = this.createImage();
      },
      outTime(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        if (progressBarWidth > 0) {
          this.outPointOffset = (val - this.videoInfo.INPOINT) / this.duration * progressBarWidth - 5;
          if (this.inTime <= val) {
            this.clipDuration = val - this.inTime;
          }
        }
      },
      'size.width'(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = (this.video.currentTime - this.videoInfo.INPOINT) / this.duration * progressBarWidth;
        this.inPointOffset = (this.inTime - this.videoInfo.INPOINT) / this.duration * progressBarWidth - 9;
        this.outPointOffset = (this.outTime - this.videoInfo.INPOINT) / this.duration * progressBarWidth - 5;
      }
    },
    mounted() {
      const objectId = this.$route.params.objectId;
      this.fromWhere = this.$route.params.fromWhere;
      if (objectId) {
        this.getStream(objectId);
        this.getSRTArr(objectId);
        this.getDetail(objectId);
      } else {
        this.loading = false;
      }
      this.video = this.$refs.video;
      this.video.addEventListener('waiting', () => {
        this.loading = true;
      });
      this.video.addEventListener('playing', () => {
        this.loading = false;
      });
      this.video.addEventListener('loadedmetadata', () => {
        this.loading = false;
        this.video.currentTime = this.videoInfo.INPOINT;
        this.currentTime = this.video.currentTime;
        if (this.isActivePanel) {
          if (!this.duration) return;
          window.addEventListener('keyup', this.keyup);
          window.addEventListener('keydown', this.keydown);
        } else {
          window.removeEventListener('keyup', this.keyup);
          window.removeEventListener('keydown', this.keydown);
        }
      });
      this.video.addEventListener('loadeddata', () => {
        this.inTimeScreenshot = this.createImage();
      });
    },
    beforeDestroy() {
      if (this.isPlaying) {
        this.video.pause();
      }
    },
    methods: {
      contextMenuStop() {
        return false;
      },
      getDetail(id) {
        api.getObject({ params: { objectid: id, fromWhere: this.fromWhere } }).then((res) => {
          const data = res.data.result;
          const files = data.files;
          const info = this.getDefaultFileInfo(files);
          info.INPOINT = info.INPOINT / this.fps;
          info.OUTPOINT = info.OUTPOINT / this.fps;
          this.videoInfo = info;
          this.fileTypeId = this.videoInfo.FILETYPEID || '';
          this.fileId = info._id || '';

          const detail = data.basic;
          const program = data.detail.program;
          program.forEach((item) => {
            detail[item.key] = item.value;
          });
          this.detail = detail;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream(id) {
        getStreamURL(id, this.fromWhere, (err, url, res) => {
          if (err) {
            this.$message.error(err);
            return;
          }

          this.videoSource = url;
        }, this);
      },
      getFile(id) {

      },
      getSRTArr(id) {
        getSRT(id, this.fromWhere, (err, data, res) => {
          if (err) {
            return;
          }
          this.videoSRT = data;
        }, this);
      },
      reset() {
        this.videoSRTPosition = 0;
        this.currentTime = this.videoInfo.INPOINT;
        this.offset = 0;
        this.isPlaying = false;
        this.isShowInPoint = false;
        this.isShowOutPoint = false;
        this.inPointOffset = -9;
        this.outPointOffset = -5;
        this.inTime = this.videoInfo.INPOINT;
        this.outTime = this.videoInfo.OUTPOINT;
        this.tooltipTimeId = null;
        this.moveIndicatorTimer = null;
        this.moveIndicatorTimeId = null;
        this.updateCurrentTimeTimeId = null;
        this.clipDuration = this.videoInfo.OUTPOINT - this.videoInfo.INPOINT;
      },
      keydown(e) {
        if (e.shiftKey) {
          const keyCode = e.keyCode;
          const keyCodeConfig = {
            73: { name: 'i', fn: this.gotoInPoint },
            79: { name: 'o', fn: this.gotoOutPoint },
            69: { name: 'e', fn: this.screenshot }
          };
          if (keyCodeConfig[keyCode]) {
            keyCodeConfig[keyCode].fn();
          }
        }
      },
      keyup(e) {
        const keyCode = e.keyCode;
        const keyCodeConfig = {
          32: { name: 'space', fn: this.updatePlayerStatus },
          73: { name: 'i', fn: this.markIn },
          79: { name: 'o', fn: this.markOut },
          37: { name: 'left', fn: this.gotoPrevFrame },
          39: { name: 'right', fn: this.gotoNextFrame },
          188: { name: ',', fn: this.insertClip }
        };
        if (keyCodeConfig[keyCode]) {
          keyCodeConfig[keyCode].fn();
        }
      },
      getControllerList(controller) {
        const controllerArr = controller.split(',');
        const list = [];
        const controllerConfig = {
          markIn: {
            name: 'in-point',
            icon: 'icon-in-point',
            tooltip: '标记入点(I)',
            clickFn: this.markIn
          },
          markOut: {
            name: 'out-point',
            icon: 'icon-out-point',
            tooltip: '标记出点(O)',
            clickFn: this.markOut
          },
          gotoInPoint: {
            name: 'goto-in-point',
            icon: 'icon-goto-in-point',
            tooltip: '转到入点(Shift+I)',
            clickFn: this.gotoInPoint
          },
          prevFrame: {
            name: 'prev-frame',
            icon: 'icon-video-prev',
            tooltip: '后退一帧(左侧)',
            clickFn: this.gotoPrevFrame
          },
          play: {
            name: 'play',
            icon: 'icon-play',
            tooltip: '播放-停止切换(Space)',
            clickFn: this.updatePlayerStatus
          },
          nextFrame: {
            name: 'next-frame',
            icon: 'icon-video-next',
            tooltip: '前进一帧(右侧)',
            clickFn: this.gotoNextFrame
          },
          gotoOutPoint: {
            name: 'goto-out-point',
            icon: 'icon-goto-out-point',
            tooltip: '转到出点(Shift+O)',
            clickFn: this.gotoOutPoint
          },
          insert: {
            name: 'insert',
            icon: 'icon-insert',
            tooltip: '插入(,)',
            clickFn: this.insertClip
          },
          camera: {
            name: 'camera',
            icon: 'icon-camera',
            tooltip: '导出帧(Shift+E)',
            clickFn: this.screenshot
          }
        };
        controllerArr.forEach((name) => {
          list.push(controllerConfig[name]);
        });
        return list;
      },
      getProgressBarStyle() {
        const progressBar = this.$refs.progressBar;
        const style = {};
        style.left = progressBar ? progressBar.getBoundingClientRect().left : 0;
        style.width = progressBar ? progressBar.getBoundingClientRect().width : 0;
        if (style.width === 0) {
          style.width = this.size.width - 40;
        }
        return style;
      },
      getControlerIcon(icon, name) {
        if (name === 'play') {
          return this.isPlaying ? 'icon-pause' : 'icon-play';
        }
        return icon;
      },
      gotoInPoint() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        this.video.currentTime = this.inTime;
        this.currentTime = this.inTime;
        this.updateCurrentSRT();
      },
      updateCurrentSRT() {
        if (this.videoSRT.length === 0) return;
        if (this.currentTime < this.videoSRT[0].start) {
          this.videoSRTPosition = 0;
          this.currentVideoSRT = '';
          return;
        }
        for (let i = 0; i < this.videoSRT.length; i++) {
          if (this.videoSRT[i].start <= this.currentTime
            && this.videoSRT[i].end >= this.currentTime) {
            this.videoSRTPosition = i;
            this.currentVideoSRT = this.videoSRT[i].text;
            return;
          }
          if (i > 0
            && this.videoSRT[i - 1].end < this.currentTime
            && this.videoSRT[i].start > this.currentTime) {
            this.videoSRTPosition = i;
            this.currentVideoSRT = '';
            return;
          }
        }
      },
      gotoOutPoint() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        this.video.currentTime = this.outTime;
        this.currentTime = this.outTime;
        this.updateCurrentSRT();
      },
      markIn() {
        if (this.video.currentTime <= this.videoInfo.OUTPOINT
          && this.video.currentTime >= this.videoInfo.OUTPOINT - 1 / this.fps) {
          // 如果currenttime距离结束时间不够一帧
          this.inTime = this.video.currentTime - 1 / this.fps;
          this.outTime = this.video.currentTime;
        } else {
          if (this.outTime === this.video.currentTime && this.outTime > 0) {
            // 如果currenttime为outtime
            if (this.outTime > 1 / this.fps + this.videoInfo.INPOINT) {
              // 如果结束时间距离inpoint大于一帧
              this.inTime = this.video.currentTime - 1 / this.fps;
            } else {
              this.inTime = this.video.currentTime;
              this.outTime = this.video.currentTime + 1 / this.fps;
            }
          } else {
            this.inTime = this.video.currentTime;
          }
        }
        this.isShowOutPoint = true;
        this.isShowInPoint = true;
        if (this.outTime < this.inTime) {
          this.outTime = this.videoInfo.OUTPOINT;
          this.isShowOutPoint = true;
        }
      },
      markOut() {
        if (this.video.currentTime <= 1 / this.fps + this.videoInfo.INPOINT
          && this.video.currentTime >= this.videoInfo.INPOINT) {
          // 如果currenttime距离开始时间不够一帧
          this.inTime = this.video.currentTime;
          this.outTime = this.video.currentTime + 1 / this.fps;
        } else {
          if (this.inTime <= this.video.currentTime + 1 / this.fps
            && this.inTime >= this.video.currentTime - 1 / this.fps) {
            // 如果currenttime为intime
            if (this.inTime < this.videoInfo.OUTPOINT - 1 / this.fps) {
              // 如果开始时间距离outpoint大于一帧
              this.outTime = this.video.currentTime + 1 / this.fps;
            } else {
              this.inTime = this.video.currentTime - 1 / this.fps;
              this.outTime = this.video.currentTime;
            }
          } else {
            this.outTime = this.video.currentTime;
          }
        }
        this.isShowInPoint = true;
        this.isShowOutPoint = true;
        if (this.outTime < this.inTime) {
          this.isShowInPoint = true;
          this.inTime = this.videoInfo.INPOINT;
        }
      },
      updatePlayerStatus() {
        if (!this.isPlaying) {
          // 如果此时为视频的出点时间则暂停播放
          if (this.currentTime <= this.videoInfo.OUTPOINT && this.currentTime + 1 / this.fps >= this.videoInfo.OUTPOINT) {
            this.video.currentTime = this.videoInfo.INPOINT;
          }
          this.play();
          this.isPlaying = true;
          this.moveIndicatorTimer = setInterval(() => {
            this.currentTime = this.video.currentTime;
            if (this.videoSRT.length > 0) {
              if (this.videoSRT[this.videoSRTPosition].start >= this.currentTime - 1 / this.fps
                && this.videoSRT[this.videoSRTPosition].start <= this.currentTime + 1 / this.fps) {
                this.currentVideoSRT = this.videoSRT[this.videoSRTPosition].text;
              } else if (this.videoSRT[this.videoSRTPosition].end >= this.currentTime - 1 / this.fps
                && this.videoSRT[this.videoSRTPosition].end <= this.currentTime + 1 / this.fps) {
                this.videoSRTPosition += 1;
                this.currentVideoSRT = '';
              }
            }
            if (this.currentTime <= this.videoInfo.OUTPOINT && this.currentTime + 1 / this.fps >= this.videoInfo.OUTPOINT) {
              this.pause();
              this.isPlaying = false;
              clearInterval(this.moveIndicatorTimer);
            }

          }, this.interval);
        } else if (this.isPlaying) {
          this.pause();
          this.isPlaying = false;
          clearInterval(this.moveIndicatorTimer);
        }
      },
      gotoPrevFrame() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        if (this.video.currentTime < 1 / this.fps + this.videoInfo.INPOINT) return;
        this.video.currentTime -= 1 / this.fps;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
      },
      gotoNextFrame() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        if (this.video.currentTime > this.videoInfo.OUTPOINT - 1 / this.fps) return;
        this.video.currentTime += 1 / this.fps;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
      },
      play() {
        this.video.play();
      },
      pause() {
        this.video.pause();
      },
      mouseenter(e) {
        const x = e.clientX;
        const progressBar = this.getProgressBarStyle();
        const currentLeft = x - progressBar.left;

        this.tooltipTime = currentLeft / progressBar.width * this.duration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.duration) this.tooltipTime = this.duration;
        this.tooltipText = secondsToTimeCode(this.tooltipTime);
        const tooltip = this.$refs.tooltip;
        const tooltipWidth = tooltip.getBoundingClientRect().width || 80;
        if (currentLeft + tooltipWidth > this.size.width) {
          this.tooltipStyle.left = `${currentLeft - tooltipWidth}px`;
        } else {
          this.tooltipStyle.left = `${currentLeft}px`;
        }
        this.tooltipStyle.display = 'block';
      },
      mousemove(e) {
        this.tooltipTimeId = setTimeout(() => {
          this.mouseenter(e);
        }, 1);
      },
      mouseleave(e) {
        this.tooltipStyle.display = 'none';
      },
      handleProgressBarClick(e) {
        const x = e.clientX;
        const progressBar = this.getProgressBarStyle();
        const currentLeft = x - progressBar.left;
        this.video.currentTime = currentLeft / progressBar.width * this.duration + this.videoInfo.INPOINT;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
      },
      indicatorMousedown(e) {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        document.addEventListener('mousemove', this.bodyMousemoveHandler);
        document.addEventListener('mouseup', this.bodyMouseupHandler);
      },
      bodyMousemoveHandler(e) {
        clearTimeout(this.moveIndicatorTimeId);
        clearTimeout(this.updateCurrentTimeTimeId);
        this.moveIndicatorTimeId = setTimeout(() => {
          const x = e.clientX;
          const progressBar = this.getProgressBarStyle();
          let currentLeft = x - progressBar.left;
          if (x > progressBar.width + progressBar.left) {
            currentLeft = progressBar.width;
          } else if (x < progressBar.left) {
            currentLeft = 0;
          }
          this.offset = currentLeft;
        }, 1);
        this.updateCurrentTimeTimeId = setTimeout(() => {
          const x = e.clientX;
          const progressBar = this.getProgressBarStyle();
          let currentLeft = x - progressBar.left;
          if (x > progressBar.width + progressBar.left) {
            currentLeft = progressBar.width;
          } else if (x < progressBar.left) {
            currentLeft = 0;
          }
          this.video.currentTime = currentLeft / progressBar.width * this.duration + this.videoInfo.INPOINT;
          this.currentTime = this.video.currentTime;
          this.updateCurrentSRT();
        }, this.interval);
      },
      bodyMouseupHandler(e) {
        document.removeEventListener('mousemove', this.bodyMousemoveHandler);
        document.removeEventListener('mouseup', this.bodyMouseupHandler);
      },
      insertClip() {
        const info = {
          objectId: this.videoId || this.$route.params.objectId,
          filetypeid: this.fileTypeId || '',
          title: this.title || this.videoInfo.FILENAME,
          range: [this.inTime, this.outTime],
          duration: this.outTime - this.inTime,
          screenshot: this.inTimeScreenshot,
          fromWhere: this.fromWhere,
          _id: this.fileId,
          detail: this.detail
        };
        this.$emit('insert', info);
      },
      screenshot() {
        this.screenshotURL = this.createImage();
        this.screenshotTitle = (this.title || this.videoInfo.FILENAME) + secondsToTimeCode(this.currentTime - this.videoInfo.INPOINT) + '.png';
        this.imageDialogVisible = true;
      },
      createImage() {
        const canvas = document.createElement('CANVAS');
        const size = {
          width: this.imageSize.width,
          height: this.imageSize.height
        };
        canvas.width = size.width;
        canvas.height = size.height;
        const ctx = canvas.getContext('2d');
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        const imageURL = canvas.toDataURL('image/png');
        return imageURL;
      },
      getDefaultFileInfo(files) {
        const ft = config.getConfig('IVIDEO_EDIT_FILE_TYPE_ID');

        if (files.length === 0) {
          return {};
        }

        if(this.fromWhere !== this.FROM_WHERE.MAM && this.fromWhere !== this.FROM_WHERE.DAYANG){
          for (let j = 0, l = this.UMP_FILETYPE_VALUE.length; j < l; j++) {
            for (let i = 0, len = files.length; i < len; i++) {
              if (files[i].type === this.UMP_FILETYPE_VALUE[j]) {
                return files[i];
              }
            }
          }
        }else {
          for (let j = 0, l = ft.length; j < l; j++) {
            for (let i = 0, len = files.length; i < len; i++) {
              if (files[i].FILETYPEID === ft[j]) {
                return files[i];
              }
            }
          }
        }

        return {};
      },
    }
  };
</script>
