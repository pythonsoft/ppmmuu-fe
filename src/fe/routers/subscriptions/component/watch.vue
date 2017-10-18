<template>
  <div class="watchContent">
    <div class="mainBox">
      <div class="leftBox" ref="leftBox" :style="{ right: rightboxWidth }">
        <div class="leftBoxContent" :style="{ width: `${playerWidth+100}px` }">
          <player :videoId="objectId" :height="playerHeight" :width="playerWidth" :url="url" :streamInfo="streamInfo" mode="big"></player>
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="streamInfo.FILENAME"></div>
            <ul class="media-video-title-bar">
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
              :parentEl="parentEl"
            ></grid-list-view>
          </div>
        </div>
      </div>
      <div class="rightBox" :style="{ width: rightboxWidth }">
        <i class="iconfont rightBoxToggle" :class="rightBoxToggle" @click="foldedOrExpandRightBox"></i>
        <fj-tabs v-if="objectId" v-model="activeTabName" class="media-video-panel-wrap">
          <fj-tab-pane label="条目信息" name="tab1">
            <div class="media-center-file-item">
              <table class="media-center-table">
                <tr v-for="info in program" v-if="info.value" >
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
        objectId: '',
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
        parentEl: null
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
      'query.objectId'(val) {
        if (val) {
          this.refresh();
        }
      }
    },
    mounted() {
      this.parentEl = this.$refs.leftBox;
      if (this.query.objectId) {
        this.refresh();
      }
      this.updatePlayerWidth();
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
        this.objectId = this.query.objectId;
        this.getDetail();
        this.getStream(this.objectId);
        this.poster = getThumb({ id: this.objectId });
        this.updateList();
      },
      showDownloadList(fileInfo) {
        this.fileInfo = fileInfo;
        this.downloadDialogDisplay = true;
      },
      currentItemChange(objectId) {
        this.$emit('update-router', { name: 'subscriptions', query: { objectId: objectId } });
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
      updateList() {
        // const data = {
        //   page: 1,
        //   pageSize: 12
        // };
        // userAPI.getWatchHistory(formatQuery(data, true))
        //   .then((response) => {
        //     const responseData = response.data;
        //     const tempList = responseData.docs.map(
        //       item => Object.assign(item.videoContent, { _id: item._id })
        //     );
        //     this.items = tempList;
        //   })
        //   .catch((error) => {
        //     this.$message.error(error);
        //   });
        const options = {};
        options.keyword = this.streamInfo.FILENAME;
        options.start = 0;
        options.pageSize = 12;
        subscribeAPI.esSearch(options, this).then((res) => {
          this.items = res.data.docs;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getDetail() {
        mediaAPI.getObject({ params: { objectid: this.objectId } }).then((res) => {
          this.program = res.data.result.detail.program;
          this.files = res.data.result.files;
          delete this.program.OBJECTID;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream(id) {
        getStreamURL(id, (err, url, rs) => {
          if (err) {
            this.$message.error(err);
            return;
          }
          this.streamInfo = rs.result;
          document.title = rs.result.FILENAME;
          this.url = url;
        }, this);
      },
      downloadListConfirm(templateInfo) {
        this.templateInfo = templateInfo || {};
        if (!isEmptyObject(templateInfo)) {
          this.download();
        }
      },
      getDefaultFileInfo() {
        const ft = config.getConfig('IVIDEO_EDIT_FILE_TYPE_ID');
        const files = this.files;

        if(files.length === 0) {
          return {};
        }

        for(let i = 0, len = files.length; i < len; i++) {
          for(let j = 0, l = ft.length; j < l; j++) {
            if(files[i].FILETYPEID === ft[j]) {
              return files[i];
            }
          }
        }

        return {};
      },
      prepareDownload(fileInfo) {
        if(fileInfo) {
          this.fileInfo = fileInfo;
          console.log(this.fileInfo);
        }else {
          this.fileInfo = this.getDefaultFileInfo();
        }

        if(isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以下载，下载其它信息可以到文件信息中选取下载');
          return;
        }
        this.downloadDialogDisplay = true;
      },
      download() {
        if (isEmptyObject(this.streamInfo)) {
          return false;
        }

        const me = this;

        const param = {
          objectid: this.fileInfo.OBJECTID,
          inpoint: this.fileInfo.INPOINT,
          outpoint: this.fileInfo.OUTPOINT,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: this.templateInfo._id
        };

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      gotoEditer() {
        const reqData = { parentId: '' };
        reqData.name = this.streamInfo.FILENAME;
        reqData.snippet = {
          objectId: this.objectId,
          thumb: this.poster,
          input: this.streamInfo.INPOINT,
          output: this.streamInfo.OUTPOINT,
          duration: this.streamInfo.OUTPOINT - this.streamInfo.INPOINT
        };
        ivideoAPI.createItem(reqData)
          .then((response) => {
            this.$router.push({ name: 'movieEditor', params: { objectId: this.objectId } });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      back() {
        this.$router.push({ name: 'history' });
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        console.log(str, rs);

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