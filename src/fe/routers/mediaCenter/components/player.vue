<template>
  <div class="playerWrap" :class="{'playerBigMode': isFullscreen || mode === 'big'}" ref="playerWrap" :style="isFullscreen ? {} : { height: `${height}px`, width: `${width}px` }">
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
        <div class="volumeBox">
          <i class="iconfont volumeBtn" :class="isMute ? 'icon-mute' : 'icon-volume'" @click="muteBtnClick"></i>
          <div class="volumePanel">
            <div class="volumeSlider" ref="volumeSlider" @click="handleVolumeSliderClick">
              <div class="volumeSliderHandle" :style="volumeSliderHandleStyle"></div>
            </div>
          </div>
        </div>
        <div class="playerTime">{{ displayCurrentTime }} / {{ displayDuration }}</div>
        <i class="rightControl playerBtn iconfont" :class="[isFullscreen ? 'icon-esc-fullscreen' : 'icon-fullscreen']" @click="fullscreen"></i>
      </div>
    </div>
  </div>
</template>
<script>
  import { transformSecondsToStr } from '../../../common/utils';

  const volumeSliderWidth = 38;
  const volumeSliderHandleWidth = 8;

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
      },
      mode: {
        type: String,
        default: 'normal'
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
        isFullscreen: false,
        isMute: false,
        volume: 1,
        volumeSliderWidth: this.mode === 'big' ? volumeSliderWidth * 2 : volumeSliderWidth,
        volumeSliderHandleWidth: this.mode === 'big' ? volumeSliderHandleWidth * 2 : volumeSliderHandleWidth,
        volumeSliderOffset: this.mode === 'big' ? (volumeSliderWidth * 2 - volumeSliderHandleWidth * 2) : (volumeSliderWidth - volumeSliderHandleWidth)
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
      },
      volumeSliderHandleStyle() {
        return { left: `${this.volumeSliderOffset}px` };
      }
    },
    watch: {
      isMute(val) {
        if (val) {
          this.video.volume = 0;
          this.volumeSliderOffset = 0;
        } else {
          this.video.volume = this.volume;
          const tempVolume = this.volume * this.volumeSliderWidth - this.volumeSliderHandleWidth;
          this.volumeSliderOffset = tempVolume < 0 ? 0 : tempVolume;
        }
      },
      volume(val) {
        const tempOffset = val * this.volumeSliderWidth - this.volumeSliderHandleWidth;
        if (tempOffset > this.volumeSliderWidth - this.volumeSliderHandleWidth) {
          this.volumeSliderOffset = this.volumeSliderWidth - this.volumeSliderHandleWidth;
        } else if (tempOffset <= 0) {
          this.volumeSliderOffset = 0;
        } else {
          this.volumeSliderOffset = tempOffset;
        }
      },
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
        if (val) {
          this.volumeSliderWidth = volumeSliderWidth * 2;
          this.volumeSliderHandleWidth = volumeSliderHandleWidth * 2;
        } else {
          this.volumeSliderWidth = volumeSliderWidth;
          this.volumeSliderHandleWidth = volumeSliderHandleWidth;
        }
        if (!this.isMute) {
          const tempVolume = this.volume * this.volumeSliderWidth - this.volumeSliderHandleWidth;
          this.volumeSliderOffset = tempVolume < 0 ? 0 : tempVolume;
        }
        setTimeout(() => {
          const progressBarWidth = this.getProgressBarStyle().width;
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
      muteBtnClick() {
        this.isMute = !this.isMute;
      },
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
      handleVolumeSliderClick(e) {
        const x = e.clientX;
        const volumeSliderRect = this.$refs.volumeSlider.getBoundingClientRect();
        const currentLeft = x - volumeSliderRect.left;

        this.video.volume = currentLeft / this.volumeSliderWidth >= 0
          ? currentLeft / this.volumeSliderWidth : 0;
        this.volume = this.video.volume;
        if (this.volume > 0 && this.isMute) {
          this.isMute = false;
        } else if (this.volume <= 0 && !this.isMute) {
          this.isMute = true;
        }
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
    background: #021120;
    color: #fff;
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
    bottom: 56px;
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
    height: 16px;
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
    bottom: 6px;
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
    top: 1px;
    left: -8px;
    width: 16px;
    height: 16px;
  }
  .progressBarWrap:hover .playerPullIndicator {
    top: 3px;
    left: -4px;
    width: 8px;
    height: 8px;
  }
  .playerBigMode .progressBarWrap:hover .playerPullIndicator {
    top: 1px;
    left: -8px;
    width: 16px;
    height: 16px;
  }
  .controllerWrap {
    height: 24px;
    line-height: 24px;
    background: #021120;
    text-align: left;
  }
  .playerBigMode .controllerWrap {
    height: 40px;
    line-height: 40px;
  }
  .playerBtn {
    display: inline-block;
    width: 36px;
    text-align: center;
    font-size: 12px;
    cursor: pointer;
  }
  .playerBigMode .playerBtn {
    width: 50px;
    text-align: center;
    font-size: 18px;
    cursor: pointer;
  }
  .playerBtn:hover {
    background: #38B1EB;
  }
  .playerTime {
    display: inline-block;
    vertical-align: bottom;
  }
  .playerBigMode .playerTime {
    font-size: 14px;
    line-height: 44px;
  }
  .leftControl {
    float: left;
  }
  .rightControl {
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
  .volumeBox {
    height: 100%;
    display: inline-block;
  }
  .volumeBox .volumeBtn {
    display: inline-block;
    height: 100%;
    font-size: 12px;
    cursor: pointer;
  }
  .playerBigMode .volumeBtn {
    font-size: 18px;
  }
  .volumeBox:hover .volumePanel {
    width: 38px;
    margin: 0 8px;
  }
  .playerBigMode .volumeBox:hover .volumePanel {
    width: 76px;
  }
  .volumePanel {
    display: inline-block;
    width: 0;
    vertical-align: top;
    height: 100%;
    cursor: pointer;
    transition: margin .2s cubic-bezier(0.4,0.0,1,1),width .2s cubic-bezier(0.4,0.0,1,1);
  }
  .volumeSlider {
    position: relative;
    height: 100%;
    overflow: hidden;
  }
  .volumeSliderHandle {
    position: absolute;
    top: 50%;
    width: 8px;
    height: 8px;
    margin-top: -4px;
    border-radius: 50%;
    background: #fff;
  }
  .playerBigMode .volumeSliderHandle {
    width: 16px;
    height: 16px;
    margin-top: -8px;
  }
  .volumeSliderHandle:before,
  .volumeSliderHandle:after {
    content: '';
    position: absolute;
    display: block;
    top: 50%;
    height: 2px;
    margin-top: -1px;
    width: 38px;
  }
  .playerBigMode .volumeSliderHandle:before,
  .playerBigMode .volumeSliderHandle:after {
    width: 76px;
  }
  .volumeSliderHandle:before {
    left: -38px;
    background: #38B1EB;
  }
  .playerBigMode .volumeSliderHandle:before {
    left: -76px;
  }
  .volumeSliderHandle:after {
    left: 4px;
    background: #F2F2F2;
  }
  .playerBigMode .volumeSliderHandle:after {
    left: 8px;
  }
</style>
