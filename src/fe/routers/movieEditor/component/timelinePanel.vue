<template>
  <div>
    <div class="task-list-controller-wrap" ref="controlMenu">
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="moveSequence(-1)" :class="{'disabled-control-item': isDisabledControl}">
          <i class="iconfont icon-move-to-left"></i>
        </div>
        <div class="player-control-tooltip">前移</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="moveSequence(1)" :class="{'disabled-control-item': isDisabledControl}">
          <i class="iconfont icon-move-to-right"></i>
        </div>
        <div class="player-control-tooltip">后移</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="handleDeleteSequence" :class="{'disabled-control-item': isDisabledControl}">
          <i class="iconfont icon-delete"></i>
        </div>
        <div class="player-control-tooltip">删除</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" :class="{'disabled-control-item': isDisabledControl}" ref="downloadBtn" @click="(e)=>{mountDropdownMenu(e, sequences)}" v-clickoutside="handleCloseMenu">
          <i class="iconfont icon-video-download"></i>
        </div>
        <div class="player-control-tooltip">下载</div>
      </div>
      <div class="player-control-item-wrap">
        <div class="player-control-item" :class="{'disabled-control-item': isDisabledControl}" @click="isDisabledControl?null:isShowSubmitInfoDialog=true">
          <i class="iconfont icon-submit"></i>
        </div>
        <div class="player-control-tooltip">提交</div>
      </div>
    </div>
    <div class="timeline-title">{{ timelineTitle }}</div>
    <div class="timeline-content">
      <canvas ref="timeline">您的浏览器不支持canvas</canvas>
    </div>
    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
    <submit-info-dialog
      :sequences="sequences"
      :dialogVisible.sync="isShowSubmitInfoDialog"
    ></submit-info-dialog>
  </div>
</template>
<script>
  import Vue from 'vue';
  import { secondsToTimeCode, isEmptyObject, FROM_WHERE, formatDuration } from '../../../common/utils';
  import DownloadListView from '../../management/template/download/component/downloadDialog';
  import DropDownMenu from './dropdownMenu.vue';
  import SubmitInfoDialog from './submitInfoDialog';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import jobAPI from '../../../api/job';

  const TIMELINE_CONFIG_DEFAULT = {
    sequenceHeight: 91,
    marginTop: 64,
    marginLeft: 4,
    font: '12px sans-serif',
    fontColor: '#2A3E52',
    sequenceColor: '#F2F6FA',
    currentSequenceColor: '#CAEBFA',
    currentSequenceBorderColor: '#CAEBFA',
    currentSequenceBorderWidth: 2,
    sequenceImageWidth: 120,
    sequenceImageHeight: 68,
    sequenceTitleColor: '#2A3E52'
  };
  const TIMELINE_CONFIG_DARK = {
    sequenceHeight: 91,
    marginTop: 64,
    marginLeft: 4,
    font: '12px sans-serif',
    fontColor: '#CED9E5',
    sequenceColor: '#CED9E5',
    currentSequenceColor: '#CAEBFA',
    currentSequenceBorderColor: '#FFF',
    currentSequenceBorderWidth: 2,
    sequenceImageWidth: 120,
    sequenceImageHeight: 68,
    sequenceTitleColor: '#2A3E52'
  };

  export default {
    components: {
      DownloadListView,
      SubmitInfoDialog
    },
    props: {
      projectBus: {},
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
      importSourceInfo: {
        type: Object,
        default() {
          return {
            title: '',
            range: [0, 0],
            screenshot: ''
          };
        }
      },
      theme: String
    },
    watch: {
      importSourceInfo(val) {
        this.insertSequence(val);
      },
      size(val) {
        this.resize(val);
      },
      sequences(val) {
        this.updateProgram();
        this.draw();
      },
      currentSequenceIndex(val) {
        this.updateProgram();
      },
      theme(val) {
        this.TIMELINE_CONFIG = val === 'dark' ? TIMELINE_CONFIG_DARK : TIMELINE_CONFIG_DEFAULT;
        this.isDark = val === 'dark' ? true : false;
      }
    },
    data() {
      return {
        sequences: [],
        currentSequenceIndex: 0,
        dpr: 1,
        downloadDialogDisplay: false,
        command: '',
        isShowSubmitInfoDialog: false,
        isAutoPlayProgram: false
      };
    },
    computed: {
      timelineTitle() {
        if (this.sequences.length === 0) return '时间轴（无序列）';
        const currentSequence = this.sequences[this.currentSequenceIndex];
        const duration = currentSequence.duration;
        return `${currentSequence.title} ${secondsToTimeCode(duration)}`;
      },
      isDisabledControl() {
        return this.sequences.length === 0 || this.currentSequenceIndex < 0;
      }
    },
    created() {
      this.projectBus.$on('updateProgramIndex', (index) => {
        if (index > this.sequences.length - 1 || index < 0) {
          if (this.currentSequenceIndex === 0) {
            this.updateProgram();
          }
          this.currentSequenceIndex = 0;
        } else {
          if (this.currentSequenceIndex === index) return;
          this.isAutoPlayProgram = true;
          this.currentSequenceIndex = index;
        }
        this.draw();
      });
    },
    mounted() {
      this.TIMELINE_CONFIG = this.theme === 'dark' ? TIMELINE_CONFIG_DARK : TIMELINE_CONFIG_DEFAULT;
      this.isDark = this.theme === 'dark' ? true : false;
      this.timeline = this.$refs.timeline;
      this.ctx = this.timeline.getContext('2d');
      this.resize(this.size);
      this.dpr = window.devicePixelRatio;
      this.parentEl = this.$refs.controlMenu;
    },
    methods: {
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          if(this.command === 'all') {
            this.download(rs, type, '2');
          }else{
            this.download(rs, type, '1');
          }
        }
      },
      download(rs, type, downloadType) {
        const me = this;
        const items = this.sequences;
        if(!items || items.length === 0){
          return;
        }
        const templateInfo = rs[type];
        const objectIds = [];

        const reqData = {
          name: 'Download',
          workflowId: '0dfa68fa-2f25-4d8c-a466-bc7c24b3b0d6',
          parms: {},
          priority: 0,
          templateId: templateInfo._id,
        };

        reqData.parms = {
          bucketId: '',
          transcodeTemplateId: '',
          orgFiles: [],
          downloadType: downloadType,
        }

        for(let i = 0, len = items.length; i < len; i++){
          const item = items[i];
          const index = objectIds.indexOf(item.objectId);
          if (index == -1) {
            objectIds.push(item.objectId);
            const inpoint = formatDuration(item.range[0] * 1000, true);
            const outpoint = formatDuration(item.range[1] * 1000, true);
            const parts = inpoint + ',' + outpoint;
            const file = {
              objectId: item.objectId,
              fileName: item.title,
              fromWhere: item.fromWhere || FROM_WHERE.MAM,
              fileType: item.filetypeid,
              parts: parts,
            };
            reqData.parms.orgFiles.push(file);
          }else{
            const inpoint = formatDuration(item.range[0] * 1000, true);
            const outpoint = formatDuration(item.range[1] * 1000, true);
            const parts = inpoint + ',' + outpoint;
            reqData.parms.orgFiles[index].parts = reqData.parms.orgFiles[index].parts + '|' + parts;
          }
        }

        reqData.parms.orgFiles = JSON.stringify(reqData.parms.orgFiles);
        jobAPI.download(reqData).then((res) => {
          if(res.data === 'audit'){
            me.$message.success('您下载文件需要审核，请到"任务-下载任务-待审核"查看详细情况');
          }else {
            me.$message.success('正在下载文件，请到"任务"查看详细情况');
          }        }).catch((error) => {
          this.$message.error(error);
        });

        return false;
      },
      resize(parentSize) {
        const width = this.size.width - this.TIMELINE_CONFIG.marginLeft;
        const height = this.size.height - this.TIMELINE_CONFIG.marginTop;
        this.timeline.style.width = `${width}px`;
        this.timeline.style.height = `${height}px`;
        this.timeline.width = width * this.dpr;
        this.timeline.height = height * this.dpr;
        this.draw();
      },
      draw() {
        const ctx = this.ctx;
        ctx.font = this.TIMELINE_CONFIG.font.replace(/(\d*)/, (match, p1) => p1 * this.dpr);
        ctx.fillStyle = this.TIMELINE_CONFIG.fontColor;
        ctx.clearRect(0, 0, this.timeline.width, this.timeline.height);
        if (this.sequences.length === 0) {
          const middle = this.getTimelineMiddle();
          ctx.fillText('请插入媒体以创建序列', middle.x, middle.y);
        } else {
          this.renderSequences();
          this.timeline.removeEventListener('click', this.onTimelineClick, false);
          this.timeline.addEventListener('click', this.onTimelineClick, false);
        }
      },
      onTimelineClick(e) {
        const timeLineRect = this.timeline.getBoundingClientRect();
        const x = (e.pageX - timeLineRect.left) * this.dpr;
        const y = (e.pageY - timeLineRect.top) * this.dpr;

        for (let i = 0; i < this.sequences.length; i++) {
          const itemRect = this.sequences[i].rect;
          if (y < itemRect.startY || y > itemRect.startY + itemRect.h) {
            break;
          }
          if (
            x >= itemRect.startX
            && x < itemRect.startX + itemRect.w) {
            this.currentSequenceIndex = i;
            this.draw();
            break;
          }
        }
      },
      getTimelineMiddle() {
        return { x: this.timeline.width / 2, y: this.timeline.height / 2 };
      },
      renderSequences() {
        const ctx = this.ctx;
        const rectH = this.TIMELINE_CONFIG.sequenceHeight * this.dpr;
        const middleY = this.getTimelineMiddle().y;
        const sequenceStartY = middleY - rectH;

        const unitLength = this.getUnitLength();
        let sequenceStartX = 0;
        this.sequences.forEach((item, index) => {
          ctx.fillStyle = this.TIMELINE_CONFIG.sequenceColor;

          const rect = {
            startX: sequenceStartX,
            startY: sequenceStartY,
            w: item.duration * unitLength,
            h: rectH
          };
          item.rect = rect;
          sequenceStartX += rect.w;
          ctx.clearRect(rect.startX, rect.startY, rect.w, rect.h);
          if (index === this.currentSequenceIndex) {
            ctx.fillStyle = this.TIMELINE_CONFIG.currentSequenceColor;
            ctx.lineWidth = this.TIMELINE_CONFIG.currentSequenceBorderWidth;
            ctx.strokeStyle = this.TIMELINE_CONFIG.currentSequenceBorderColor;
            this.drawRect('fill', rect, ctx);
            const strokeRect = {
              startX: rect.startX + 2,
              startY: rect.startY + 2,
              w: rect.w - 4,
              h: rect.h - 4
            };
            this.drawRect('stroke', strokeRect, ctx);
          } else {
            this.drawRect('fill', rect, ctx);
          }

          let imgWidth = this.TIMELINE_CONFIG.sequenceImageWidth * this.dpr;
          let imgHeight = this.TIMELINE_CONFIG.sequenceImageHeight * this.dpr;
          if (rect.w <= imgWidth + 8 * (2 * this.dpr)) {
            imgWidth = (rect.w - 8 * (2 * this.dpr)) > 0 ? rect.w - 8 * (2 * this.dpr) : 0;
            imgHeight = this.TIMELINE_CONFIG.sequenceImageHeight
              / this.TIMELINE_CONFIG.sequenceImageWidth
              * imgWidth;
          }
          const image = new Image();
          image.src = item.screenshot;
          image.onload = () => {
            const x = rect.startX + (8 * this.dpr);
            const y = rect.startY + (11 * this.dpr);
            ctx.drawImage(image, x, y, imgWidth, imgHeight);
          };

          ctx.fillStyle = this.TIMELINE_CONFIG.sequenceTitleColor;
          ctx.textBaseline = 'top';
          const titleStartX = rect.startX + (8 * this.dpr) + imgWidth + (12 * this.dpr);
          const titleStartY = rect.startY + (11 * this.dpr);
          ctx.fillText(item.title, titleStartX, titleStartY);

          const duration = secondsToTimeCode(item.duration);
          const fontSize = parseInt(this.TIMELINE_CONFIG.font.match(/(\d*)/)[0], 10);
          ctx.fillText(duration, titleStartX, titleStartY + ((fontSize + 10) * this.dpr));
        });
      },
      drawRect(style, rect, ctx) {
        if (style === 'fill') {
          ctx.fillRect(rect.startX, rect.startY, rect.w, rect.h);
        }
        if (style === 'stroke') {
          ctx.strokeRect(rect.startX, rect.startY, rect.w, rect.h);
        }
      },
      getUnitLength() {
        const totalDuration = this.sequences.reduce((sum, item) => sum + item.duration, 0);
        return this.timeline.width / totalDuration;
      },
      insertSequence(info) {
        this.sequences.push(Object.assign(info, { id: `sequence-${new Date().getTime()}` }));
      },
      updateProgram() {
        this.projectBus.$emit('updateProgram', this.sequences[this.currentSequenceIndex] || {}, this.currentSequenceIndex, this.isAutoPlayProgram);
        // 重置isAutoPlayProgram属性
        this.isAutoPlayProgram = false;
      },
      moveSequence(sign = 1) {
        const sequencesLen = this.sequences.length;
        const newIndex = this.currentSequenceIndex + sign;
        if (sequencesLen === 0
          || this.currentSequenceIndex < 0
          || newIndex > sequencesLen - 1
          || newIndex < 0) return;
        this.sequences.splice(newIndex, 0, this.sequences.splice(this.currentSequenceIndex, 1)[0]);
        this.currentSequenceIndex = newIndex;
      },
      handleDeleteSequence() {
        if (this.sequences.length === 0 || this.currentSequenceIndex < 0) return;
        this.sequences.splice(this.currentSequenceIndex, 1);
        this.currentSequenceIndex = 0;
      },
      mountDropdownMenu(e, files) {
        this.dropdownMenu = new Vue(DropDownMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updateMenuPosition);
        this.updateMenuPosition();
        const menus = [
          { command: 'single', key: 'single', name: '逐条下载'},
          { command: 'all', key: 'all', name: '合并下载'},
        ];
        this.dropdownMenu.menus = menus;
        this.dropdownMenu.isDark = this.isDark;
        this.dropdownMenu.$on('item-click', this.handleItemClick);
      },
      handleItemClick(item, command) {
        this.command = command;
        this.downloadDialogDisplay = true;
        this.unmountDropdownMenu();
      },
      handleCloseMenu(target) {
        if (this.dropdownMenu && this.dropdownMenu.$el.contains(target)) return;
        this.unmountDropdownMenu();
      },
      unmountDropdownMenu() {
        if (this.dropdownMenu) {
          document.body.removeChild(this.dropdownMenu.$el);
          const parentEl = this.parentEl || document.body;
          parentEl.removeEventListener('scroll', this.updateMenuPosition);
          this.dropdownMenu = null;
        }
      },
      updateMenuPosition() {
        if (this.dropdownMenu) {
          const position = this.getDropdownMenu();
          this.dropdownMenu.menuStyle = {
            top: `${position.top + 30}px`,
            left: `${position.left - 43}px`,
            minWidth: '76px'
          };
        }
      },
      getDropdownMenu() {
        const downloadBtnPosition = getPosition(this.$refs.downloadBtn);
        const position = { top: downloadBtnPosition.y, left: downloadBtnPosition.x };
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        position.top = position.top - parentElScrollTop;
        return position;
      },
    },
    beforDestroy() {
      if (this.dropdownMenu) {
        this.unmountDropdownMenu();
      }
    },
    directives: { Clickoutside }
  };
</script>
