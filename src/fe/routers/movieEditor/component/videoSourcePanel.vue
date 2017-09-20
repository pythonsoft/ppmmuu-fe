<template>
  <div
    :class="['video-source-wrap', {'active-panel':isActivePanel}]"
    @click="()=>{this.$emit('update:activePanel', 'sourcePanel')}">
    <div class="video-source-title">{{ `源：${title || videoInfo.FILENAME || '素材名称'} ${displayDuration}` }}</div>
    <div class="video-source-box">
      <video :src="videoSource" ref="video" :style="{ width: '100%', height: '100%' }"></video>
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
  import { getStreamURL, getSRT, transformSecondsToStr } from '../../../common/utils';

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
      videoId: {
        type: String,
        default: ''
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
        default: 'inPoint,outPoint,gotoInPoint,prevFrame,play,nextFrame,gotoOutPoint,insert,camera'
      }
    },
    data() {
      return {
        currentTime: 0,
        duration: 0,
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
          INPOINT: '',
          OUTPOINT: ''
        }
      };
    },
    computed: {
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
        return transformSecondsToStr(this.duration);
      },
      displayCurrentTime() {
        return transformSecondsToStr(this.currentTime);
      },
      displayClipDuration() {
        return transformSecondsToStr(this.clipDuration);
      }
    },
    watch: {
      videoId(val) {
        this.getStream(val);
        this.getSRTArr(val);
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
      inTime(val) {
        this.inTimeScreenshot = this.createImage();
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        if (progressBarWidth > 0) {
          this.inPointOffset = val / this.video.duration * progressBarWidth - 9;
          if (val <= this.outTime) {
            this.clipDuration = this.outTime - val;
          }
        }
      },
      outTime(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        if (progressBarWidth > 0) {
          this.outPointOffset = val / this.video.duration * progressBarWidth - 5;
          if (this.inTime <= val) {
            this.clipDuration = val - this.inTime;
          }
        }
      },
      'size.width'(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
        this.inPointOffset = this.inTime / this.video.duration * progressBarWidth - 9;
        this.outPointOffset = this.outTime / this.video.duration * progressBarWidth - 5;
      }
    },
    mounted() {
      if (this.$route.params.objectId) {
        this.getStream(this.$route.params.objectId);
        this.getSRTArr(this.$route.params.objectId);
      }
      this.video = this.$refs.video;
      this.video.addEventListener('loadedmetadata', () => {
        this.clipDuration = this.video.duration;
        this.duration = this.video.duration;
        this.outTime = this.video.duration;
      });
      this.video.addEventListener('loadeddata', () => {
        this.inTimeScreenshot = this.createImage();
      });
      if (this.isActivePanel) {
        if (!this.video.duration) return;
        window.addEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
      } else {
        window.removeEventListener('keyup', this.keyup);
        window.removeEventListener('keydown', this.keydown);
      }
    },
    methods: {
      getStream(id) {
        getStreamURL(id, (err, url, res) => {
          if (err) {
            this.$message.error(err);
            return;
          }

          this.videoSource = url;
          this.videoInfo = res.result;
        }, this);
      },
      getSRTArr(id) {
        getSRT(id, (err, data, res) => {
          if (err) {
            return;
          }
          this.videoSRT = data;
        }, this);
      },
      reset() {
        this.videoSRTPosition = 0;
        this.currentTime = 0;
        this.offset = 0;
        this.isPlaying = false;
        this.isShowInPoint = false;
        this.isShowOutPoint = false;
        this.inPointOffset = -9;
        this.outPointOffset = -5;
        this.inTime = 0;
        this.outTime = 0;
        this.tooltipTimeId = null;
        this.moveIndicatorTimer = null;
        this.moveIndicatorTimeId = null;
        this.updateCurrentTimeTimeId = null;
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
          inPoint: { name: 'in-point', icon: 'icon-in-point', tooltip: '标记入点(I)', clickFn: this.markIn },
          outPoint: { name: 'out-point', icon: 'icon-out-point', tooltip: '标记出点(O)', clickFn: this.markOut },
          gotoInPoint: { name: 'goto-in-point', icon: 'icon-goto-in-point', tooltip: '转到入点(Shift+I)', clickFn: this.gotoInPoint },
          prevFrame: { name: 'prev-frame', icon: 'icon-video-prev', tooltip: '后退一帧(左侧)', clickFn: this.gotoPrevFrame },
          play: { name: 'play', icon: 'icon-play', tooltip: '播放-停止切换(Space)', clickFn: this.updatePlayerStatus },
          nextFrame: { name: 'next-frame', icon: 'icon-video-next', tooltip: '前进一帧(右侧)', clickFn: this.gotoNextFrame },
          gotoOutPoint: { name: 'goto-out-point', icon: 'icon-goto-out-point', tooltip: '转到出点(Shift+O)', clickFn: this.gotoOutPoint },
          insert: { name: 'insert', icon: 'icon-insert', tooltip: '插入(,)', clickFn: this.insertClip },
          camera: { name: 'camera', icon: 'icon-camera', tooltip: '导出帧(Shift+E)', clickFn: this.screenshot }
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
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
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
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
      },
      markIn() {
        if (this.video.currentTime <= this.video.duration
          && this.video.currentTime >= this.video.duration - 1 / this.fps) {
          this.inTime = this.video.currentTime - 1 / this.fps;
          this.outTime = this.video.currentTime;
        } else {
          if (this.outTime === this.video.currentTime && this.outTime > 0) {
            if (this.outTime > 1 / this.fps) {
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
          this.outTime = this.video.duration;
          this.isShowOutPoint = true;
        }
      },
      markOut() {
        if (this.video.currentTime <= 1 / this.fps
          && this.video.currentTime >= 0) {
          this.inTime = this.video.currentTime;
          this.outTime = this.video.currentTime + 1 / this.fps;
        } else {
          if (this.inTime <= this.video.currentTime + 1 / this.fps
            && this.inTime >= this.video.currentTime - 1 / this.fps) {
            if (this.inTime < this.video.duration - 1 / this.fps) {
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
          this.inTime = 0;
        }
      },
      updatePlayerStatus() {
        if (!this.isPlaying) {
          this.play();
          this.isPlaying = true;
          this.moveIndicatorTimer = setInterval(() => {
            const progressBar = this.getProgressBarStyle();
            const progressBarWidth = progressBar.width;
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
            if (this.currentTime === this.video.duration) {
              this.isPlaying = false;
              clearInterval(this.moveIndicatorTimer);
            }
            this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
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
        if (this.video.currentTime < 1 / this.fps) return;
        this.video.currentTime -= 1 / this.fps;
        this.currentTime = this.video.currentTime;
        // this.video.currentTime = this.currentTime;
        this.updateCurrentSRT();
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
      },
      gotoNextFrame() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        if (this.video.currentTime > this.video.duration - 1 / this.fps) return;
        this.video.currentTime += 1 / this.fps;
        this.currentTime = this.video.currentTime;
        // this.video.currentTime = this.currentTime;
        this.updateCurrentSRT();
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
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

        this.tooltipTime = currentLeft / progressBar.width * this.video.duration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.video.duration) this.tooltipTime = this.video.duration;
        this.tooltipText = transformSecondsToStr(this.tooltipTime);
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
        this.offset = currentLeft;
        this.video.currentTime = currentLeft / progressBar.width * this.video.duration;
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
          this.video.currentTime = currentLeft / progressBar.width * this.video.duration;
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
          title: this.title || this.videoInfo.FILENAME,
          range: [this.inTime, this.outTime],
          duration: this.outTime - this.inTime,
          screenshot: this.inTimeScreenshot
        };
        this.$emit('insert', info);
      },
      screenshot() {
        this.screenshotURL = this.createImage();
        this.screenshotTitle = this.title + transformSecondsToStr(this.currentTime);
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
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        const imageURL = canvas.toDataURL('image/png');
        return imageURL;
      }
    }
  };
</script>
