<template>
  <div
    :class="['video-source-wrap', {'active-panel':isActivePanel}]"
    @click="()=>{this.$emit('update:activePanel', 'programPanel')}">
    <div class="video-source-title">{{ `素材：${title || '素材名称'} ${displayDuration}` }}</div>
    <div class="video-source-box">
      <div class="videoSourceLoadingMask" v-if="loading"></div>
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
  import { secondsToTimeCode, getStreamURL, FROM_WHERE } from '../../../common/utils';

  export default {
    props: {
      projectBus: {},
      activePanel: String,
      imageSize: {
        type: Object,
        default() {
          return { width: 640, height: 360 };
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
        id: '',
        videoId: '',
        title: '',
        range: [0, 0],
        currentTime: 0,
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
        videoSource: '',
        loading: false,
        programIndex: 0,
        isAutoPlay: false
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
        return secondsToTimeCode(this.innerDuration);
      },
      displayCurrentTime() {
        return secondsToTimeCode(this.innerCurrentTime);
      }
    },
    created() {
      if(this.videoId){
        this.getStream(this.videoId);
      }
    },
    watch: {
      range(val) {
        this.currentTime = val[0];
        this.video.currentTime = this.currentTime;
        this.offset = 0;
      },
      videoId(val) {
        this.loading = true;
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
    created() {
      this.projectBus.$on('updateProgram', (program, programIndex, isAutoPlay) => {
        if (this.id === program.id) {
          this.currentTime = program.range[0];
          this.video.currentTime = program.range[0];
          return;
        }
        const oldId = this.videoId;
        this.id = program.id;

        this.videoId = program.objectId;
        this.title = program.title;
        this.range = program.range;

        this.programIndex = programIndex;
        this.isAutoPlay = isAutoPlay;

        if (oldId === program.objectId && isAutoPlay) {
          this.updatePlayerStatus();
          this.isAutoPlay = false;
        }
        this.video.addEventListener('loadeddata', () => {
          this.loading = false;
          if (this.isAutoPlay) {
            this.updatePlayerStatus();
            this.isAutoPlay = false;
          }
        });
      });
    },
    mounted() {
      this.video = this.$refs.video;
      this.video.addEventListener('loadedmetadata', () => {
        this.video.currentTime = this.currentTime;
      });
      this.video.addEventListener('waiting', () => {
        this.loading = true;
      });
      this.video.addEventListener('playing', () => {
        this.loading = false;
      });
      this.video.addEventListener('loadeddata', () => {
        this.loading = false;
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
      updateProgramIndex() {
        // 播放时间线上的下一个素材
        this.projectBus.$emit('updateProgramIndex', this.programIndex + 1);
      },
      contextMenuStop() {
        return false;
      },
      getStream(id) {
        const fromWhere = this.$route.params.fromWhere || FROM_WHERE.MAM;
        getStreamURL(id, fromWhere, (err, url) => {
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
          // 如果此时为视频的出点时间则暂停播放
          if (this.currentTime + 1 / this.fps >= this.range[1]
              && this.currentTime <= this.range[1]) {
            this.updateProgramIndex();
            this.pause();
            this.isPlaying = false;

            const progressBar = this.getProgressBarStyle();
            const progressBarWidth = progressBar.width;
            this.offset = progressBarWidth;
            clearInterval(this.moveIndicatorTimer);
            return;
          }
          this.play();
          this.isPlaying = true;
          this.moveIndicatorTimer = setInterval(() => {
            const progressBar = this.getProgressBarStyle();
            const progressBarWidth = progressBar.width;
            this.currentTime = this.video.currentTime;

            this.offset = (this.video.currentTime - this.range[0])
              / this.innerDuration * progressBarWidth;
            if (this.offset > progressBarWidth) this.offset = progressBarWidth;

            if (this.currentTime + 1 / this.fps >= this.range[1]
              && this.currentTime <= this.range[1]) {
              this.updateProgramIndex();
              this.pause();
              this.isPlaying = false;
              this.offset = progressBarWidth;
              clearInterval(this.moveIndicatorTimer);
            }
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
        this.screenshotTitle = this.title + secondsToTimeCode(this.innerCurrentTime) + '.png';
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
