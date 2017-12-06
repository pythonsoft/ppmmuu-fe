<template>
  <div class="page-wrap">
    <div class="return-bar watch-return-bar">
      <i class="iconfont icon-arrow-left icon-return" @click="back"></i>
      <h3 class="watch-title has-return-btn">{{ filename }}</h3>
    </div>
    <video
      @contextmenu.prevent="()=>{return false;}"
      class="player"
      :style="{height: `${videoHeight}px`}"
      :src="url"
      :poster="getThumb({ id: this.objectId })"
      ref="video"
      crossorigin="anonymous"
      preload="auto"
      webkit-playsinline
      playsinline
      controls
      ></video>
    <fj-navbar v-model="navIndex">
      <fj-tab-item id="nav1">
        概述
      </fj-tab-item>
      <fj-tab-item id="nav2">
        文件信息
      </fj-tab-item>
    </fj-navbar>
    <div class="media-center-file-item first-child" v-if="navIndex === 'nav1'">
      <table class="media-center-table">
        <div v-if="isEmptyObject(program)">无</div>
        <tr v-for="info in program" v-if="info.value" >
          <td class="item-info-key">{{ info.cn + ': ' || '空KEY:' }}</td>
          <td class="item-info-value">
            <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
            <span v-else>{{ formatValue(info.value) }}</span>
          </td>
        </tr>
      </table>
    </div>
    <template v-else>
      <div :class="['media-center-file-item media-center-file-item-bottom-line', { 'first-child': index === 0 }]" v-for="(file, index) in files">
        <span v-if="index === 0" class="operation-btn" @click="prepareDownload()">下载</span>
        <table class="media-center-table">
          <tr>
            <td class="item-info-key">文件名: </td>
            <td class="item-info-value">
              <div class="media-center-file-name">
                {{ file.FILENAME || '无文件名' }}
              </div>
              <span class="media-center-file-type">
                {{ file.SANAME || '无信息' }}
              </span>
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
      </div>
      <action-sheet :visible.sync="actionsheetVisible" :actions="actionsheetMenu" @click-menu="handleCurrentChange"></action-sheet>
    </template>
    <div class="video-list">
      <div class="category-header">
        <h3 class="category-title">更多节目</h3>
      </div>
      <ul class="clearfix" :style="{marginLeft: '-3px'}">
        <fj-card
          width="50%"
          v-for="item in items"
          :key="item.id"
          :thumb="getThumb(item)"
          :title="getTitle(item)"
          :time="formatTime(item.publish_time) || '无发布时间'"
          :duration="getDuration(item)"
          :definition="getMediaFormat(item)"
          @click-card="linkToWatch(item)"
          :highlight="false"></fj-card>
      </ul>
    </div>
  </div>
</template>
<script>
  import {
    getDuration,
    getMediaFormat,
    getTitle,
    getThumb,
  } from '../../../fe/routers/mediaCenter/common';
  import {
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    isEmptyObject,
    formatQuery,
    formatTime,
  } from '../../../fe/common/utils';
  import {
    formatMust,
    HHIGHLIGHT_FIELDS1,
    HHIGHLIGHT_FIELDS2,
    FILETR_FIELDS,
    getConfig
  } from '../../../fe/routers/mediaCenter/config';
  import ActionSheet from './actionSheet';
  import './index.css';

  const taskConfig = require('../../../fe/routers/management/task/config');

  const userAPI = require('../../../fe/api/user');
  const mediaAPI = require('../../../fe/api/media');
  const jobAPI = require('../../../fe/api/job');
  export default {
    data() {
      return {
        url: '',
        streamInfo: {},
        objectId: '',
        videoHeight: 0,
        program: {},
        fileInfo: {},
        currentRow: {},
        basic: {},
        files: [],
        items: [],
        navIndex: 'nav1',
        ext: '_info',
        actionsheetVisible: false,
        type: '',
        permissions: [],
        actionsheetMenu: [],
        fromWhere: 'MAM',
        filename: ''
      };
    },
    watch: {
      actionsheetVisible(val) {
        if (val) {
          this.listUsableTemplate();
        }
      },
      '$route.params.objectId'(val) {
        this.refresh();
      }
    },
    mounted() {
      if (this.$route.params.objectId) {
        this.refresh();
      }
      const videoWidth = this.$refs.video.getBoundingClientRect().width;
      this.videoHeight = videoWidth * 2 / 3;
    },
    methods: {
      getTitle,
      getThumb,
      getDuration,
      formatContent,
      formatSize,
      formatDuration,
      getMediaFormat,
      formatTime,
      isEmptyObject,
      linkToWatch(item) {
        this.$router.push({ name: 'watch', params: { objectId: item.id } });
      },
      back() {
        this.$router.go(-1);
        // this.$router.push({ name: 'mediaCenter' });
      },
      refresh() {
        this.objectId = this.$route.params.objectId;
        this.fromWhere = this.$route.params.fromWhere;
        this.getDetail();
        this.getStream();
        // this.poster = getThumb({ id: this.objectId });
      },
      updateList() {
        const options = {
          source: FILETR_FIELDS,
          match: [],
          hl: HHIGHLIGHT_FIELDS1,
          sort: {},
          start: 0,
          pageSize: 8
        };
        const must = options.match;

        const obj = {
          full_text: this.streamInfo.FILENAME,
          publish_status: 1
        };

        formatMust(must, obj);
        options.sort = [{
          key: 'publish_time',
          value: 'desc'
        }];
        options.isRelated = true;

        mediaAPI.esSearch(options).then((res) => {
          this.items = res.data.docs;
        }).catch((error) => {
          // console.log('error', error);
        });
      },
      getStream() {
        getStreamURL(this.objectId, this.fromWhere, (err, url, rs) => {
          if (err) {
            this.$toast.error(err);
            return;
          }
          this.streamInfo = rs.result;
          document.title = rs.result.FILENAME;
          this.filename = rs.result.FILENAME;
          this.updateList();
          this.url = url;
        });
      },
      getDetail() {
        const params = {
          objectid: this.objectId,
          fromWhere: this.fromWhere
        };
        mediaAPI.getObject({ params: params }).then((res) => {
          this.program = res.data.result.detail.program;
          this.files = res.data.result.files;
          this.basic = res.data.result.basic;
          delete this.program.OBJECTID;
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      formatValue(str) {
        let rs = str;
        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }
        return rs;
      },
      getDefaultFileInfo() {
        const ft = getConfig('IVIDEO_EDIT_FILE_TYPE_ID');
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
          this.$toast.error('当前没有视频可以下载，下载其它信息可以到文件信息中选取下载');
          return;
        }
        this.actionsheetVisible = true;
      },
      listUsableTemplate() {
        this.actionsheetMenu = [{name: '正在加载数据...'}];
        const param = {
          page: 1,
          pageSize: 100,
        };

        userAPI.listUsableTemplate({ params: param }).then((res) => {
          const data = res.data.docs;
          this.actionsheetMenu = data.map(function(item) {
            let desc = item._id;
            if (item.description) {
              desc += `, ${item.description}`;
            }
            item.desc = desc;
            return item;
          });
        }).catch((error) => {
          this.$toast.error(error);
        });
      },
      download(rs, type) {
        const templateInfo = rs[type];
        const transferParams = rs[type + '_info'];

        let inpoint = 0;
        let outpoint = 0;

        //说明是片断子类，这个是需要打点下载的
        if(this.basic['OBJECTID'] !== this.basic['ROOTID']) {
          inpoint = this.fileInfo.INPOINT;
          outpoint = this.fileInfo.OUTPOINT;
        }

        //如果不是打点下载，将inpoint，outpoint设置为'0'
        const param = {
          objectid: this.fileInfo.OBJECTID,
          inpoint: inpoint,
          outpoint: outpoint,
          filename: this.fileInfo.FILENAME,
          filetypeid: this.fileInfo.FILETYPEID,
          templateId: templateInfo._id,
          source: this.fromWhere || 'MAM'
        };

        if(transferParams) {
          param.receiverId = transferParams.acceptor._id;
          param.receiverType = transferParams.acceptor.targetType;
        }

        jobAPI.download(param).then((res) => {
          if(res.data === 'audit'){
            this.$toast.success('您下载文件需要审核，请到"任务-下载任务-待审核"查看详细情况');
          }else {
            this.$toast.success('正在下载文件，请到"任务"查看详细情况');
          }
          this.actionsheetVisible = false;
        }).catch((error) => {
          this.$toast.error(error);
        });

        return false;
      },
      downloadListConfirm(rs, type) {
        if (!isEmptyObject(rs)) {
          this.download(rs, type);
        }
      },
      handleCurrentChange(current) {
        if(typeof current.type !== 'undefined') {
          this.type = current.type;
        }
        this.currentRow[this.type] = current;
        if(this.type === taskConfig.getConfig('NODE_TEMPLATE', 'DOWNLOAD_MEDIAEXPRESS').value) {
          this.getPermission();
          this.type = this.type + this.ext;
          this.currentRow[this.type] = current;
        } else {
          this.downloadListConfirm(this.currentRow, this.type.replace(this.ext, ''));
        }
      },
      getPermission() {
        this.actionsheetMenu = [{name: '正在加载数据...'}];
        userAPI.directAuthorizeAcceptorList({ params: {} }).then((res) => {
          const data = res.data;
          this.actionsheetMenu = data.map((item)=> {
            item.name = item.acceptor.name;
            item.desc = this.getTargetType(item.acceptor.targetType);
            return item;
          });
          if(this.actions.length === 0) {
            this.$toast('您的授权列表没有相关信息');
          }
        }).catch((error) => {
        });
      },
      getTargetType(v) {
        return taskConfig.getTextByValue(v + '', 'TARGET_TYPE');
      }
    },
    components: {
      ActionSheet
    }
  };
</script>
