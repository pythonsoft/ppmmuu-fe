<template>
  <div class="watchContent">
    <div class="topBar">
      <span class="returnBtn" @click="back">
        <i class="iconfont icon-arrow-left"></i>
        返回
      </span>
    </div>
    <div class="mainBox">
      <div class="leftBox" ref="leftBox" :style="{ right: rightboxWidth }">
        <div class="leftBoxContent" :style="{ width: `${playerWidth+100}px` }">
          <player :videoId="objectId" :height="playerHeight" :width="playerWidth" :url="url" :streamInfo="streamInfo" :fromWhere="fromWhere" mode="big"></player>
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="streamInfo.FILENAME"></div>
            <ul class="video-title-bar">
              <li>
                <span title="下载" class="iconfont icon-video-download" @click.stop="prepareDownload()"></span>
              </li>
              <li>
                <span title="剪辑" class="iconfont icon-cut" @click.stop="gotoEditer"></span>
              </li>
            </ul>
          </div>
          <div class="leftBoxFooter">
            <h3 class="footerTitle">观看历史</h3>
            <grid-list-view
              type="grid"
              :width="playerWidth"
              :items="items"
              @currentItemChange="currentItemChange"
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
          <fj-tab-pane label="文件信息" name="tab2">
            <div class="media-center-file-item media-center-file-item-bottom-line" v-for="file in files">
              <table class="media-center-table">
                <tr>
                  <td class="item-info-key" width="80">文件名: </td>
                  <td class="item-info-value" width="303">
                    <div class="media-center-file-name">
                      {{ file.FILENAME || '无文件名' }}
                      <span class="media-center-file-type">
                        {{ file.SANAME || '无信息' }}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="item-info-key">文件大小: </td>
                  <td class="item-info-value" >{{ formatSize(file.FILESIZE) }}</td>
                </tr>
                <tr>
                  <td class="item-info-key">时长: </td>
                  <td class="item-info-value">{{ formatDuration(file.INPOINT, file.OUTPOINT) }}</td>
                </tr>
              </table>
              <more-view
                :info="file"
              ></more-view>
              <div class="media-center-operation-bar">
                <fj-button type="primary" size="mini" @click.stop="prepareDownload(file)">下载</fj-button>
              </div>
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
  import './index.css';
  import {
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    isEmptyObject,
    formatQuery,
    formatTime,
  } from '../../../common/utils';
  import GridListView from '../../mediaCenter/gridAndList';
  import MoreView from '../../mediaCenter/moreView';
  import Player from '../../mediaCenter/components/player';
  import { getTitle, getThumb } from '../../mediaCenter/common';
  import downloadListView from '../../management/template/download/component/downloadDialog';
  import throttle from '../../../component/fjUI/utils/throttle';

  const config = require('../../mediaCenter/config');
  const jobAPI = require('../../../api/job');
  const mediaAPI = require('../../../api/media');
  const ivideoAPI = require('../../../api/ivideo');
  const userAPI = require('../../../api/user');

  const playerMinWidth = 792;
  const playerMaxWidth = 1188;
  const playerMinHeight = 506;
  const playerMaxHeight = 731;

  export default {
    data() {
      return {
        rightBoxStatus: 'expand',
        rightBoxToggle: 'icon-toggle-right',
        activeTabName: 'tab1',
        files: [],
        objectId: '',
        fromWhere: '',
        poster: '',
        playerWidth: playerMinWidth,
        playerHeight: playerMinHeight,
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        program: [],
        items: [],
        rightboxWidth: '452px',
        templateInfo: {},
        fileInfo: {},
        downloadDialogDisplay: false
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
      '$route.params.objectId'(val) {
        if (val) {
          this.refresh();
        }
      }
    },
    mounted() {
      if (this.$route.params.objectId) {
        this.refresh();
      }
      this.updatePlayerWidth();
      window.addEventListener('resize', throttle(this.updatePlayerWidth));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.updatePlayerWidth));
    },
    methods: {
      formatSize,
      formatDuration,
      formatContent,
      refresh() {
        this.objectId = this.$route.params.objectId;
        this.fromWhere = this.$route.params.fromWhere;
        this.getDetail();
        this.getStream(this.objectId);
        this.poster = getThumb({ id: this.objectId });
        this.updateHistoryList();
      },
      currentItemChange(item) {
        this.$router.push({ name: 'historyWatch', params: { objectId: item.id, fromWhere: item.from_where } });
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
        const leftBoxWidth = this.$refs.leftBox.getBoundingClientRect().width;
        if (leftBoxWidth < playerMaxWidth + 100) {
          this.playerWidth = playerMinWidth;
          this.playerHeight = playerMinHeight;
        } else {
          this.playerWidth = playerMaxWidth;
          this.playerHeight = playerMaxHeight;
        }
      },
      updateHistoryList() {
        const data = {
          page: 1,
          pageSize: 12
        };
        userAPI.getWatchHistory(formatQuery(data, true))
          .then((response) => {
            const responseData = response.data;
            const tempList = responseData.docs.map(
              item => Object.assign(item.videoContent, { _id: item._id })
            );
            this.items = tempList;
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getDetail() {
        mediaAPI.getObject({ params: { objectid: this.objectId, fromWhere: this.fromWhere } }).then((res) => {
          this.program = res.data.result.detail.program;
          this.files = res.data.result.files;
          for(let i =0, len = this.program.length; i < len; i++){
            if(this.program[i].key === 'OBJECTID'){
              this.program.splice(i, 1);
              break;
            }
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream(id) {
        getStreamURL(id, this.fromWhere, (err, url, rs) => {
          if (err) {
            this.$message.error(err);
            return;
          }
          this.streamInfo = rs.result;
          document.title = rs.result.FILENAME;
          this.url = url;
        }, this);
      },
      // download(info) {
      //   const param = {
      //     objectid: this.objectId,
      //     inpoint: this.streamInfo.INPOINT,
      //     outpoint: this.streamInfo.OUTPOINT,
      //     fileName: this.streamInfo.FILENAME
      //   };
      //   if (info && !isEmptyObject(info)) {
      //     param.objectid = info.OBJECTID;
      //     param.fileName = info.FILENAME;
      //     param.inpoint = info.INPOINT;
      //     param.outpoint = info.OUTPOINT;
      //   }

      //   jobAPI.download(param).then((res) => {
      //     this.$message.success('正在下载文件，请到"任务"查看详细情况');
      //   }).catch((error) => {
      //     this.$message.error(error);
      //   });
      // },
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
          outpoint: 0,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: this.templateInfo._id,
          fromWhere: this.fromWhere,
          fileId: this.fileInfo._id
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
            this.$router.push({ name: 'movieEditor', params: { objectId: this.objectId, fromWhere: this.fromWhere } });
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
