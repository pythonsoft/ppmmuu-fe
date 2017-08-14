<template>
  <div class="media-right">
    <div class=" media-video">
      <div v-if="!isEmptyObject(item)" class="media-video-wrap">
        <video controls="controls" autoplay="autoplay" :poster="poster" height="247" width="439">
          <source src="http://hkss3.phoenixtv.com/live/pic.stream_720p/playlist.m3u8" />
          Your browser does not support the video tag.
        </video>
        <div class="media-video-title" v-html="title">
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
                <td class="item-info-value" v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></td>
                <td class="item-info-value" v-else >
                  {{ info.value }}
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
                <td class="item-info-value">
                  <div class="media-center-file-name">
                    {{ file.FILENAME }}
                    <span class="media-center-file-type">
                      {{ file.SANAME }}
                    </span>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="item-info-key" width="80">文件大小: </td>
                <td class="item-info-value">{{ formatSize(file.FILESIZE) }}</td>
              </tr>
              <tr>
                <td class="item-info-key" width="80">时长: </td>
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
        item: {}
      };
    },
    watch: {
      videoInfo(val) {
        this.title = this.getTitle(val);
        this.program = {};
        this.poster = this.getThumb(val);
        this.item = val;
        this.getDetail();
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

      }
    }
  };
</script>

