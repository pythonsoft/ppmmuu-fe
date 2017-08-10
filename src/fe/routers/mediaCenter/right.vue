<template>
  <div class="media-right">
    <div class=" media-video">
      <div v-if="!isEmptyObject(item)" class="media-video-wrap">
        <video controls="controls" autoplay="autoplay" :poster="poster" height="247" width="439">
          <source src="http://hkss3.phoenixtv.com/live/pic.stream_720p/playlist.m3u8" />
          Your browser does not support the video tag.
        </video>
        <div class="media-video-title">
          {{title}}
        </div>
      </div>
      <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
    </div>
    <div class="media-video-panel">
      <fj-tabs v-if="!isEmptyObject(item)" v-model="activeTabName" @tab-click="handleTabClick" class="media-video-panel-wrap">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="item-infos">
            <div class="item-info" v-for="info in program" v-if="info.value">
              <div class="item-info-key">{{ info.cn + ': ' || '空KEY:' }}</div>
              <div class="item-info-value">{{ info.value }}</div>
              <div class="clearfix"></div>
            </div>
          </div>
        </fj-tab-pane>
        <fj-tab-pane label="文件信息" name="tab2">
          <div class="media-center-file-item" v-for="file in files">
            <div class="item-info">
              <div class="item-info-key">文件名:</div>
              <div class="item-info-value">{{ file.FILENAME }}</div>
              <div class="clearfix"></div>
            </div>
            <div class="item-info">
              <div class="item-info-key">文件大小:</div>
              <div class="item-info-value">{{ formatSize(file.FILENAME) }}</div>
              <div class="clearfix"></div>
            </div>
            <div class="item-info">
              <div class="item-info-key">时长:</div>
              <div class="item-info-value">{{ file.FILENAME }}</div>
              <div class="clearfix"></div>
            </div>
            <div class="item-info">
              <div class="item-info-key">文件名:</div>
              <div class="item-info-value">{{ file.FILENAME }}</div>
              <div class="clearfix"></div>
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
  import { isEmptyObject, formatSize } from '../../common/utils';

  const api = require('../../api/media');

  export default {
    name: 'right',
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
    }
  };
</script>

