<template>
  <div
    ref="playerWrap"
    :class="[$style.playerBigMode, $style.playerWrap]"
    :style="isFullscreen ? {} : { height: `${height}px`, width: `${width}px` }">
    <div :class="$style.videoLoadingMask" v-if="loading"></div>
    <div :class="$style.videoTitle" :style="{ top: `${videoTitleTop}px`, left: `${videoTitleLeft}px` }" v-html="name"></div>
    <div :class="$style.videoBox">
      <video @contextmenu.prevent="contextMenuStop" :style="{display: 'block', width: '100%', height: '100%'}" ref="video" :src="url" crossorigin="anonymous"></video>
      <div v-show="currentVideoSRT" :class="$style['video-srt']">
        <span :class="$style['video-srt-text']">{{ currentVideoSRT }}</span>
      </div>
    </div>
    <div :class="$style.playerBottom">
      <div
        :class="$style.progressBarWrap"
        @mouseenter="mouseenter"
        @mousemove="mousemove"
        @mouseleave="mouseleave"
        @click="handleProgressBarClick">
        <div :class="$style.progressBarList" ref="progressBar">
          <div v-show="isShowHoverProgress" :class="$style.hoverProgress" :style="hoverProgressStyle"></div>
          <div :class="$style.playProgress" :style="playProgressStyle"></div>
        </div>
        <div :class="$style.playerPullIndicator" :style="indicatorStyle" @mousedown="indicatorMousedown"></div>
        <div :class="$style.playerTooltip" :style="tooltipStyle" ref="tooltip">
          <div :class="$style.playerTooltipText">
            {{ tooltipText }}
          </div>
        </div>
      </div>
      <div :class="[$style.controllerWrap, 'clearfix']">
        <i :class="['iconfont', $style.playerBtn, isPlaying ? 'icon-pause' : 'icon-play']" @click="updatePlayerStatus"></i>
        <div :class="$style.volumeBox">
          <i :class="['iconfont', $style.volumeBtn, isMute ? 'icon-mute' : 'icon-volume']" @click="muteBtnClick"></i>
          <div :class="$style.volumePanel">
            <div :class="$style.volumeSlider" ref="volumeSlider" @click="handleVolumeSliderClick">
              <div :class="$style.volumeSliderHandle" :style="volumeSliderHandleStyle"></div>
            </div>
          </div>
        </div>
        <div :class="$style.playerTime">{{ displayCurrentTime }} / {{ displayDuration }}</div>
        <i :class="[$style.playerBtn, $style.rightControl, 'iconfont', isFullscreen ? 'icon-esc-fullscreen' : 'icon-fullscreen']" @click="fullscreen"></i>
        <i v-if="files.length > 0" :class="[$style.playerBtn, $style.rightControl, 'iconfont icon-video-download']" @click.stop="(e)=>{mountDropdownMenu(e)}" v-clickoutside="handleCloseMenu" ref="downloadBtn"></i>
        <i v-if="showCutIcon" :class="[$style.playerBtn, $style.rightControl, 'iconfont icon-cut']" @click.stop="gotoEditer"></i>
      </div>
    </div>
    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
  </div>
</template>
<script>
  import Vue from 'vue';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  // import DropdownMenu from './dropdownMenu';
  import DownloadListView from '../../management/template/download/component/downloadDialog';
  import { secondsToTimeCode, getSRT } from '../../../common/utils';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import { isEmptyObject } from '../../../common/utils';
  const jobAPI = require('../../../api/job');
  const ivideoAPI = require('../../../api/ivideo');
  const mediaAPI = require('../../../api/media');

  const volumeSliderWidth = 38;
  const volumeSliderHandleWidth = 8;

  export default {
    directives: { Clickoutside },
    components: {
      DownloadListView
    },
    props: {
      downloadMenu: {},
      fileType: String,
      videoId: {
        type: String,
        default: ''
      },
      showCutIcon: {
        type: Boolean,
        default: false
      },
      isAutoPlay: {
        type: Boolean,
        default: false
      },
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
      mode: {
        type: String,
        default: 'normal'
      },
      name: String,
      files: Array
    },
    data() {
      return {
        INPOINT: this.streamInfo.INPOINT / this.fps || 0,
        OUTPOINT: this.streamInfo.OUTPOINT / this.fps || 0,
        loading: false,
        videoSRT: [],
        videoSRTPosition: 0,
        currentVideoSRT: '',
        isPlaying: false,
        moveIndicatorTimer: null,
        progressBarHoverTimer: null,
        moveIndicatorTimeId: null,
        updateCurrentTimeTimeId: null,
        currentTime: 0,
        duration: (this.streamInfo.OUTPOINT - this.streamInfo.INPOINT) / this.fps,
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
        volumeSliderOffset: this.mode === 'big' ? (volumeSliderWidth * 2 - volumeSliderHandleWidth * 2) : (volumeSliderWidth - volumeSliderHandleWidth),
        downloadDialogDisplay: false,
        fileInfo: {},
        videoTitleTop: 0,
        videoTitleLeft: 0
      };
    },
    computed: {
      interval() {
        return Math.floor(1000 / this.fps);
      },
      displayCurrentTime() {
        return secondsToTimeCode(this.innerCurrentTime, 'HH:mm:ss');
      },
      displayDuration() {
        return secondsToTimeCode(this.duration, 'HH:mm:ss');
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
      }
    },
    watch: {
      url(val) {
        if (val) {
          this.loading = true;
        }
      },
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
      },
      width(val) {
        const progressBarWidth = val;
        this.indicatorOffset = this.innerCurrentTime / this.duration * progressBarWidth;
        this.playProgressPercent = this.innerCurrentTime / this.duration;
        this.updateVideoTitlePosition();
      },
      height(val) {
        this.updateVideoTitlePosition();
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
        this.updateVideoTitlePosition();
      });
      this.video.addEventListener('loadeddata', () => {
        this.loading = false;
        if (this.isAutoPlay) {
          this.updatePlayerStatus();
        }
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
          this.$emit('on-ended');
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

        this.isShowHoverProgress = true;
        this.hoverProgressPercent = currentLeft / progressBar.width;
        this.tooltipTime = currentLeft / progressBar.width * this.duration;
        if (this.tooltipTime < 0) this.tooltipTime = 0;
        if (this.tooltipTime > this.duration) this.tooltipTime = this.duration;
        this.tooltipText = secondsToTimeCode(this.tooltipTime, 'HH:mm:ss');
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
      },
      mountDropdownMenu(e) {
        if (this.dropdownMenu) return;
        this.dropdownMenu = new Vue(this.downloadMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        this.updateMenuPosition();
        const menus = this.files.map(file => {
          return { command: file, key: file.type, name: file.typeName, streamUrl: file.streamUrl, shelfTaskId: file.shelfTaskId, catalogInfoId: file.catalogInfoId, fileName: this.name };
        });
        this.dropdownMenu.isDark = true;
        this.dropdownMenu.menus = menus;
        this.dropdownMenu.$on('item-click', this.handleItemClick);
      },
      handleItemClick(item, command) {
        // this.showDownloadList(command);
        this.unmountDropdownMenu();
      },
      handleCloseMenu(target) {
        if (this.dropdownMenu && this.dropdownMenu.$el.contains(target)) return;
        this.unmountDropdownMenu();
      },
      unmountDropdownMenu() {
        if (this.dropdownMenu) {
          document.body.removeChild(this.dropdownMenu.$el);
          this.dropdownMenu = null;
        }
      },
      updateMenuPosition() {
        if (this.dropdownMenu) {
          setTimeout(() => {
            const position = this.getDropdownMenu();
            const dropdownMenuHeight = this.dropdownMenu.$el.getBoundingClientRect().height;
            this.dropdownMenu.menuStyle = {
              top: `${position.top - dropdownMenuHeight - 5}px`,
              left: `${position.left - 27}px`,
              minWidth: '78px'
            };
          }, 200);
        }
      },
      getDropdownMenu() {
        const downloadBtnPosition = getPosition(this.$refs.downloadBtn);
        const position = { top: downloadBtnPosition.y, left: downloadBtnPosition.x };
        position.top = position.top;
        return position;
      },
      showDownloadList(fileInfo) {
        this.fileInfo = fileInfo;
        this.downloadDialogDisplay = true;
      },
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          this.download(rs, type);
        }
      },
      download(rs, type) {
        if (isEmptyObject(this.streamInfo)) {
          return false;
        }

        const me = this;
        const templateInfo = rs[type];

        const param = {
          objectid: this.fileInfo.OBJECTID,
          inpoint: this.fileInfo.INPOINT,
          outpoint: 0,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID || '',
          templateId: templateInfo._id,
          fromWhere: this.fromWhere,
          fileId: this.fileInfo._id || ''
        };

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      updateVideoTitlePosition() {
        const videoWidth = this.video.videoWidth;
        const videoHeight = this.video.videoHeight;
        const wrapWidth = this.isFullscreen ? this.$refs.video.getBoundingClientRect().width: this.width;
        const wrapHeight = this.isFullscreen ? this.$refs.video.getBoundingClientRect().height: this.height - 100;

        if (videoHeight * wrapWidth / videoWidth <= wrapHeight) {
          this.videoTitleTop = (wrapHeight - videoHeight * wrapWidth / videoWidth) / 2;
          this.videoTitleLeft = 0;
        } else {
          this.videoTitleTop = 0;
          this.videoTitleLeft = (wrapWidth - videoWidth * wrapHeight / videoHeight) / 2 - 18;
        }
      },
      gotoEditer() {
        if (!this.videoId) {
          return;
        }
        const reqData = { parentId: '' };
        reqData.name = this.name;
        reqData.snippet = {
          objectId: this.videoId,
          thumb: mediaAPI.getIcon(this.videoId, this.fromWhere),
          input: this.streamInfo.INPOINT,
          output: this.streamInfo.OUTPOINT,
          duration: this.streamInfo.OUTPOINT - this.streamInfo.INPOINT,
          fileTypeId: this.fileType,
          fromWhere: this.fromWhere
        };

        ivideoAPI.createItem(reqData).then((response) => {
          this.$router.push({ name: 'movieEditor', params: { objectId: this.videoId, fromWhere: this.fromWhere } });
        }).catch((error) => {
          this.$message.error(error);
        });
      }
    }
  };
</script>
<style module>
  @import url(./player.css);
</style>
