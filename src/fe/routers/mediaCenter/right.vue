<template>
  <div class="media-right">
    <div class="media-video">
      <video controls="controls" autoplay="autoplay" :poster="poster" height="246px" width="439px">
        <source src="http://hkss3.phoenixtv.com/live/pic.stream_360p/playlist.m3u8" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="media-video-title">
      {{getShortName()}}
    </div>
    <div class="media-video-panel">
      <fj-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="item-infos">
            <div class="item-info" v-for="infoItem in program">
              <div class="item-info-key">{{infoItem.cn + ': '}}</div>
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
        program: {
        },
        poster: '',
        activeTabName: 'tab1',
        item: {}
      };
    },
    watch: {
      currentVideo(val) {
        this.item = val;
        this.poster = this.getThumb();
        this.getDetail();
      }
    },
    created() {
    },
    mounted() {
    },
    methods: {
      getThumb() {
        return api.getIcon(this.item.id);
      },
      handleTabClick(tab) {
        console.log(tab);
      },
      getDetail() {
        const me = this;
        api.getObject({ params: { objectid: this.item.id } })
          .then((res) => {
            me.program = res.result.detail.program;
            delete me.program.OBJECTID;
          }).catch((error) => {
            me.$message.error(error);
          });
      },
      getShortName() {
        let name = this.item.program_name_en || '';
        if (name && name.length > 15) {
          name = `${name.substr(0, 10)}...`;
        }
        return name;
      }
    }
  };
</script>
<style>
  .media-right {
    width: 100%;
    height: 100%;
    border-left: 4px solid  #F2F6FA;
  }

  .media-video-title {
    background: #2A3E52;
    height: 42px;
    line-height: 42px;
    padding-left: 7px;
    font-size: 13px;
    color: #FFFFFF;
  }

  .media-video-panel {
    background: #F8FAFB;
    font-size: 12px;
    color: #2A3E52;
    height: 100%;
    width: 100%;
  }

  .item-infos {
    padding: 8px 30px 0 0px;
    width: 100%;
    height: 800px;
    overflow-y: scroll;
  }

  .item-info {
    margin-top: 6px;
    position:relative;
  }

  .item-info-key {
    text-align: right;
    width: 80px;
    float:left;
  }

  .item-info-value {
    float: left;
    width: 320px;
    margin-left: 5px;
  }
</style>
