<template>
  <div class="media-right">
    <div class=" media-video">
      <div v-if="!isEmptyObject(item)" class="media-video-wrap">
        <div class="media-video-content">
          <video v-if="url" :poster="poster" height="247" width="439" controls autoplay>
            <source type="video/mp4" :src="url" />
            Your browser does not support the video tag.
          </video>
        </div>
        <div >
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="title"></div>
            <ul class="media-video-title-bar">
              <li>
                <span title="下载" class="iconfont icon-video-download"></span>
              </li>
              <li @click.stop="openMovieEditor">
                <span title="视频编辑" class="iconfont icon-cut"></span>
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
              <tr v-for="info in program" v-if="info.value" >
                <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                <td class="item-info-value">
                  <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
                  <span v-else>{{ info.value }}</span>
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
              <fj-button type="info" size="mini" @click="downloadClick">下载</fj-button>
            </div>
          </div>
        </fj-tab-pane>
      </fj-tabs>
    </div>
  </div>
</template>
<script>
  import './index.css';
  import { getTitle, getThumb } from './common';
  import { isEmptyObject, formatSize, formatDuration, formatContent } from '../../common/utils';
  import moreView from './moreView';

  const config = require('../../config');

  const api = require('../../api/media');

  export default {
    name: 'right',
    components: {
      'more-view': moreView
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
      };
    },
    watch: {
      videoInfo(val) {
        this.title = this.getTitle(val);
        this.program = {};
        this.poster = this.getThumb(val);
        this.item = val;
        this.getDetail();
        this.getStream();
      }
    },
    created() {

    },
    methods: {
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
      downloadClick() {

      },
      openMovieEditor() {
        this.$emit('showMovieEditor', true);
      },
      getBlobURL(url, mime, callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("get", url);
        xhr.responseType = "arraybuffer";

        xhr.addEventListener("load", function() {

          var arrayBufferView = new Uint8Array( this.response );
          var blob = new Blob( [ arrayBufferView ], { type: mime } );
          var url = null;

          if ( window.webkitURL ) {
            url = window.webkitURL.createObjectURL(blob);
          } else if ( window.URL && window.URL.createObjectURL ) {
            url = window.URL.createObjectURL(blob);
          }

          callback(url, blob);
        });
        xhr.send();
      },
      getStream() {
        const me = this;
        api.getStream({ params: { objectId: this.item.id } }).then((res) => {
          let dateString = res.result.UNCPATH;
          const fileName = res.result.FILENAME;
          if(dateString) {
            dateString = dateString.replace('\\', '\\\\').match(/\\\d{4}\\\d{2}\\\d{2}/g);
            if(dateString.length === 1) {
              dateString = dateString[0].replace(/\\/g, '\/');
            }
            //streamURL = 'hkss4.phoenixtv.com/u/mp4:';
            const url = 'http://' + config.defaults.streamURL + dateString + '/' + fileName;
//            me.url = 'http://hkss4.phoenixtv.com/vod/mp4:x/2017/07/AJ/12d9fde7-afd7-499f-b8af-92b2e89ad7ca.mp4/playlist.m3u8';
//            me.getBlobURL(url, 'video/mp4', (url, blob) => {
//              me.url = url;
//            });

//            if(window.navigator.userAgent.indexOf("Chrome") !== -1) {
//              me.url = '/img/test.mp4';
////              me.url = 'mp4:' + dateString + '/' + fileName;
////              rtmpPlayer()
//            }else {
//              me.url = (url + '/playlist.m3u8').replace('mp4:', 'mp4:x');
//            }

//            me.url = (url + '/playlist.m3u8').replace('mp4:', 'mp4:x');
            me.url = '/img/test.mp4';

            console.log('=========>', me.url);
          }
        }).catch((error) => {
          me.$message.error(error);
        });
      }
    }
  };
</script>

