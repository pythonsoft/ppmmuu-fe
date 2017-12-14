<template>
  <div class="media-right">
    <div class="media-video">
      <div v-if="url" class="media-video-wrap">
        <div class="media-video-content" id="video" ref="video">
          <player :videoId="videoId" :height="288" :width="448" :url="url" :streamInfo="streamInfo" :fromWhere="videoInfo.from_where"></player>
        </div>
        <div >
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="title"></div>
            <ul class="media-video-title-bar">
              <li @click.stop="prepareDownload()">
                <span title="下载" class="iconfont icon-video-download"></span>
              </li>
              <li @click.stop="gotoEditer">
                <span title="剪辑" class="iconfont icon-cut"></span>
              </li>
              <li @click.stop="showSourceMenu" ref="addtoBtn" v-clickoutside="closeSourceMenu">
                <span title="添加" class="iconfont icon-addto"></span>
              </li>
              <li @click.stop="createShelf">
                <span title="上架" class="iconfont icon-shangjialine"></span>
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
            <template v-if="programEmpty">无</template>
            <table class="media-center-table" v-else>
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
              <tr>
                <td class="item-info-key">近线位置: </td>
                <td class="item-info-value">{{ ARCHIVETYPE[file.ARCHIVETYPE].text }}</td>
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
        <fj-tab-pane label="视频片段" name="tab3">
          <div class="media-center-file-item media-center-file-item-bottom-line" v-if="fragments.length === 0">无</div>
          <div class="media-center-file-item media-center-file-item-bottom-line" v-else v-for="file in fragments">
            <table class="media-center-table">
              <tr>
                <td class="item-info-value" width="303" @click="$emit('update-list', fragments)">
                  <div class="media-center-list-title-wrap">
                    <span :class="getMediaFormatStyle(file, 'media-center-list-color-span')">
                      {{getMediaFormat(file)}}
                    </span>
                    <span :class="setThumbClass(file.id, 'media-center-list-title')" v-html="getTitle(file)"></span>
                  </div>
                  <ul class="media-center-list-bar">
                    <li>
                      <span title="分类" class="media-center-list-bar-color-span" v-html="file.program_type || '无分类'"></span>
                    </li>
                    <li>
                      <span title="编目类别" class="media-center-list-bar-color-span">{{ file.ccid }}</span>
                    </li>
                    <li v-if="file.f_str_187">
                      <span title="HOUSENO" class="media-center-list-bar-color-span">{{ file.f_str_187 }}</span>
                    </li>
                    <li v-if="file.f_str_314">
                      <span title="资源所属部门" class="media-center-list-bar-color-span">{{ file.f_str_314 }}</span>
                    </li>
                    <li>
                      <span title="发布时间">{{ formatTime(file.publish_time) || '无发布时间' }}</span>
                    </li>
                  </ul>
                </td>
              </tr>
            </table>
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
  import {
    getDuration,
    getThumb,
    getMediaFormat,
    getMediaFormatStyle,
    getReplaceName,
    getTitle,
  } from './common';
  import {
    isEmptyObject,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    formatTime,
    FROM_WHERE
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

  export default {
    name: 'right',
    directives: { Clickoutside },
    components: {
      'more-view': moreView,
      'download-list-view': downloadListView,
      Player
    },
    props: {
      videoInfo: { type: Object, default: {} },
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
        rootid: '',
        fragments: [],
        fileInfo: {},
        downloadDialogDisplay: false,
        shelfDialogVisible: false,
        shelfDialogBtnLoading: false,
        videoId: '',
        shelfName: '',
        programEmpty: false,
        FROM_WHERE: config.getConfig('FROM_WHERE'),
        UMP_FILETYPE_VALUE: config.getConfig('UMP_FILETYPE_VALUE'),
        ARCHIVETYPE: config.getConfig('ARCHIVETYPE')
      };
    },
    watch: {
      videoInfo(val) {
        this.title = this.getTitle(val);
        this.shelfName = this.title.replace(/<em>/g,'').replace(/<\/em>/g,'');
        if(this.shelfName.indexOf('.') !== -1) {
          this.shelfName = this.shelfName.slice(0, this.shelfName.lastIndexOf('.'));
        }
        this.program = {};
        this.poster = this.getThumb(val);
        this.item = val;
        this.videoId = val.id;
        this.rootid = val.rootid;
        this.getDetail();
        this.getStream();
        if(this.rootid) {
          this.getVideoFragments();
        }
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
      isProgramEmpty(){
        const program = this.program;
        for(let key in program){
          const info = program[key];
          if(info.value){
            return false;
          }
        }
        return true;
      },
      getDetail() {
        const me = this;
        api.getObject({ params: { objectid: this.item.id, fromWhere: this.videoInfo.from_where } }).then((res) => {
          const detail = res.data.result.detail;
          me.program = detail.program;
          if (isEmptyObject(detail.program)) {
            me.program = detail.sequence;
          }
          me.programEmpty = me.isProgramEmpty();
          me.basic = res.data.result.basic;
          me.files = res.data.result.files;
          delete me.program.OBJECTID;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      getVideoFragments() {
        const me = this;
        const options = {
          source: config.FILETR_FIELDS,
          match: [{key: 'rootid', value: me.rootid}],
          should: [],
          range: [],
          sort: {},
          start: 0,
          pageSize: 999
        };
        const fragments = [];
        api.esSearch(options)
          .then((res)=>{
            const docs = res.data.docs;
            for(let i = 0, len = docs.length; i < len; i++){
              if(docs[i].id !== me.rootid){
                fragments.push(docs[i]);
              }
            }
            me.fragments = fragments;
          })
          .catch((error)=>{
            me.$message.error(error);
          })
      },
      getThumb,
      getTitle,
      isEmptyObject,
      formatSize,
      getDuration,
      getMediaFormat,
      getMediaFormatStyle,
      getReplaceName,
      formatTime,
      setThumbClass(id, className) {
        let cn = className || '';

        // if (this.selectInfoId && this.selectInfoId === id) {
        //   cn += ' media-center-title-selected';
        // }

        return cn;
      },
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
        // if (isEmptyObject(this.fileInfo)) {
          this.fileInfo = this.getDefaultFileInfo();
        // }
        if (isEmptyObject(this.fileInfo)) {
          this.$message.error('当前没有视频可以进行编辑');
          return false;
        }

        const reqData = Object.assign({}, data);
        reqData.name = this.fileInfo.FILENAME;

        reqData.snippet = {
          objectId: this.basic.OBJECTID,
          thumb: this.poster,
          input: this.basic.INPOINT,
          output: this.basic.OUTPOINT,
          duration: this.basic.OUTPOINT - this.basic.INPOINT,
          fileTypeId: this.fileInfo.FILETYPEID,
          fromWhere: this.videoInfo.from_where || FROM_WHERE.MAM
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
          objectId: this.basic.OBJECTID,
          thumb: this.poster,
          input: this.basic.INPOINT,
          output: this.basic.OUTPOINT,
          duration: this.basic.OUTPOINT - this.basic.INPOINT,
          fileTypeId: this.fileInfo.FILETYPEID,
          fromWhere: this.videoInfo.from_where || FROM_WHERE.MAM
        };

        ivideoAPI.createItem(reqData).then((response) => {
          this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id, fromWhere: this.videoInfo.from_where } });
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      getStream() {
        const me = this;

        getStreamURL(this.item.id, this.videoInfo.from_where, (err, url, rs) => {
          if (err) {
            me.$message.error(err);
            return;
          }
          me.streamInfo = rs.result;
          me.url = url;
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

        if(this.videoInfo.from_where*1 === this.FROM_WHERE.UMP){
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
          fromWhere: me.videoInfo.from_where,
          force: force,
        };
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

        let inpoint = 0;
        let outpoint = 0;

        //说明是片断子类，这个是需要打点下载的
        if(me.basic['OBJECTID'] !== me.basic['ROOTID']) {
          inpoint = this.fileInfo.INPOINT;
          outpoint = this.fileInfo.OUTPOINT;
        }

        //如果不是打点下载，将inpoint，outpoint设置为'0'
        const param = {
          objectid: this.fileInfo.OBJECTID || '',
          inpoint: inpoint,
          outpoint: outpoint,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID || '',
          templateId: templateInfo._id,
          fromWhere: this.videoInfo.from_where || FROM_WHERE.MAM,
          fileId: this.fileInfo._id || ''
        };

        if(transferParams) {
          param.receiverId = transferParams.acceptor._id;
          param.receiverType = transferParams.acceptor.targetType;
        }

        jobAPI.download(param).then((res) => {
          if(res.data === 'audit'){
            me.$message.success('您下载文件需要审核，请到"任务-下载任务-待审核"查看详细情况');
          }else {
            me.$message.success('正在下载文件，请到"任务"查看详细情况');
          }
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

