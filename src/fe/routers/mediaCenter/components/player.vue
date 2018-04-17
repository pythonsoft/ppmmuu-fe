<template>
  <div class="playerWrap" :class="{'playerBigMode': isFullscreen || mode === 'big'}" ref="playerWrap" :style="isFullscreen ? {} : { height: `${height}px`, width: `${width}px` }">
    <div class="videoLoadingMask" v-if="loading"></div>
    <div class="videoBox">
      <video @contextmenu.prevent="contextMenuStop" :style="{display: 'block', width: '100%', height: '100%'}" ref="video" :src="url" crossorigin="anonymous"></video>
      <div v-show="currentVideoSRT" class="video-srt">
        <span class="video-srt-text">{{ currentVideoSRT }}</span>
      </div>
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
  import { transformSecondsToStr, getSRT } from '../../../common/utils';
  import './player.css';

  const volumeSliderWidth = 38;
  const volumeSliderHandleWidth = 8;

  export default {
    props: {
      // 用于控制重置内部状态，以及获取字幕
      videoId: {
        type: String,
        default: ''
      },
      // 视频资源
      url: String,
      streamInfo: {
        type: Object,
        default() {
          return {
            INPOINT: 0,// 单位为帧
            OUTPOINT: 0
          };
        }
      },
      fromWhere: {
        type: String,
        default: 'MAM'
      },
      height: Number,
      width: Number,
      fps: {
        type: Number,
        default: 25
      },
      // 尺寸有 normal 和 big
      mode: {
        type: String,
        default: 'normal'
      }
    },
    data() {
      return {
        INPOINT: this.streamInfo.INPOINT / this.fps || 0,
        OUTPOINT: this.streamInfo.OUTPOINT / this.fps || 0,
        loading: true,
        videoSRT: [],
        videoSRTPosition: 0,// 当前字幕在 videoSRT 中的索引值
        currentVideoSRT: '',
        isPlaying: false,
        moveIndicatorTimer: null,// 控制器随播放时间而变化的intervalID
        progressBarHoverTimer: null,
        moveIndicatorTimeId: null,// 鼠标拖拽控制器时进度条和控制器位置变化的timeoutID
        updateCurrentTimeTimeId: null,// 鼠标拖拽控制器时currentTime变化的timeoutID
        currentTime: 0,
        duration: (this.streamInfo.OUTPOINT - this.streamInfo.INPOINT) / this.fps,
        indicatorOffset: 0,// 控制器位移值
        playProgressPercent: 0,// 播放进度(0~1之间)
        hoverProgressPercent: 0,// 鼠标悬停的位置(0~1之间)
        isShowHoverProgress: false,
        tooltipStyle: { display: 'none' },// 提示时间的样式(left值将会改变)
        tooltipTime: 0,
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
        // 改变进度条状态的时间间隔
        return Math.floor(1000 / this.fps);
      },
      displayCurrentTime() {
        return transformSecondsToStr(this.innerCurrentTime, 'HH:mm:ss');
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
      },
      innerCurrentTime() {
        return this.currentTime - this.INPOINT > this.OUTPOINT
          ? this.OUTPOINT : this.currentTime - this.INPOINT;
      },
      tooltipText() {
        return transformSecondsToStr(this.tooltipTime, 'HH:mm:ss');
      }
    },
    watch: {
      videoId(val) {
        this.reset();
        this.getSRTArr(val);
      },
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
        // 视频的长度是由入出点决定的，该入出点由getStream接口返回
        this.INPOINT = val.INPOINT / this.fps;
        this.OUTPOINT = val.OUTPOINT / this.fps;
        this.reset();
        this.video.currentTime = val.INPOINT / this.fps;
        // this.currentTime = this.video.currentTime;
        // this.duration = (val.OUTPOINT - val.INPOINT) / this.fps;
        this.updateCurrentSRT();
      },
      currentTime(val) {
        const progressBarWidth = this.getProgressBarStyle().width;
        this.indicatorOffset = (val - this.INPOINT) / this.duration * progressBarWidth;
        this.playProgressPercent = (val - this.INPOINT) / this.duration;
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
          this.indicatorOffset = this.innerCurrentTime / this.duration * progressBarWidth;
          this.playProgressPercent = this.innerCurrentTime / this.duration;
        }, 500);
      }
    },
    mounted() {
      this.video = this.$refs.video;
      this.getSRTArr(this.videoId);
      this.video.addEventListener('waiting', () => {
        this.loading = true;
      });
      this.video.addEventListener('playing', () => {
        this.loading = false;
      });
      this.video.addEventListener('loadedmetadata', () => {
        this.loading = false;
        // this.duration = this.video.duration;
        this.video.currentTime = this.INPOINT;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
      });
      document.addEventListener('fullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('mozfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('webkitfullscreenchange', this.fullscreenchangeListener, false);
      document.addEventListener('msfullscreenchange', this.fullscreenchangeListener, false);
    },
    beforDestroy() {
      document.removeEventListener('fullscreenchange', this.fullscreenchangeListener);
      document.removeEventListener('mozfullscreenchange', this.fullscreenchangeListener, false);
      document.removeEventListener('webkitfullscreenchange', this.fullscreenchangeListener, false);
      document.removeEventListener('msfullscreenchange', this.fullscreenchangeListener, false);
      if (this.isPlaying) {
        this.video.pause();
      }
    },
    methods: {
      contextMenuStop() {
        return false;
      },
      reset() {
        this.pause();
        this.videoSRT = [];
        this.videoSRTPosition = 0;
        this.currentVideoSRT = '';
        this.isPlaying = false;
        clearInterval(this.moveIndicatorTimer);
        this.moveIndicatorTimer = null;
        this.progressBarHoverTimer = null;
        this.moveIndicatorTimeId = null;
        this.updateCurrentTimeTimeId = null;
        this.currentTime = this.INPOINT || 0;
        this.duration = this.OUTPOINT - this.INPOINT;
        this.indicatorOffset = 0;
        this.playProgressPercent = 0;
        this.hoverProgressPercent = 0;
        this.isShowHoverProgress = false;
        this.tooltipTime = 0;
      },
      getSRTArr(id) {
        getSRT(id, this.fromWhere, (err, data, res) => {
          if (err) {
            return;
          }
          this.videoSRT = data;
        }, this);
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
          if (this.currentTime <= this.OUTPOINT && this.currentTime + 1 / this.fps >= this.OUTPOINT) {
            this.video.currentTime = this.INPOINT;
          }
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

        if (this.videoSRT.length > 0 && this.videoSRT[this.videoSRTPosition]) {
          if (this.videoSRT[this.videoSRTPosition].start >= this.currentTime - 1 / this.fps
            && this.videoSRT[this.videoSRTPosition].start <= this.currentTime + 1 / this.fps) {
            this.currentVideoSRT = this.videoSRT[this.videoSRTPosition].text;
          } else if (this.videoSRT[this.videoSRTPosition].end >= this.currentTime - 1 / this.fps
            && this.videoSRT[this.videoSRTPosition].end <= this.currentTime + 1 / this.fps) {
            this.videoSRTPosition += 1;
            this.currentVideoSRT = '';
          }
        }

        if (this.currentTime <= this.OUTPOINT && this.currentTime + 1 / this.fps >= this.OUTPOINT) {
          this.pause();
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
        this.tooltipTime = currentLeft / progressBar.width * this.duration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.duration) this.tooltipTime = this.duration;
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
        this.video.currentTime = currentLeft / progressBar.width * this.duration + this.INPOINT;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
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
          this.video.currentTime = currentLeft / progressBar.width * this.duration + this.INPOINT;
          this.currentTime = this.video.currentTime;
          this.updateCurrentSRT();
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
