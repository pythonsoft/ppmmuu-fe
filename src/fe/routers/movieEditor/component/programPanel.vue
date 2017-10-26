<template>
  <div
    :class="['video-source-wrap', {'active-panel':isActivePanel}]"
    @click="()=>{this.$emit('update:activePanel', 'programPanel')}">
    <div class="video-source-title">{{ `素材：${title || '素材名称'} ${displayDuration}` }}</div>
    <div class="video-source-box">
      <video @contextmenu.prevent="contextMenuStop" :src="videoSource" ref="video" :style="{ width: '100%', height: '100%' }" crossorigin="anonymous"></video>
    </div>
    <div class="video-source-bottom">
      <div v-if="innerDuration===0" class="player-mask"></div>
      <div class="player-time-box clearfix">
        <span :style="{float: 'left'}">{{ displayCurrentTime }}</span>
        <span :style="{float: 'right'}">{{ displayDuration }}</span>
      </div>
      <div
        v-show="innerDuration > 0"
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
  import { transformSecondsToStr, getStreamURL } from '../../../common/utils';

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
      range: {
        type: Array,
        default() {
          return [0, 0];
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
        default: 'play,camera'
      }
    },
    data() {
      return {
        currentTime: this.range[0],
        controllerList: this.getControllerList(this.controller),
        offset: 0,
        isPlaying: false,
        moveIndicatorTimer: null,
        tooltipTimeId: null,
        tooltipStyle: { display: 'none' },
        tooltipTime: 0,
        tooltipText: '00:00:00:00',
        moveIndicatorTimeId: null,
        updateCurrentTimeTimeId: null,
        imageDialogVisible: false,
        screenshotURL: '',
        screenshotTitle: '',
        videoSource: ''
      };
    },
    computed: {
      interval() {
        return Math.floor(1000 / this.fps);
      },
      indicatorStyle() {
        return { transform: `translateX(${this.offset}px)` };
      },
      innerCurrentTime() {
        return this.currentTime - this.range[0] > this.range[1]
          ? this.range[1] : this.currentTime - this.range[0];
      },
      innerDuration() {
        return this.range[1] - this.range[0];
      },
      isActivePanel() {
        return this.activePanel === 'programPanel';
      },
      displayDuration() {
        return transformSecondsToStr(this.innerDuration);
      },
      displayCurrentTime() {
        return transformSecondsToStr(this.innerCurrentTime);
      }
    },
    watch: {
      range(val) {
        this.currentTime = val[0];
        this.video.currentTime = this.currentTime;
        this.offset = 0;
      },
      videoId(val) {
        this.getStream(val);
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
      'size.width'(val) {
        const progressBar = this.getProgressBarStyle();
        const progressBarWidth = progressBar.width;
        this.offset = this.video.innerCurrentTime / this.innerDuration * progressBarWidth;
      }
    },
    mounted() {
      this.video = this.$refs.video;
      this.video.addEventListener('loadedmetadata', () => {
        this.video.currentTime = this.currentTime;
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
    beforeDestroy() {
      if (this.isPlaying) {
        this.video.pause();
      }
    },
    methods: {
      contextMenuStop() {
        return false;
      },
      getStream(id) {
        getStreamURL(id, (err, url) => {
          if (err) {
            this.$message.error(err);
            return;
          }

          this.videoSource = url;
        }, this);
      },
      reset() {
        this.currentTime = this.range[0];
        this.offset = 0;
        this.isPlaying = false;
        this.tooltipTimeId = null;
        this.moveIndicatorTimer = null;
        this.moveIndicatorTimeId = null;
        this.updateCurrentTimeTimeId = null;
      },
      keydown(e) {
        if (e.shiftKey) {
          const keyCode = e.keyCode;
          const keyCodeConfig = {
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
          32: { name: 'space', fn: this.updatePlayerStatus }
        };
        if (keyCodeConfig[keyCode]) {
          keyCodeConfig[keyCode].fn();
        }
      },
      getControllerList(controller) {
        const controllerArr = controller.split(',');
        const list = [];
        const controllerConfig = {
          play: {
            name: 'play',
            icon: 'icon-play',
            tooltip: '播放-停止切换(Space)',
            clickFn: this.updatePlayerStatus
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
      updatePlayerStatus() {
        if (!this.isPlaying) {
          this.play();
          this.isPlaying = true;
          this.moveIndicatorTimer = setInterval(() => {
            const progressBar = this.getProgressBarStyle();
            const progressBarWidth = progressBar.width;
            this.currentTime = this.video.currentTime;
            if (this.currentTime >= this.range[1]) {
              this.isPlaying = false;
              this.pause();
              clearInterval(this.moveIndicatorTimer);
            }
            this.offset = (this.video.currentTime - this.range[0])
              / this.innerDuration * progressBarWidth;
            if (this.offset > progressBarWidth) this.offset = progressBarWidth;
          }, this.interval);
        } else if (this.isPlaying) {
          this.pause();
          this.isPlaying = false;
          clearInterval(this.moveIndicatorTimer);
        }
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

        this.tooltipTime = currentLeft / progressBar.width * this.innerDuration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.innerDuration) this.tooltipTime = this.innerDuration;
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
        this.video.currentTime = currentLeft / progressBar.width * this.innerDuration + this.range[0];
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
          this.video.currentTime = currentLeft / progressBar.width * this.innerDuration
            + this.range[0];
          this.currentTime = this.video.currentTime;
        }, this.interval);
      },
      bodyMouseupHandler(e) {
        document.removeEventListener('mousemove', this.bodyMousemoveHandler);
        document.removeEventListener('mouseup', this.bodyMouseupHandler);
      },
      screenshot() {
        this.screenshotURL = this.createImage();
        this.screenshotTitle = this.title + transformSecondsToStr(this.innerCurrentTime);
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
