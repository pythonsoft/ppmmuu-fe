<template>
  <div class="media-right">
    <div class="media-video">
      <div v-if="url && isOnTape" class="iconfont icon-tape media-video-wrap-bg"></div>
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
              <li @click.stop="createAskShelf">
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
      <p v-if="isOnTape" class="media-video-empty-text">此节目在磁带上，请联系PMD部门采集</p>
      <fj-tabs v-else-if="!isEmptyObject(item)" v-model="activeTabName" @tab-click="handleTabClick" class="media-video-panel-wrap">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="media-center-file-item">
            <template v-if="programEmpty">无</template>
            <template v-for="groupItem in programGroup" v-else>
              <h4 class="media-center-table-title">{{ groupItem.groupName }}</h4>
              <table class="media-center-table">
                <tr v-for="index in groupItem.programIndexs" v-if="program[index] && program[index].value" >
                  <td class="item-info-key" width="80">{{ program[index].cn + ': ' || '空KEY:' }}</td>
                  <td class="item-info-value clearfix">
                    <span v-if="program[index].isFoldedContent" class="inline-info" v-html="formatContent(program[index].value).slice(0, 68) + '...'"></span>
                    <span class="item-expand-btn" v-if="program[index].isFoldedContent" @click="expand(program[index], index)">详细<i class="tri-bottom"></i></span>
                    <template v-else>
                      <span v-html="formatContent(program[index].value)"></span>
                    </template>
                    <span class="item-folded-btn" v-if="program[index].value.length > 68 && !program[index].isFoldedContent" @click="folded(program[index], index)">收起<i class="tri-top"></i></span>
                  </td>
                </tr>
              </table>
            </template>
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
                <td class="item-info-key">存储位置: </td>
                <td class="item-info-value">{{ getArchivetype(file) }}</td>
              </tr>
              <tr>
                <td class="item-info-key">文件状态: </td>
                <td class="item-info-value">{{ FILE_STATUS[file.STATUS].text }}</td>
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
        <fj-tab-pane label="视频片段" name="tab3">
          <div class="media-center-file-item" v-if="fragmentsTree.length === 0 || fragmentsTree[0].children.length === 0">无</div>
          <fj-tree
            v-else
            :default-expanded-key="fragmentsTree[0].id"
            :data="fragmentsTree"
            node-key="id"
            @node-click="$emit('update-list', fragments)"></fj-tree>

          <!-- <div class="media-center-file-item media-center-file-item-bottom-line" v-else v-for="file in fragments">
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
          </div> -->
        </fj-tab-pane>
      </fj-tabs>
    </div>
    <fj-dialog
            title="提示"
            :visible.sync="shelfAskDialogVisible">
      <p>请确认此节目的视频、信息和版权符合售卖要求，若要继续，请点击确认</p>
      <div slot="footer" class="dialog-footer">
        <fj-button @click.stop="shelfAskDialogVisible=false">取消</fj-button><!--
        --><fj-button type="primary" :loading="shelfAskDialogBtnLoading" @click.stop="createShelf">确定</fj-button>
      </div>
    </fj-dialog>
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
    <template-browser
            :visible.sync="templateBrowserVisible"
            groupName="media_direct_shelf"
            @confirm="warehouse"
    ></template-browser>
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
    formatProgramGroup
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
  import TemplateBrowser from '../movieEditor/component/templateBrowser';

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
      Player,
      TemplateBrowser
    },
    props: {
      videoInfo: { type: Object, default: {} },
    },
    data() {
      return {
        title: '',
        programGroup: [],
        program: [],
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
        fragmentsTree: [],
        fileInfo: {},
        downloadDialogDisplay: false,
        shelfDialogVisible: false,
        shelfDialogBtnLoading: false,
        shelfAskDialogVisible: false,
        shelfAskDialogBtnLoading: false,
        templateBrowserVisible: false,
        videoId: '',
        shelfName: '',
        programEmpty: false,
        FROM_WHERE: config.getConfig('FROM_WHERE'),
        UMP_FILETYPE_VALUE: config.getConfig('UMP_FILETYPE_VALUE'),
        ARCHIVETYPE: config.getConfig('ARCHIVETYPE'),
        FILE_STATUS: config.getConfig('FILE_STATUS'),
        force: false,
        warehouseData: {},
        FILE_STATUS: config.getConfig('FILE_STATUS'),
        isOnTape: false,
        objectId: '',
        originalBasic: {},
      };
    },
    watch: {
      videoInfo(val) {
        if (!val.id) {
          this.item = {};
          this.videoId = '';
          this.rootid = '';
          this.url = '';
          return;
        }
        this.title = this.getTitle(val);
        const programMameCN = val.program_name_cn;
        if(programMameCN){
          this.shelfName = programMameCN.replace(/<em>/g, '').replace(/<\/em>/g, '');
        }else {
          this.shelfName = this.title.replace(/<em>/g, '').replace(/<\/em>/g, '');
          if (this.shelfName.indexOf('.') !== -1) {
            this.shelfName = this.shelfName.slice(0, this.shelfName.lastIndexOf('.'));
          }
        }
        this.program = [];
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
      files(val) {
        this.isOnTape = config.isOnTape(val, this.videoInfo.from_where);
      }
    },
    created() {
    },
    methods: {
      getArchivetype(file) {
        return config.getVideoPosition(file.FILETYPEID, file.STATUS, file.ARCHIVETYPE);
      },
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
        if(program.length > 0){
          return false;
        }
        return true;
      },
      getDetail() {
        const me = this;
        api.getObject({ params: { objectid: this.item.id, fromWhere: this.videoInfo.from_where } }).then((res) => {
          me.objectId = res.data.result.basic.OBJECTID;
          me.originalBasic = JSON.parse(JSON.stringify(res.data.result.basic));
          const detail = res.data.result.detail;
          const program = detail.program.length > 0 ? detail.program : detail.sequence;
          me.program = program;

          this.programGroup = formatProgramGroup(program);

          if (isEmptyObject(detail.program)) {
            me.program = detail.sequence;
          }
          me.programEmpty = me.isProgramEmpty();
          me.basic = res.data.result.basic;
          me.files = res.data.result.files;
          for(let i =0, len = this.program.length; i < len; i++){
            if(this.program[i].key === 'OBJECTID'){
              this.program.splice(i, 1);
              break;
            }
            const info = this.program[i];
            if (this.formatContent(info.value).length > 68) {
              info.isFoldedContent = true;
            }
          }
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
        const fragmentsTree = [];
        const children = [];
        api.esSearch(options)
          .then((res)=>{
            const docs = res.data.docs;
            for(let i = 0, len = docs.length; i < len; i++){
              const name = `${getTitle(docs[i])}    ${getDuration(docs[i])}`;
              const item = Object.assign({}, docs[i], { name: name });
              if(docs[i].id !== me.rootid){
                children.push(item);
              } else {
                fragmentsTree.push(item);
              }
              fragments.push(docs[i]);
            }
            for(let i = 0; i < fragmentsTree.length; i++) {
              const fragment = fragmentsTree[i];
              fragment.children = [];
              for(let j = 0; j < children.length; j++) {
                if (children[j].rootid === fragment.id) {
                  fragment.children.push(children[j]);
                }
              }
            }
            me.fragmentsTree = fragmentsTree;
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
            this.$router.push({ name: 'movieEditor', params: { objectId: this.item.id, fromWhere: this.videoInfo.from_where } });
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

        if(this.videoInfo.from_where === this.FROM_WHERE.HK_RUKU){
          for (let j = 0, l = this.UMP_FILETYPE_VALUE.length; j < l; j++) {
            for (let i = 0, len = files.length; i < len; i++) {
              if (files[i].type === this.UMP_FILETYPE_VALUE[j] || files[i].FILETYPE == this.UMP_FILETYPE_VALUE[j]) {
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
      warehouse(row) {
        if (row) {
          const params = row.params;
          const file = this.getDefaultFileInfo();
          const objectId = this.videoInfo.from_where === this.FROM_WHERE.HK_RUKU ? this.objectId : file.OBJECTID;
          const reqData = {
            workflowId: params.workflowId,
            priority: params.priority || 0,
            shelveTemplateId: params.shelveTemplateId,
            fileName: file.FILENAME,
            objectId,
            fileTypeId: file.FILETYPEID,
            fromWhere:  this.videoInfo.from_where,
            catalogName: this.shelfName || '',
            force: this.force,
          };

          for (let i = 0, len = params.length; i < len; i++) {
            if (params[i].key === 'workflowId') {
              reqData.workflowId = params[i].value;
            } else if (params[i].key === 'shelveTemplateId') {
              reqData.shelveTemplateId = params[i].value;
            } else if (params[i].key === 'priority') {
              reqData.priority = params[i].value;
            }
          }
          this.warehouseData = reqData;
        }
        this.warehouseData.force = this.force;

        const loading = !this.force ? 'shelfAskDialogBtnLoading' : 'shelfDialogBtnLoading';
        const visible = !this.force ? 'shelfAskDialogVisible' : 'shelfDialogVisible';

        this[loading] = true;
        this.templateBrowserVisible = false;
        shelfApi.warehouse(this.warehouseData)
            .then((res) => {
              this[loading] = false;
              this[visible] = false;
              this.$message.success('上架成功');
            })
            .catch((error) => {
              if(error === '之前上架过') {
                this[loading] = false;
                this[visible] = false;
                this.shelfDialogVisible = true;
              } else {
                this[loading] = false;
                this[visible] = false;
                this.$message.error(error);
              }
            })
      },
      confirmCreateShelf() {
        this.force = true;
        this.warehouse();
      },
      createAskShelf() {
        this.shelfAskDialogVisible = true;
        this.shelfAskDialogBtnLoading = false;
      },
      createShelf(){
        this.templateBrowserVisible = true;
        this.force = false;
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

        let inpoint = '0';
        let outpoint = '0';

        const objectId = this.videoInfo.from_where === this.FROM_WHERE.HK_RUKU ? this.objectId : this.fileInfo.OBJECTID;

        let reqData = {};

        //说明是片断子类，这个是需要打点下载的
        if(this.originalBasic['ROOTID'] && this.originalBasic['OBJECTID'] !== this.originalBasic['ROOTID']) {
          inpoint = formatDuration(this.fileInfo.INPOINT, true);
          outpoint = formatDuration(this.fileInfo.OUTPOINT, true);
          reqData = {
            name: 'Download',
            workflowId: '0dfa68fa-2f25-4d8c-a466-bc7c24b3b0d6',
            parms: {
              bucketId: '',
              orgFiles: [
                {
                  objectId: objectId || '',
                  fromWhere: this.videoInfo.from_where || FROM_WHERE.MAM,
                  fileType: this.fileInfo.FILETYPEID || '',
                  fileName: this.fileInfo.FILENAME,
                  parts: inpoint + ',' + outpoint,
                }
              ],
              transcodeTemplateId: '',
              downloadType: '1'  // 分段下载
            },
            templateId: templateInfo._id,
            priority: 0,
          };
          reqData.parms.orgFiles = JSON.stringify(reqData.parms.orgFiles);
        } else {
          reqData = {
            name: 'Download',
            workflowId: '0dfa68fa-2f25-4d8c-a466-bc7c24b3b0d6',
            parms: {
              bucketId: '',
              objectId: objectId || '',
              from: this.videoInfo.from_where || FROM_WHERE.MAM,
              fileTypeId: this.fileInfo.FILETYPEID || '',
              fileName: this.fileInfo.FILENAME,
              transcodeTemplateId: '',
              downloadType: '0'  // 完整下载
            },
            templateId: templateInfo._id,
            priority: 0,
          };
        }

        jobAPI.download(reqData).then((res) => {
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

