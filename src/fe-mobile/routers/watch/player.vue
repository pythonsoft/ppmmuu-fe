<template>
  <div class="player-wrap" ref="videoWrap" :style="{height: `${height}px`}">
    <div class="video-poster" v-show="!showVideo">
      <img :src="poster">
      <i class="iconfont icon-play" @click="updatePlayerStatus"></i>
    </div>
    <template v-show="showVideo">
      <div class="videoLoadingMask" v-show="showVideo && loading"></div>
      <video
        @click="showPlayerBottom"
        @contextmenu.prevent="()=>{return false;}"
        class="player"
        :style="{height: `${height}px`}"
        :src="url"
        ref="video"
        crossorigin="anonymous"
        preload="auto"
        webkit-playsinline
        playsinline
        ></video>
      <div class="playerBottom" v-show="displayPlayerBottom">
        <i class="iconfont playerBtn" :class="[isPlaying ? 'icon-pause' : 'icon-play']" @click="updatePlayerStatus"></i>
        <div class="playerTime">{{ displayCurrentTime }}</div>
        <div class="progressBarWrap" ref="progressBarWrap" @click="handleProgressBarClick">
          <div class="progressBarList" ref="progressBar">
            <div class="playProgress" :style="playProgressStyle"></div>
          </div>
        <div class="playerPullIndicator" ref="pullIndicator" :style="indicatorStyle"></div>
        </div>
        <div class="playerTime">{{ displayDuration }}</div>
      </div>
    </template>
  </div>
</template>
<script>
  import draggable from '../../common/draggable';
  import { transformSecondsToStr, getSRT } from '../../../fe/common/utils';
  export default {
    props: {
      poster: String,
      url: String,
      fps: {
        type: Number,
        default: 25
      },
      streamInfo: {
        type: Object,
        default() {
          return {
            INPOINT: 0,
            OUTPOINT: 0
          };
        }
      }
    },
    data() {
      return {
        currentTime: 0,
        INPOINT: this.streamInfo.INPOINT / this.fps || 0,
        OUTPOINT: this.streamInfo.OUTPOINT / this.fps || 0,
        duration: (this.streamInfo.OUTPOINT - this.streamInfo.INPOINT) / this.fps,
        indicatorOffset: 0,
        playProgressPercent: 0,
        height: 0,
        moveIndicatorTimeId: null,
        moveIndicatorTimer: null,
        displayPlayerBottomTimeId: null,
        showVideo: false,
        isPlaying: false,
        loading: true,
        displayPlayerBottom: false
      };
    },
    computed: {
      interval() {
        return Math.floor(1000 / this.fps);
      },
      innerCurrentTime() {
        return this.currentTime - this.INPOINT > this.OUTPOINT
          ? this.OUTPOINT : this.currentTime - this.INPOINT;
      },
      indicatorStyle() {
        return { transform: `translateX(${this.indicatorOffset}px)` };
      },
      displayCurrentTime() {
        return transformSecondsToStr(this.innerCurrentTime, 'HH:mm:ss');
      },
      displayDuration() {
        return transformSecondsToStr(this.duration, 'HH:mm:ss');
      },
      playProgressStyle() {
        return { transform: `scaleX(${this.playProgressPercent})` };
      },
    },
    watch: {
      streamInfo(val) {
        // 视频的长度是由入出点决定的，该入出点由getStream接口返回
        this.INPOINT = val.INPOINT / this.fps;
        this.OUTPOINT = val.OUTPOINT / this.fps;
        this.reset();
        // this.updateCurrentSRT();
      },
      currentTime(val) {
        const progressBarWidth = this.getProgressBarStyle().width;
        this.indicatorOffset = (val - this.INPOINT) / this.duration * progressBarWidth;
        this.playProgressPercent = (val - this.INPOINT) / this.duration;
      },
    },
    mounted() {
      this.video = this.$refs.video;
      const videoWidth = this.$refs.videoWrap.getBoundingClientRect().width;
      this.height = videoWidth * 9 / 16;
      this.video.addEventListener('waiting', () => {
        this.loading = true;
      });
      this.video.addEventListener('playing', () => {
        this.loading = false;
      });
      this.video.addEventListener('loadedmetadata', () => {
        this.loading = false;
        this.video.currentTime = this.INPOINT;
        this.currentTime = this.video.currentTime;
        // this.updateCurrentSRT();
      });
      this.initDragEvents();
    },
    methods: {
      reset() {
        this.showVideo = false;
        this.pause();
        // this.videoSRT = [];
        // this.videoSRTPosition = 0;
        // this.currentVideoSRT = '';
        this.isPlaying = false;
        this.displayPlayerBottom = false;
        clearInterval(this.moveIndicatorTimer);
        this.moveIndicatorTimer = null;
        // this.progressBarHoverTimer = null;
        this.moveIndicatorTimeId = null;
        this.displayPlayerBottomTimeId = null;
        // this.updateCurrentTimeTimeId = null;
        this.video.currentTime = this.INPOINT || 0;
        this.currentTime = this.INPOINT || 0;
        this.duration = this.OUTPOINT - this.INPOINT;
        this.indicatorOffset = 0;
        this.playProgressPercent = 0;
        // this.hoverProgressPercent = 0;
        // this.isShowHoverProgress = false;
        // this.tooltipTime = 0;
      },
      play() {
        this.showVideo = true;
        this.isPlaying = true;
        this.video.play();
      },
      pause() {
        this.isPlaying = false;
        this.video.pause();
      },
      updatePlayerStatus() {
        if (!this.isPlaying) {
          if (this.currentTime <= this.OUTPOINT && this.currentTime + 1 / this.fps >= this.OUTPOINT) {
            this.video.currentTime = this.INPOINT;
          }
          this.play();
          this.moveIndicatorTimer = setInterval(() => {
            this.indicatorMover();
          }, this.interval);
        } else if (this.isPlaying) {
          this.pause();
          clearInterval(this.moveIndicatorTimer);
        }
        this.showPlayerBottom();
      },
      indicatorMover() {
        this.currentTime = this.video.currentTime;

        // if (this.videoSRT.length > 0) {
        //   if (this.videoSRT[this.videoSRTPosition].start >= this.currentTime - 1 / this.fps
        //     && this.videoSRT[this.videoSRTPosition].start <= this.currentTime + 1 / this.fps) {
        //     this.currentVideoSRT = this.videoSRT[this.videoSRTPosition].text;
        //   } else if (this.videoSRT[this.videoSRTPosition].end >= this.currentTime - 1 / this.fps
        //     && this.videoSRT[this.videoSRTPosition].end <= this.currentTime + 1 / this.fps) {
        //     this.videoSRTPosition += 1;
        //     this.currentVideoSRT = '';
        //   }
        // }

        if (this.currentTime <= this.OUTPOINT && this.currentTime + 1 / this.fps >= this.OUTPOINT) {
          this.pause();
          this.isPlaying = false;
          clearInterval(this.moveIndicatorTimer);
        }
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
      handleProgressBarClick(e) {
        const x = e.clientX;
        const progressBar = this.getProgressBarStyle();
        const currentLeft = x - progressBar.left;
        this.video.currentTime = currentLeft / progressBar.width * this.duration + this.INPOINT;
        this.currentTime = this.video.currentTime;
        this.showPlayerBottom();
        // this.updateCurrentSRT();
      },
      initDragEvents() {
        const el = this.$refs.progressBarWrap;
        draggable(el, {
          start: (event) => {
            if (this.isPlaying) {
              this.updatePlayerStatus();
            }
            this.showPlayerBottom();
          },
          drag: (event) => {
            this.moveHandler(event);
            this.showPlayerBottom();
          },
          end: () => {
            clearTimeout(this.moveIndicatorTimeId);
            this.video.currentTime = this.currentTime;
            this.updatePlayerStatus();
          }
        })
      },
      moveHandler(e) {
        clearTimeout(this.moveIndicatorTimeId);
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
          this.currentTime = currentLeft / progressBar.width * this.duration + this.INPOINT;
          // this.updateCurrentSRT();
        }, 1);
      },
      showPlayerBottom() {
        this.displayPlayerBottom = true;
        clearTimeout(this.displayPlayerBottomTimeId)
        this.displayPlayerBottomTimeId = setTimeout(() => {
          this.displayPlayerBottom = false;
        }, 5000);
      }
    }
  };
</script>
