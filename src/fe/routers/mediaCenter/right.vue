<template>
  <div class="media-right">
    <div class=" media-video">
      <div v-if="currentVideo.id" class="media-video-wrap">
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
      <fj-tabs v-if="currentVideo.id" v-model="activeTabName" @tab-click="handleTabClick" class="media-video-panel-wrap">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="item-infos">
            <div class="item-info" v-for="infoItem in program" v-if="infoItem.value">
              <div class="item-info-key">{{infoItem.cn + ': ' || '空KEY:'}}</div>
              <div class="item-info-value">{{infoItem.value}}</div>
              <div class="clearfix"></div>
            </div>
          </div>
        </fj-tab-pane>
        <fj-tab-pane label="文件信息" name="tab2"></fj-tab-pane>
      </fj-tabs>
    </div>
  </div>
</template>
<script>
  import './index.css';
  const api = require('../../api/media');

  export default {
    name: 'right',
    props: {
      currentVideo: {
        type: Object,
        default: {}
      }
    },
    data() {
      return {
        title: '',
        program: {},
        poster: '',
        activeTabName: 'tab1',
        item: {}
      };
    },
    watch: {
      currentVideo(val) {
        this.item = val;
        this.poster = this.getThumb();
        this.title = this.getTitle(this.currentVideo);
        this.getDetail();
      }
    },
    created() {
      this.title = this.getTitle(this.currentVideo);
    },
    methods: {
      getThumb() {
        return api.getIcon(this.item.id);
      },
      handleTabClick(tab) {  },
      getDetail() {
        const me = this;
        api.getObject({ params: { objectid: this.item.id } }).then((res) => {
          me.program = res.result.detail.program;
          delete me.program.OBJECTID;
        }).catch((error) => {
          me.$message.error(error);
        });
      },
      getTitle(item) {
        return item.program_name_en || item.program_name_cn || item.name || '(此视频不包含标题信息)';
      }
    }
  };
</script>

