<template>
  <div class="media-right">
    <div class="media-video">
      <div v-if="url" class="media-video-wrap">
        <div class="media-video-content" id="video" ref="video">
          <player :videoId="videoId" :height="288" :width="448" :url="url" :streamInfo="streamInfo"></player>
        </div>
        <div >
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="title"></div>
            <ul class="media-video-title-bar">
              <!--<li>-->
                <!--<span title="下载" class="iconfont icon-video-download" @click.stop="download"></span>-->
              <!--</li>-->
              <!-- <li>
                <span title="剪辑" class="iconfont icon-cut" @click.stop="gotoEditer"></span>
              </li> -->
              <li @click.stop="showSourceMenu" ref="addtoBtn" v-clickoutside="closeSourceMenu">
                <span title="添加" class="iconfont icon-addto"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
    </div>
    <div class="media-video-panel">
      <fj-tabs v-if="!isEmptyObject(item)" v-model="activeTabName" @tab-click="handleTabClick" class="media-video-panel-wrap">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="media-center-file-item">
            <table class="media-center-table">
              <tr v-for="(info, key) in program" v-if="info.value" >
                <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                <td class="item-info-value clearfix">
                  <span v-if="info.isFoldedContent" class="inline-info">{{ info.value }}</span>
                  <span class="item-expand-btn" v-if="info.isFoldedContent" @click="expand(info, key)">详细<i class="tri-bottom"></i></span>
                  <template v-else>
                    <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
                    <span v-else>{{ info.value }}</span>
                  </template>
                  <span class="item-folded-btn" v-if="info.value.length > 60 && !info.isFoldedContent" @click="folded(info, key)">收起<i class="tri-top"></i></span>
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
              :info=file
            ></more-view>
            <div class="media-center-operation-bar">
              <fj-button type="info" size="mini" @click.stop="(e) => prepareDownload(file)">下载</fj-button>
            </div>
          </div>
        </fj-tab-pane>
      </fj-tabs>
    </div>

    <download-list-view
      :visible.sync="downloadDialogDisplay"
      @confirm="downloadListConfirm"
    ></download-list-view>
  </div>
</template>
<script>
  import Vue from 'vue';
  import './index.css';
  import { getTitle, getThumb } from './common';
  import { isEmptyObject, formatSize, formatDuration, formatContent, getStreamURL } from '../../common/utils';
  import moreView from './moreView';
  import SourceMenuDialog from './components/sourceMenuDialog';
  import Player from './components/player';
  import { getPosition } from '../../component/fjUI/utils/position';
  import Clickoutside from '../../component/fjUI/utils/clickoutside';
  import ivideoAPI from '../../api/ivideo';
  import downloadListView from '../management/task/template/component/downloadDialog';

  const api = require('../../api/media');
  const jobAPI = require('../../api/job');


  export default {
    name: 'right',
    directives: { Clickoutside },
    components: {
      'more-view': moreView,
      'download-list-view': downloadListView,
      Player
    },
    props: {
      videoInfo: { type: Object, default: {} }
    },
    data() {
      return {
        title: '',
        program: {},
        files: [],
        poster: '',
        activeTabName: 'tab1',
        item: {},
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0
        },
        templateInfo: {},
        fileInfo: {},
        downloadDialogDisplay: false,
        videoId: ''
      };
    },
    watch: {
      videoInfo(val) {
        this.title = this.getTitle(val);
        this.program = {};
        this.poster = this.getThumb(val);
        this.item = val;
        this.videoId = val.id;
        this.getDetail();
        this.getStream();
      },
      program(val) {
        const keys = Object.keys(val);
        for (let i = 0; i < keys.length; i++) {
          const info = val[keys[i]];
          if (info.value.length > 60) {
            info.isFoldedContent = true;
          }
        }
      }
    },
    created() {
    },
    methods: {
      expand(info, key) {
        const newInfo = Object.assign({}, this.program[key], { isFoldedContent: false });
        this.$set(this.program, key, newInfo);
      },
      folded(info, key) {
        const newInfo = Object.assign({}, this.program[key], { isFoldedContent: true });
        this.$set(this.program, key, newInfo);
      },
      handleTabClick(tab) {

      },
      getDetail() {
        const me = this;
        api.getObject({ params: { objectid: this.item.id } }).then((res) => {
          me.program = res.data.result.detail.program;
          me.files = res.data.result.files;
          delete me.program.OBJECTID;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      getThumb,
      getTitle,
      isEmptyObject,
      formatSize,
      formatContent,
      formatDuration(input, output) {
        return formatDuration((output - input) / 25 * 1000);
      },
      closeSourceMenu(target) {
        if (this.menu && this.menu.$el.contains(target)) return;
        if (this.menu && this.menu.visible) this.unmountMenu();
      },
      showSourceMenu() {
        if (!this.menu) {
          this.mountMenu();
        }
        const menuPosition = this.getMenuPosition();
        this.menu.menuPosition = menuPosition;
        this.menu.visible = true;
      },
      getMenuPosition() {
        const addtoBtn = this.$refs.addtoBtn;
        const menuPosition = {};
        const addtoBtnPosition = getPosition(addtoBtn);
        const addtoBtnHeight = addtoBtn.getBoundingClientRect().height;
        menuPosition.top = `${addtoBtnPosition.y + addtoBtnHeight}px`;
        menuPosition.left = `${addtoBtnPosition.x - 227}px`;
        // menuPosition.left = `${addtoBtnPosition.x - 163}px`;
        return menuPosition;
      },
      mountMenu() {
        this.menu = new Vue(SourceMenuDialog).$mount();
        this.menu.$on('addto-menu', this.handleAddtoMenu);
        document.body.appendChild(this.menu.$el);
      },
      unmountMenu() {
        if (this.menu) {
          this.menu.$destroy();
          document.body.removeChild(this.menu.$el);
          this.menu = null;
        }
      },
      handleAddtoMenu(data, leaveOrNot) {
        const reqData = Object.assign({}, data);
        reqData.name = this.title;
        reqData.snippet = {
          objectId: this.item.id,
          thumb: this.poster,
          input: 0,
          output: this.item.duration,
          duration: this.item.duration
        };
        ivideoAPI.createItem(reqData)
          .then((response) => {
            this.unmountMenu();
            if (leaveOrNot) {
              this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id } });
            }
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      gotoEditer() {
        const reqData = { parentId: '' };
        reqData.name = this.title;
        reqData.snippet = {
          objectId: this.item.id,
          thumb: this.poster,
          input: 0,
          output: this.item.duration,
          duration: this.item.duration
        };
        ivideoAPI.createItem(reqData)
          .then((response) => {
            this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id } });
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getStream() {
        const me = this;

        getStreamURL(this.item.id, (err, url, rs) => {
          if (err) {
            me.$message.error(err);
            return;
          }
          me.streamInfo = rs.result;
          me.url = url;
        }, me);

        return false;
      },
      downloadListConfirm(templateInfo) {
        this.templateInfo = templateInfo || {};
        if (!isEmptyObject(templateInfo)) {
          this.download();
        }
      },
      prepareDownload(fileInfo) {
        this.fileInfo = fileInfo;
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
      }
    }
  };
</script>

