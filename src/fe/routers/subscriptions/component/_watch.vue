<template>
  <div :class="$style.watchContent">
    <div class="mainBox">
      <div :class="$style.leftBox" ref="leftBox" :style="{ right: rightboxWidth }">
        <div :class="$style.leftBoxContent" :style="{ width: `${playerWidth+100}px` }">
          <player :videoId="objectId" :height="playerHeight" :width="playerWidth" :url="url" :streamInfo="streamInfo" mode="big" :fromWhere="fromWhere"></player>
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="name"></div>
            <ul class="video-title-bar">
              <li ref="downloadBtn" v-if="files.length > 0" @click.stop="(e)=>{mountDropdownMenu(e)}" v-clickoutside="handleCloseMenu">
                <span title="下载" class="iconfont icon-video-download"></span>
              </li>
            </ul>
          </div>
          <div :class="$style.leftBoxFooter">
            <h3 :class="$style.footerTitle">更多节目</h3>
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
      <div :class="$style.rightBox" :style="{ width: rightboxWidth }">
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
  import Vue from 'vue';
  import {
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    isEmptyObject,
    formatQuery,
    formatTime,
    FROM_WHERE
  } from '../../../common/utils';
  import GridListView from './gridAndList';
  import MoreView from '../../mediaCenter/moreView';
  import Player from '../../mediaCenter/components/player';
  import { getTitle, getThumb } from '../../mediaCenter/common';
  import downloadListView from '../../management/template/download/component/downloadDialog';
  import DropdownMenu from './dropdownMenu';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import throttle from '../../../component/fjUI/utils/throttle';

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
        fromWhere: FROM_WHERE.MAM,
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
      window.addEventListener('resize', throttle(this.updatePlayerWidth));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.updatePlayerWidth));
    },
    methods: {
      formatSize,
      formatDuration,
      formatContent,
      mountDropdownMenu(e) {
        this.dropdownMenu = new Vue(DropdownMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updateMenuPosition);
        this.updateMenuPosition();
        const menus = this.files.map(file => {
          return { command: file, key: file.type, name: file.typeName, streamUrl: file.streamUrl, downloadUrl: file.downloadUrl };
        });
        this.dropdownMenu.menus = menus;
        // this.dropdownMenu.$on('item-click', this.handleItemClick);
      },
      handleItemClick(item, command) {
        this.showDownloadList(command);
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
            top: `${position.top + 44}px`,
            left: `${position.left - 134}px`,
            minWidth: '166px'
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
      updateList(subscribeType) {
        const options = {};
        options.keyword = this.name;
        options.subscribeType = subscribeType;
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
          this.fromWhere = data.fromWhere || FROM_WHERE.MAM;
          this.getStream(this.objectId, this.fromWhere);
          this.updateList(data.editorInfo.subscribeType);
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

        if(this.fromWhere === this.FROM_WHERE.HK_RUKU){
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
        console.log('files', this.files);
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
    },
    directives: { Clickoutside }
  };
</script>
<style module>
.watchContent {
  position: absolute;
  top: 90px;
  left: 0;
  bottom: 0;
  width: 100%;
  z-index: 100;
  background: #F8FAFB;
}

.rightBox {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  background: #F8FAFB;
  border-left: 4px solid #F2F6FA;
  font-size: 12px;
  color: #2A3E52;
  transition: width .4s cubic-bezier(0.23, 1, 0.32, 1) 100ms;
}
.leftBox {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  overflow: auto;
}
.leftBoxContent {
  margin: 0 auto;
  padding: 14px 50px;
}
.footerTitle {
  position: relative;
  height: 20px;
  margin-top: 20px;
  margin-bottom: 14px;
  padding-left: 9px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
}
.footerTitle:before {
  content: '';
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  width: 4px;
  background: #20A4F3;
}
</style>
