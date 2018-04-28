<template>
  <div class="player-wrap" ref="videoWrap" :style="{height: `${height}px`}">
    <div class="video-poster" v-show="!showVideo">
      <img :src="poster" ref="poster" :style="getPosterStyle()">
      <i class="iconfont icon-play" @click="updatePlayerStatus"></i>
    </div>
    <template v-show="showVideo">
      <div class="videoLoadingMask" v-show="showVideo && loading"></div>
      <video
        @click="updatePlayerBottomDisplay"
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
      <div v-show="currentVideoSRT" class="video-srt">
        <span class="video-srt-text">{{ currentVideoSRT }}</span>
      </div>
      <div class="playerBottom" v-show="displayPlayerBottom">
        <i class="iconfont playerBtn" :class="[isPlaying ? 'icon-pause' : 'icon-play']" @click="updatePlayerStatus"></i>
        <div class="playerTime">{{ displayCurrentTime }}</div>
        <div class="progressBarWrap" ref="progressBarWrap" @click="handleProgressBarClick">
          <div class="progressBarList" ref="progressBar">
            <div class="playProgress" :style="playProgressStyle"></div>
          </div>
        <div class="playerPullIndicator" ref="pullIndicator" :style="indicatorStyle"></div>
        </div>
        <div class="rightPlayerTime">{{ displayDuration }}</div>
        <i class="playerBtn iconfont icon-fullscreen" @click="fullscreen"></i>
      </div>
    </template>
  </div>
</template>
<script>
  import draggable from '../../common/draggable';
  import { secondsToTimeCode, getSRT } from '../../../fe/common/utils';
  export default {
    props: {
      poster: String,
      url: String,
      fromWhere: {
        type: String,
        default: 'MAM'
      },
      fps: {
        type: Number,
        default: 25
      },
      videoId: {
        type: String,
        default: ''
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
        videoSRT: [],
        videoSRTPosition: 0,
        currentVideoSRT: '',
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
        const left = this.indicatorOffset < 0 ? 0 : this.indicatorOffset * 100;
        return { left: `${left}%` };
      },
      displayCurrentTime() {
        return secondsToTimeCode(this.innerCurrentTime, 'HH:mm:ss');
      },
      displayDuration() {
        return secondsToTimeCode(this.duration, 'HH:mm:ss');
      },
      playProgressStyle() {
        return { transform: `scaleX(${this.playProgressPercent})` };
      },
    },
    watch: {
      videoId(val) {
        // this.reset();
        this.getSRTArr(val);
      },
      streamInfo(val) {
        // 视频的长度是由入出点决定的，该入出点由getStream接口返回
        this.INPOINT = val.INPOINT / this.fps;
        this.OUTPOINT = val.OUTPOINT / this.fps;
        this.reset();
        this.updateCurrentSRT();
      },
      currentTime(val) {
        const progressBarWidth = this.getProgressBarStyle().width;
        this.indicatorOffset = (val - this.INPOINT) / this.duration;
        this.playProgressPercent = (val - this.INPOINT) / this.duration;
      },
    },
    mounted() {
      this.video = this.$refs.video;
      this.getSRTArr(this.videoId);
      const videoWidth = this.$refs.videoWrap.getBoundingClientRect().width;
      this.height = videoWidth * 9 / 16;
      this.video.addEventListener('waiting', () => {
        this.loading = true;
      });
      this.video.addEventListener('abort', () => {
        this.loading = false;
      });
      this.video.addEventListener('canplay', () => {
        this.loading = false;
      });
      this.video.addEventListener('playing', () => {
        this.loading = false;
      });
      this.video.addEventListener('loadedmetadata', () => {
        this.loading = false;
        this.video.currentTime = this.INPOINT;
        this.currentTime = this.video.currentTime;
        this.updateCurrentSRT();
      });
      this.video.addEventListener('canplay', () => {
        this.loading = false;
        if (this.video.currentTime < this.INPOINT) {
          this.video.currentTime = this.INPOINT;
          this.currentTime = this.video.currentTime;
        }
      });

      this.initDragEvents();
    },
    beforeDestroy() {
      if (this.isPlaying) {
        this.video.pause();
      }
    },
    methods: {
      reset() {
        this.showVideo = false;
        this.pause();
        this.videoSRT = [];
        this.videoSRTPosition = 0;
        this.currentVideoSRT = '';
        this.isPlaying = false;
        this.displayPlayerBottom = false;
        clearInterval(this.moveIndicatorTimer);
        this.moveIndicatorTimer = null;
        this.moveIndicatorTimeId = null;
        this.displayPlayerBottomTimeId = null;
        this.video.currentTime = this.INPOINT || 0;
        this.currentTime = this.INPOINT || 0;
        this.duration = this.OUTPOINT - this.INPOINT;
        this.indicatorOffset = 0;
        this.playProgressPercent = 0;
      },
      getPosterStyle() {
        const element = this.$refs.poster;
        if (element) {
          let height = element.naturalHeight;
          if (height > this.height) {
            return { height: `${this.height}px` };
          }
        }
        return { width: '100%', height: '100%' };
      },
      getSRTArr(id) {
        getSRT(id, this.fromWhere, (err, data, res) => {
          if (err) {
            return;
          }
          this.videoSRT = data;
        });
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
          if (this.video.currentTime < this.INPOINT) {
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
          clearInterval(this.moveIndicatorTimer);
          this.isPlaying = false;
          this.pause();
          this.currentTime = this.OUTPOINT;
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
        this.updateCurrentSRT();
      },
      initDragEvents() {
        const el = this.$refs.progressBarWrap;
        draggable(el, {
          start: (event) => {
            this.handleProgressBarClick(event);
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
          this.updateCurrentSRT();
        }, 1);
      },
      updatePlayerBottomDisplay() {
        if (this.displayPlayerBottom) {
          this.displayPlayerBottom = false;
          clearTimeout(this.displayPlayerBottomTimeId)
        } else {
          this.showPlayerBottom();
        }
      },
      showPlayerBottom() {
        this.displayPlayerBottom = true;
        clearTimeout(this.displayPlayerBottomTimeId)
        this.displayPlayerBottomTimeId = setTimeout(() => {
          this.displayPlayerBottom = false;
        }, 5000);
      },
      fullscreen() {
        this.toggleFullscreen(this.$refs.video);
      },
      toggleFullscreen(element) {
        if (element.requestFullscreen) {
          element.requestFullscreen();
          element.addEventListener('fullscreenchange', this.fullscreenchangeListener);
        } else if (element.webkitRequestFullScreen) {
          element.webkitRequestFullScreen();
          element.addEventListener('webkitfullscreenchange', this.fullscreenchangeListener);
        } else if (element.mozRequestFullScreen) {
          element.mozRequestFullScreen();
          element.addEventListener('mozfullscreenchange', this.fullscreenchangeListener);
        } else if (element.msRequestFullscreen) {
          element.msRequestFullscreen();
          element.addEventListener('msfullscreenchange', this.fullscreenchangeListener);
        } else if (element.webkitEnterFullscreen) {
          element.webkitEnterFullscreen();
          element.addEventListener('webkitendfullscreen', this.fullscreenchangeListener);
        }
      },
      fullscreenchangeListener(e) {
        this.currentTime = this.video.currentTime;
      }
    }
  };
</script>
<style>
.player-wrap {
  position: relative;
  width: 100%;
}
.player {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
.player {
  display: block;
  width: 100%;
  height: auto;
  background-color: #000;
  background-repeat: no-repeat;
}
.video-poster {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #000;
  z-index: 1;
  overflow: hidden;
}
.video-poster img {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  /*width: 100%;
  height: 100%;*/
}
.video-poster .icon-play {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 64px;
  height: 64px;
  background: rgba(0,0,0,.3);
  border-radius: 50%;
  font-size: 17px;
  color: #fff;
  z-index: 2;
}
.playerBottom {
  display: flex;
  align-items: center;
  justify-content: center;
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33px;
  /*line-height: 33px;*/
  background-image: linear-gradient(0deg, rgba(0,0,0,0.70) 11%, rgba(0,0,0,0.00) 100%, rgba(0,0,0,0.00) 100%);
}
.playerBtn {
  padding: 0 15px;
  color: #fff;
  font-size: 17px;
}
.playerTime,
.rightPlayerTime {
  width: 55px;
  color: #fff;
  text-align: center;
  font-size: 12px;
}
.playerTime {
  margin-right: 8px;
}
.rightPlayerTime {
  margin-left: 8px;
}
.progressBarWrap {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  margin: 0 8px;
  /*overflow: hidden;*/
}
.progressBarList {
  width: 100%;
  height: 2px;
  background: rgba(204, 204, 204, .5);
  overflow: hidden;
}
.playProgress {
  width: 100%;
  height: 100%;
  background: #38B1EB;
  transform-origin: 0 0;
}
.playerPullIndicator {
  position: absolute;
  top: 8px;
  left: -8px;
  width: 16px;
  height: 16px;
  transform: translateX(-50%);
  background: #fff;
  border-radius: 50%;
}
.videoLoadingMask {
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 100;
}
.videoLoadingMask:before {
  content: "\e69a";
  display: inline-block;
  font-family:"iconfont" !important;
  font-size:40px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #ddd;
  animation: rotate 1s linear infinite;
}
@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}
.video-srt {
  position: absolute;
  bottom: 10px;
  right: 10px;
  left: 10px;
  text-align: center;
  font-size: 12px;
  font-weight: bold;
  color: #FFFFFF;
}
.video-srt-text {
  background: rgba(0, 0, 0, .5);
  padding: 3px;
}
</style>
