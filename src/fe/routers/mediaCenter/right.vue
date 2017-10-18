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
              <li>
                <span title="下载" class="iconfont icon-video-download" @click.stop="prepareDownload()"></span>
              </li>
              <li>
                <span title="剪辑" class="iconfont icon-cut" @click.stop="gotoEditer"></span>
              </li>
              <li @click.stop="showSourceMenu" ref="addtoBtn" v-clickoutside="closeSourceMenu">
                <span title="添加" class="iconfont icon-addto"></span>
              </li>
              <li>
                <span title="上架" class="iconfont icon-shangjialine" @click.stop="createShelf"></span>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg">
        <span class="media-video-wrap-message">{{videoMessage}}</span>
      </div>
    </div>
    <div class="media-video-panel">
      <fj-tabs v-if="!isEmptyObject(item)" v-model="activeTabName" @tab-click="handleTabClick" class="media-video-panel-wrap">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="media-center-file-item">
            <table class="media-center-table">
              <tr v-for="(info, key) in program" v-if="info.value" >
                <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                <td class="item-info-value clearfix">
                  <span v-if="info.isFoldedContent" class="inline-info">{{ formatValue(info.value) }}</span>
                  <span class="item-expand-btn" v-if="info.isFoldedContent" @click="expand(info, key)">详细<i class="tri-bottom"></i></span>
                  <template v-else>
                    <span v-html="formatContent(info.value)"></span>
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
              :info="file"
            ></more-view>
            <div class="media-center-operation-bar">
              <fj-button type="info" size="mini" @click.stop=" prepareDownload(file)">下载</fj-button>
            </div>
          </div>
        </fj-tab-pane>
      </fj-tabs>
    </div>
    <fj-dialog
            title="上架"
            :visible.sync="shelfDialogVisible">
      <p>已添加至上架，确定再次添加</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="shelfDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="shelfDialogBtnLoading" @click.stop="confirmCreateShelf">确定</fj-button>
      </div>
    </fj-dialog>
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
  import {
    isEmptyObject,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    formatTime
  } from '../../common/utils';
  import moreView from './moreView';
  import SourceMenuDialog from './components/sourceMenuDialog';
  import Player from './components/player';
  import { getPosition } from '../../component/fjUI/utils/position';
  import Clickoutside from '../../component/fjUI/utils/clickoutside';
  import ivideoAPI from '../../api/ivideo';
  import downloadListView from '../management/template/download/component/downloadDialog';

  const api = require('../../api/media');
  const jobAPI = require('../../api/job');
  const shelfApi = require('../../api/shelves');

  const config = require('./config');
  const taskConfig = require('../management/task/config');

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
        basic: {},
        files: [], // 所有的文件信息
        poster: '',
        activeTabName: 'tab1',
        item: {},
        url: '',
        videoMessage: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0
        },
        fileInfo: {},
        downloadDialogDisplay: false,
        shelfDialogVisible: false,
        shelfDialogBtnLoading: false,
        videoId: '',
        shelfName: ''
      };
    },
    watch: {
      videoInfo(val) {
        this.title = this.getTitle(val);
        this.shelfName = this.title.replace('<em>','');
        this.shelfName = this.shelfName.replace('</em>','');
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
          me.basic = res.data.result.basic;
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
      formatContent(v) {
        let r = v;

        if(typeof r === 'string') {
          r = formatContent(this.formatValue(v));
        }

        return r;
      },
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
        if (isEmptyObject(this.fileInfo)) {
          this.fileInfo = this.getDefaultFileInfo();
        }

        if (isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以进行编辑');
          return false;
        }

        const reqData = Object.assign({}, data);
        reqData.name = this.fileInfo.FILENAME;

        reqData.snippet = {
          objectId: this.fileInfo.OBJECTID,
          thumb: this.poster,
          input: this.fileInfo.INPOINT,
          output: this.fileInfo.OUTPOINT,
          duration: this.fileInfo.OUTPOINT - this.fileInfo.INPOINT,
          fileTypeId: this.fileInfo.FILETYPEID
        };

        ivideoAPI.createItem(reqData).then((response) => {
          this.unmountMenu();
          if (leaveOrNot) {
            this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id } });
          }
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      gotoEditer() {
        if (isEmptyObject(this.fileInfo)) {
          this.fileInfo = this.getDefaultFileInfo();
        }

        if (isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以进行编辑');
          return false;
        }

        const reqData = { parentId: '' };
        reqData.name = this.fileInfo.FILENAME;
        reqData.snippet = {
          objectId: this.fileInfo.OBJECTID,
          thumb: this.poster,
          input: this.fileInfo.INPOINT,
          output: this.fileInfo.OUTPOINT,
          duration: this.fileInfo.OUTPOINT - this.fileInfo.INPOINT,
          fileTypeId: this.fileInfo.FILETYPEID
        };

        ivideoAPI.createItem(reqData).then((response) => {
          this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id } });
        }).catch((error) => {
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
          const index = rs.result.FILENAME.lastIndexOf('.');
          const ext = rs.result.FILENAME.slice(index);

          me.streamInfo = rs.result;

          if(ext !== '.mp4') {
            me.url = '';
            me.videoMessage = '暂不支持 ' + ext + '格式的视频播放';
          }else {
            me.url = url;
            me.videoMessage = '';
          }

        }, me);

        return false;
      },
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          this.download(rs, type);
        }
      },
      getDefaultFileInfo() {
        const ft = config.getConfig('IVIDEO_EDIT_FILE_TYPE_ID');
        const files = this.files;

        if (files.length === 0) {
          return {};
        }

        for (let j = 0, l = ft.length; j < l; j++) {
          for (let i = 0, len = files.length; i < len; i++) {
            if (files[i].FILETYPEID === ft[j]) {
              return files[i];
            }
          }
        }

        return {};
      },
      confirmCreateShelf(){
        this.shelfDialogBtnLoading = true;
        this.createShelfTask(true);
      },
      createShelf(){
        this.createShelfTask();
      },
      createShelfTask(force=false){
        const me = this;
        const postData = {
          objectId: me.videoId,
          name: me.shelfName,
          force: force,
          details: {},
          files: me.files,
          ownerName: me.program['FIELD314']
        };
        for(let key in me.basic){
          postData.details[key] = me.basic[key];
        }
        if(postData.details['OUTPOINT']){
          postData.details['duration'] = postData.details['OUTPOINT'] - postData.details['INPOINT'];
        }
        for(let key in me.program){
          postData.details[key] = me.program[key].value;
        }
        shelfApi.createShelfTask(postData).then((res) => {
          me.shelfDialogBtnLoading = false;
          me.shelfDialogVisible = false;
          me.$message.success('已经加入到上架中，请前去查看');
        }).catch((error) => {
          if(error === '之前上架过'){
            me.shelfDialogVisible = true;
            me.shelfDialogVisible = true;
          }else {
            me.$message.error(error);
          }
        });
      },
      prepareDownload(fileInfo) {
        if (fileInfo) {
          this.fileInfo = fileInfo;
        } else {
          this.fileInfo = this.getDefaultFileInfo();
        }

        if (isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以下载，下载其它信息可以到文件信息中选取下载');
          return false;
        }

        this.downloadDialogDisplay = true;
      },
      download(rs, type) {
        const me = this;
        const templateInfo = rs[type];
        const transferParams = rs[type + '_info'];

        const param = {
          objectid: this.fileInfo.OBJECTID,
//          如果不是打点下载，将inpoint，outpoint设置为'0'
//          inpoint: this.fileInfo.INPOINT,
//          outpoint: this.fileInfo.OUTPOINT,
          inpoint: 0,
          outpoint: 0,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: templateInfo._id
        };

        if(transferParams) {
          param.receiverId = transferParams.acceptor._id;
          param.receiverType = transferParams.acceptor.targetType;
        }

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });

        return false;
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        return rs;
      }
    }
  };
</script>

