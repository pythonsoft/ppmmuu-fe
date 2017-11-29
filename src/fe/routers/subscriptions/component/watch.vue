<template>
  <div class="watchContent">
    <div class="mainBox">
      <div class="leftBox" ref="leftBox" :style="{ right: rightboxWidth }">
        <div class="leftBoxContent" :style="{ width: `${playerWidth+100}px` }">
          <player :videoId="objectId" :height="playerHeight" :width="playerWidth" :url="url" :streamInfo="streamInfo" mode="big" :fromWhere="fromWhere"></player>
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="name"></div>
            <ul class="video-title-bar">
              <li>
                <span title="下载" class="iconfont icon-video-download" @click.stop="prepareDownload()"></span>
              </li>
            </ul>
          </div>
          <div class="leftBoxFooter">
            <h3 class="footerTitle">更多节目</h3>
            <grid-list-view
              :width="playerWidth"
              :items="items"
              :downloadFn="showDownloadList"
              :link-to-watch-fn="currentItemChange"
              :parent-el="parentEl"
            ></grid-list-view>
          </div>
        </div>
      </div>
      <div class="rightBox" :style="{ width: rightboxWidth }">
        <i class="iconfont rightBoxToggle" :class="rightBoxToggle" @click="foldedOrExpandRightBox"></i>
        <fj-tabs v-model="activeTabName" class="media-video-panel-wrap">
          <fj-tab-pane label="内容简介" name="tab1">
            <div class="media-center-file-item">
              <table class="media-center-table">
                <tr v-for="info in program" v-if="info.cn && info.value" >
                  <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                  <td class="item-info-value">
                    <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
                    <span v-else>{{ formatValue(info.value) }}</span>
                  </td>
                </tr>
              </table>
            </div>
          </fj-tab-pane>
        </fj-tabs>
      </div>
    </div>

    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
  </div>
</template>
<script>
  import {
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    isEmptyObject,
    formatQuery,
    formatTime,
  } from '../../../common/utils';
  import GridListView from './gridAndList';
  import MoreView from '../../mediaCenter/moreView';
  import Player from '../../mediaCenter/components/player';
  import { getTitle, getThumb } from '../../mediaCenter/common';
  import downloadListView from '../../management/template/download/component/downloadDialog';

  const config = require('../../mediaCenter/config');
  const jobAPI = require('../../../api/job');
  const mediaAPI = require('../../../api/media');
  const ivideoAPI = require('../../../api/ivideo');
  const userAPI = require('../../../api/user');
  const subscribeAPI = require('../../../api/subscribe');

  const playerMinWidth = 594;
  const playerMaxWidth = 1188;
  const playerMinHeight = 387;
  const playerMaxHeight = 731;
  export default {
    props: {
      query: {}
    },
    data() {
      return {
        rightBoxStatus: 'expand',
        rightBoxToggle: 'icon-toggle-right',
        activeTabName: 'tab1',
        files: [],
        _id: '',
        objectId: '',
        name: '',
        poster: '',
        playerWidth: playerMinWidth,
        playerHeight: playerMinHeight,
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        program: {},
        items: [],
        rightboxWidth: '452px',
        templateInfo: {},
        fileInfo: {},
        downloadDialogDisplay: false,
        parentEl: null,
        fromWhere: 1,
        FROM_WHERE: config.getConfig('FROM_WHERE'),
        UMP_FILETYPE_VALUE: config.getConfig('UMP_FILETYPE_VALUE')
      };
    },
    watch: {
      rightBoxStatus(val) {
        setTimeout(() => {
          if (this.rightBoxStatus === 'expand') {
            this.rightBoxToggle = 'icon-toggle-right';
          } else if (this.rightBoxStatus === 'folded') {
            this.rightBoxToggle = 'icon-toggle-left folded';
          }
        }, 400);
      },
      'query'(val) {
        if (val._id) {
          this.refresh();
        }
      }
    },
    mounted() {
      this.parentEl = this.$refs.leftBox;
      if (this.query._id) {
        this.refresh();
      }
      // this.updatePlayerWidth();
      this.initRightBoxStatus();
      window.addEventListener('resize', this.updatePlayerWidth);
    },
    beforDestroy() {
      window.removeEventListener('resize', this.updatePlayerWidth);
    },
    methods: {
      formatSize,
      formatDuration,
      formatContent,
      refresh() {
        this._id = this.query._id;
        this.getDetail();
        // this.getStream(this.objectId);
        // this.poster = getThumb({ id: this.objectId });
      },
      showDownloadList(fileInfo) {
        this.fileInfo = fileInfo;
        this.downloadDialogDisplay = true;
      },
      currentItemChange(item) {
        this.$emit('update-router', { name: 'subscriptions', query: { _id: item._id } });
      },
      foldedOrExpandRightBox() {
        if (this.rightBoxStatus === 'expand') {
          this.rightboxWidth = '4px';
          this.rightBoxStatus = 'folded';
          setTimeout(this.updatePlayerWidth, 400);
        } else if (this.rightBoxStatus === 'folded') {
          this.rightboxWidth = '452px';
          this.rightBoxStatus = 'expand';
          setTimeout(this.updatePlayerWidth, 400);
        }
      },
      updatePlayerWidth() {
        if (!this.$refs.leftBox) return;
        const leftBoxWidth = this.$refs.leftBox.getBoundingClientRect().width;
        if (leftBoxWidth < playerMaxWidth + 100) {
          this.playerWidth = playerMinWidth;
          this.playerHeight = playerMinHeight;
        } else {
          this.playerWidth = playerMaxWidth;
          this.playerHeight = playerMaxHeight;
        }
      },
      initRightBoxStatus() {
        const leftBoxWidth = this.$refs.leftBox.getBoundingClientRect().width;

        if (leftBoxWidth < playerMinWidth + 100) {
          this.rightboxWidth = '4px';
          this.rightBoxStatus = 'folded';
          setTimeout(this.updatePlayerWidth, 400);
        } else {
          this.rightboxWidth = '452px';
          this.rightBoxStatus = 'expand';
          setTimeout(this.updatePlayerWidth, 400);
        }
      },
      updateList() {
        const options = {};
        options.keyword = this.name;
        options.isRelated = true;
        options.start = 0;
        options.pageSize = 13;
        subscribeAPI.esSearch(options, this).then((res) => {
          this.items = [];
          res.data.docs.forEach(item => {
            if (item._id !== this._id) {
              this.items.push(item);
            }
          });
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getDetail() {
        // mediaAPI.getObject({ params: { objectid: this.objectId } }).then((res) => {
        //   this.program = res.data.result.detail.program;
        //   this.files = res.data.result.files;
        //   delete this.program.OBJECTID;
        // }).catch((error) => {
        //   this.$message.error(error);
        // });
        subscribeAPI.getVideoInfo({ params: { _id: this._id } }).then((res) => {
          const data = res.data;
          this.objectId = data.objectId;
          this.name = data.name;
          this.fromWhere = data.fromWhere || 1;
          this.getStream(this.objectId, this.fromWhere);
          this.updateList();
          this.program = data.details;
          this.files = data.files;

        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream(id, fromWhere) {
        getStreamURL(id, fromWhere, (err, url, rs) => {
          if (err) {
            this.$message.error(err);
            return;
          }
          this.streamInfo = rs.result;
          document.title = rs.result.FILENAME;
          this.url = url;
        }, this);
      },
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          this.download(rs, type);
        }
      },
      getDefaultFileInfo() {
        const files = this.files;
        const ft = config.getConfig('IVIDEO_EDIT_FILE_TYPE_ID');

        if (files.length === 0) {
          return {};
        }

        if(this.fromWhere*1 === this.FROM_WHERE.UMP){
          for (let j = 0, l = this.UMP_FILETYPE_VALUE.length; j < l; j++) {
            for (let i = 0, len = files.length; i < len; i++) {
              if (files[i].type === this.UMP_FILETYPE_VALUE[j]) {
                return files[i];
              }
            }
          }
        }else {
          for (let j = 0, l = ft.length; j < l; j++) {
            for (let i = 0, len = files.length; i < len; i++) {
              if (files[i].FILETYPEID === ft[j]) {
                return files[i];
              }
            }
          }
        }

        return {};
      },
      prepareDownload(fileInfo) {
        if(fileInfo) {
          this.fileInfo = fileInfo;
          // console.log(this.fileInfo);
        }else {
          this.fileInfo = this.getDefaultFileInfo();
        }

        if(isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以下载，下载其它信息可以到文件信息中选取下载');
          return;
        }
        this.downloadDialogDisplay = true;
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
          outpoint: this.fileInfo.OUTPOINT,
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
      back() {
        this.$router.push({ name: 'history' });
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        // console.log(str, rs);

        return rs;
      }
    },
    components: {
      Player,
      MoreView,
      GridListView,
      'download-list-view': downloadListView
    }
  };
</script>
