<template>
  <div
    :class="['material-panel-wrap', {'active-panel':isActivePanel}]" ref="wrap">
    <div class="material-panel-title">{{ title }}</div>
    <div class="material-panel-box">
      <video :src="videoSource" ref="video" :style="{ width: '100%', height: '100%' }"></video>
    </div>
    <div class="material-panel-bottom">
      <div class="player-time-box clearfix">
        <span :style="{float: 'left'}">{{ formatTime(currentTime) }}</span>
        <span :style="{float: 'right'}">{{ formatTime(clipDuration) }}</span>
      </div>
      <div
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
        <a class="iconfont icon-download screenshot-download-icon" :href="screenshotURL" :download="title"></a>
      </div>
    </fj-dialog>
  </div>
</template>
<script>
  export default {
    props: {
      isActivePanel: Boolean,
      imageSize: {
        type: Object,
        default() {
          return { width: 640, height: 360 };
        }
      },
      title: {
        type: String,
        default: '素材名称'
      },
      videoSource: {
        type: String,
        default: '../../../img/premiere.mp4'
      },
      size: {
        type: Object,
        default() {
          return { width: 0, height: 0 };
        }
      },
      fps: {
        type: Number,
        default: 60
      },
      controller: {
        type: String,
        default: 'inPoint,outPoint,gotoInPoint,prevFrame,play,nextFrame,gotoOutPoint,insert,camera'
      }
    },
    data() {
      return {
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
        tooltipTimeId: null,
        tooltipStyle: { display: 'none' },
        tooltipTime: 0,
        tooltipText: '00:00:00:00',
        moveIndicatorTimeId: null,
        updateCurrentTimeTimeId: null,
        imageDialogVisible: false,
        screenshotURL: ''
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
      }
    },
    watch: {
      isActivePanel(val) {
        if (val) {
          window.addEventListener('keyup', this.keyup);
          window.addEventListener('keydown', this.keydown);
        } else {
          window.removeEventListener('keyup', this.keyup);
        }
      },
      controller(val) {
        this.controllerList = this.getControllerList(val);
      },
      inTime(val) {
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
      this.video = this.$refs.video;
      this.video.addEventListener('loadedmetadata', () => {
        this.clipDuration = this.video.duration;
        this.outTime = this.video.duration;
      });
      if (this.isActivePanel) {
        window.addEventListener('keyup', this.keyup);
        window.addEventListener('keydown', this.keydown);
      } else {
        window.removeEventListener('keyup', this.keyup);
      }
    },
    methods: {
      reset() {
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
          73: { name: 'i', fn: this.updateInPoint },
          79: { name: 'o', fn: this.updateOutPoint },
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
          inPoint: { name: 'in-point', icon: 'icon-in-point', tooltip: '标记入点(I)', clickFn: this.updateInPoint },
          outPoint: { name: 'out-point', icon: 'icon-out-point', tooltip: '标记出点(O)', clickFn: this.updateOutPoint },
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
        return style;
      },
      formatTime(second) {
        const hours = Math.floor(second / (60 * 60));
        second %= (60 * 60);
        const minutes = Math.floor(second / 60);
        second %= 60;
        let seconds = Math.floor(second);
        // const frame = Math.floor((second % 1) * this.fps)
        let frame = (second % 1) * this.fps;
        frame = frame % 1 > 0.9 ? frame + 1 : frame;
        frame = Math.floor(frame);

        seconds = this.fillUpZero(seconds);
        frame = this.fillUpZero(frame);
        return `${this.fillUpZero(hours)}:${this.fillUpZero(minutes)}:${seconds}:${frame}`;
      },
      fillUpZero(v) {
        return v < 10 ? `0${v}` : v;
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
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
      },
      gotoOutPoint() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        this.video.currentTime = this.outTime;
        this.currentTime = this.outTime;
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
      },
      updateInPoint() {
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
      updateOutPoint() {
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
            if (this.currentTime === this.video.duration) {
              this.isPlaying = false;
              clearInterval(this.timer);
            }
            this.offset = this.video.currentTime / this.video.duration * progressBarWidth;
          }, this.interval);
        } else if (this.isPlaying) {
          this.pause();
          this.isPlaying = false;
          clearInterval(this.timer);
        }
      },
      gotoPrevFrame() {
        if (this.isPlaying) {
          this.updatePlayerStatus();
        }
        if (this.video.currentTime < 1 / this.fps) return;
        this.video.currentTime -= 1 / this.fps;
        this.currentTime = this.video.currentTime;
        this.video.currentTime = this.currentTime;
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
        this.video.currentTime = this.currentTime;
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
        this.tooltipText = this.formatTime(this.tooltipTime);
        const tooltip = this.$refs.tooltip;
        const tooltipWidth = tooltip.getBoundingClientRect().width || 80;
        if (x + tooltipWidth > this.size.width) {
          this.tooltipStyle.left = `${currentLeft - tooltipWidth}px`;
        } else {
          this.tooltipStyle.left = `${currentLeft}px`;
        }
        this.tooltipStyle.display = 'block';
      },
      mousemove(e) {
        clearTimeout(this.timeId);
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
        }, this.interval);
      },
      bodyMouseupHandler(e) {
        document.removeEventListener('mousemove', this.bodyMousemoveHandler);
        document.removeEventListener('mouseup', this.bodyMouseupHandler);
      },
      insertClip() {
        this.$emit('insert', [this.inTime, this.outTime]);
      },
      screenshot() {
        const canvas = document.createElement('CANVAS');
        canvas.width = this.imageSize.width;
        canvas.height = this.imageSize.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(this.video, 0, 0, canvas.width, canvas.height);
        const imageURL = canvas.toDataURL('image/png');
        // this.downloadScreenshot(imageURL);
        this.screenshotURL = imageURL;
        this.imageDialogVisible = true;
      }
    },
    components: {
    }
  };
</script>
