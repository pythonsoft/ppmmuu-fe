<template>
  <div class="playerWrap" :class="{'playerBigMode': isFullscreen}" ref="playerWrap" :style="isFullscreen ? {} : { height: `${height}px`, width: `${width}px` }">
    <div class="videoBox">
      <video :style="{display: 'block', width: '100%', height: '100%'}" ref="video" :src="url"></video>
    </div>
    <div class="playerBottom">
      <div
        class="progressBarWrap"
        @mouseenter="mouseenter"
        @mousemove="mousemove"
        @mouseleave="mouseleave"
        @click="handleProgressBarClick">
        <div class="progressBarList" ref="progressBar">
          <div v-show="isShowHoverProgress" class="hoverProgress" :style="hoverProgressStyle"></div>
          <div class="playProgress" :style="playProgressStyle"></div>
        </div>
        <div class="playerPullIndicator" :style="indicatorStyle" @mousedown="indicatorMousedown"></div>
        <div class="playerTooltip" :style="tooltipStyle" ref="tooltip">
          <div class="playerTooltipText">
            {{ tooltipText }}
          </div>
        </div>
      </div>
      <div class="controllerWrap clearfix">
        <i class="iconfont playerBtn" :class="[isPlaying ? 'icon-pause' : 'icon-play']" @click="updatePlayerStatus"></i>
        <div class="playerTime">{{ displayCurrentTime }} / {{ displayDuration }}</div>
        <i class="right-control playerBtn iconfont" :class="[isFullscreen ? 'icon-esc-fullscreen' : 'icon-fullscreen']" @click="fullscreen"></i>
      </div>
    </div>
  </div>
</template>
<script>
  import { transformSecondsToStr } from '../../../common/utils';

  export default {
    props: {
      url: String,
      streamInfo: {
        type: Object,
        default() {
          return {
            INPOINT: 0,
            OUTPOINT: 0
          };
        }
      },
      height: Number,
      width: Number,
      fps: {
        type: Number,
        default: 25
      }
    },
    data() {
      return {
        isPlaying: false,
        moveIndicatorTimer: null,
        progressBarHoverTimer: null,
        moveIndicatorTimeId: null,
        updateCurrentTimeTimeId: null,
        currentTime: 0,
        duration: 0,
        indicatorOffset: 0,
        playProgressPercent: 0,
        hoverProgressPercent: 0,
        isShowHoverProgress: false,
        tooltipStyle: { display: 'none' },
        tooltipTime: 0,
        tooltipText: '00:00:00',
        isFullscreen: false
      };
    },
    computed: {
      interval() {
        return Math.floor(1000 / this.fps);
      },
      displayCurrentTime() {
        return transformSecondsToStr(this.currentTime, 'HH:mm:ss');
      },
      displayDuration() {
        return transformSecondsToStr(this.duration, 'HH:mm:ss');
      },
      indicatorStyle() {
        return { transform: `translateX(${this.indicatorOffset}px)` };
      },
      playProgressStyle() {
        return { transform: `scaleX(${this.playProgressPercent})` };
      },
      hoverProgressStyle() {
        return { transform: `scaleX(${this.hoverProgressPercent})` };
      }
    },
    watch: {
      streamInfo(val) {
        this.video.currentTime = val.INPOINT / 1000;
        this.currentTime = this.video.currentTime;
      },
      currentTime(val) {
        const progressBarWidth = this.getProgressBarStyle().width;
        this.indicatorOffset = val / this.video.duration * progressBarWidth;
        this.playProgressPercent = val / this.video.duration;
      },
      isFullscreen(val) {
        setTimeout(() => {
          let progressBarWidth = this.getProgressBarStyle().width;
          this.indicatorOffset = this.video.currentTime / this.video.duration * progressBarWidth;
          this.playProgressPercent = this.video.currentTime / this.video.duration;
        }, 500);
      }
    },
    mounted() {
      this.video = this.$refs.video;
      this.video.addEventListener('loadedmetadata', () => {
        this.duration = this.video.duration;
        this.video.currentTime = this.streamInfo.INPOINT / 1000;
        this.currentTime = this.video.currentTime;
      });
      document.addEventListener('fullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('mozfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('webkitfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('msfullscreenchange', this.fullscreenchangeListener, false);
    },
    beforDestroy() {
      document.removeEventListener('fullscreenchange', this.fullscreenchangeListener);
      document.addEventListener('mozfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('webkitfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('msfullscreenchange', this.fullscreenchangeListener, false);
    },
    methods: {
      getProgressBarStyle() {
        const progressBar = this.$refs.progressBar;
        const style = {};
        const rect = progressBar.getBoundingClientRect();
        style.left = progressBar ? rect.left : 0;
        style.width = progressBar ? rect.width : 0;
        if (style.width === 0) {
          style.width = this.width;
        }
        return style;
      },
      updatePlayerStatus() {
        if (!this.isPlaying) {
          this.play();
          this.isPlaying = true;
          this.moveIndicatorTimer = setInterval(() => {
            this.indicatorMover();
          }, this.interval);
        } else if (this.isPlaying) {
          this.pause();
          this.isPlaying = false;
          clearInterval(this.moveIndicatorTimer);
        }
      },
      indicatorMover() {
        // const progressBarWidth = this.getProgressBarStyle().width;
        this.currentTime = this.video.currentTime;
        if (this.currentTime === this.video.duration) {
          this.isPlaying = false;
          clearInterval(this.moveIndicatorTimer);
        }
        // this.indicatorOffset = this.video.currentTime / this.video.duration * progressBarWidth;
        // this.playProgressPercent = this.video.currentTime / this.video.duration;
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

        this.isShowHoverProgress = true;
        this.hoverProgressPercent = currentLeft / progressBar.width;
        this.tooltipTime = currentLeft / progressBar.width * this.video.duration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.video.duration) this.tooltipTime = this.video.duration;
        this.tooltipText = transformSecondsToStr(this.tooltipTime, 'HH:mm:ss');
        const tooltip = this.$refs.tooltip;
        const tooltipWidth = tooltip.getBoundingClientRect().width || 59;
        if (currentLeft + tooltipWidth > this.width) {
          this.tooltipStyle.left = `${currentLeft - tooltipWidth}px`;
        } else {
          this.tooltipStyle.left = `${currentLeft}px`;
        }
        this.tooltipStyle.display = 'block';
      },
      mousemove(e) {
        this.progressBarHoverTimer = setTimeout(() => {
          this.mouseenter(e);
        }, 1);
      },
      mouseleave(e) {
        this.isShowHoverProgress = false;
        this.tooltipStyle.display = 'none';
      },
      handleProgressBarClick(e) {
        const x = e.clientX;
        const progressBar = this.getProgressBarStyle();
        const currentLeft = x - progressBar.left;
        // this.indicatorOffset = currentLeft;
        // this.playProgressPercent = currentLeft / progressBar.width;
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
          this.playProgressPercent = currentLeft / progressBar.width;
          this.indicatorOffset = currentLeft;
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
      fullscreen() {
        this.toggleFullscreen(this.$refs.playerWrap);
      },
      fullscreenchangeListener(e) {
        const fullscreenElement = document.fullscreenElement
        || document.mozFullScreenElement
        || document.webkitFullscreenElement
        || document.msFullscreenElement;
        if (fullscreenElement) {
          this.isFullscreen = true;
        } else {
          this.isFullscreen = false;
        }
      },
      toggleFullscreen(element) {
        const fullscreenElement = document.fullscreenElement
          || document.mozFullScreenElement
          || document.webkitFullscreenElement
          || document.msFullscreenElement;
        if (!fullscreenElement) {
          if (element.requestFullscreen) {
            element.requestFullscreen();
          } else if (element.webkitRequestFullScreen) {
            element.webkitRequestFullScreen();
          } else if (element.mozRequestFullScreen) {
            element.mozRequestFullScreen();
          } else if (element.msRequestFullscreen) {
            element.msRequestFullscreen();
          }
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          } else if (document.webkitExitFullscreen) {
            document.webkitExitFullscreen();
          } else if (document.mozCancelFullScreen) {
            document.mozCancelFullScreen();
          } else if (document.msExitFullscreen) {
            document.msExitFullscreen();
          }
        }
      }
    }
  };
</script>
<style>
  .playerWrap {
    position: relative;
  }
  .playerWrap:-webkit-full-screen {
    width: 100%;
    height: 100%;
  }
  .videoBox {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 36px;
  }
  .playerBigMode .videoBox {
    bottom: 86px;
  }
  .playerBottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .progressBarWrap {
    position: relative;
    height: 12px;
    background: #021120;
    cursor: pointer;
  }
  .playerBigMode .progressBarWrap {
    height: 42px;
  }
  .progressBarList {
    position: absolute;
    right: 0;
    bottom: 4px;
    left: 0;
    height: 2px;
    width: 100%;
    background: rgba(204, 204, 204, .5);
  }
  .playerBigMode .progressBarList {
    bottom: 18px;
    height: 4px;
  }
  .playProgress {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    background: #38B1EB;
    transform-origin: 0 0;
  }
  .hoverProgress {
    left: 0;
    width: 100%;
    position: absolute;
    bottom: 0;
    height: 100%;
    background: rgba(244, 244, 244, .3);
    transform-origin: 0 0;
  }
  .playerPullIndicator {
    position: absolute;
    top: 4px;
    left: -3px;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
  .playerBigMode .playerPullIndicator {
    top: 12px;
    left: -6px;
    width: 18px;
    height: 18px;
  }
  .progressBarWrap:hover .playerPullIndicator {
    top: 4px;
    left: -4px;
    width: 8px;
    height: 8px;
  }
  .playerBigMode .progressBarWrap:hover .playerPullIndicator {
    top: 12px;
    left: -6px;
    width: 18px;
    height: 18px;
  }
  .controllerWrap {
    height: 24px;
    line-height: 24px;
    background: #021120;
    text-align: left;
  }
  .playerBigMode .controllerWrap {
    height: 44px;
    line-height: 44px;
  }
  .playerBtn {
    display: inline-block;
    width: 36px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }
  .playerBigMode .playerBtn {
    width: 66px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }
  .playerBtn:hover {
    background: #38B1EB;
  }
  .playerTime {
    display: inline-block;
  }
  .playerBigMode .playerTime {
    font-size: 14px;
    line-height: 44px;
  }
  .right-control {
    float: right;
  }
  .playerTooltip {
    position: absolute;
    top: -28px;
    z-index: 10;
  }
  .playerTooltipText {
    background: #021120;
    border-radius: 2px;
    font-size: 12px;
    color: #CED9E5;
    padding: 0 6px;
    line-height: 22px;
    white-space: nowrap;
  }
</style>
