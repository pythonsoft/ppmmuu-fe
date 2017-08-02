<template>
  <div class="media-right">
    <div class="media-video">
      <video controls="controls" autoplay="autoplay" :poster="poster" height="246px" width="439px">
        <source src="blob:https://www.youtube.com/543f657b-4ed5-4546-88a1-fb3a149d00e7" />
        Your browser does not support the video tag.
      </video>
    </div>
    <div class="media-video-title">
      {{currentVideo.program_name_en || currentVideo.name}}
    </div>
    <div class="media-video-panel">
      <fj-tabs v-model="activeTabName" @tab-click="handleTabClick">
        <fj-tab-pane label="条目信息" name="tab1">
          <div class="item-infos">
            <div class="item-info" v-for="infoItem in program">
              <span class="item-info-key">{{infoItem.cn + ': '}}</span>
              <span class="item-info-value">{{infoItem.value}}</span>
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
          a: {
            cn: '素材名字',
            value: 'testtttt'
          },
          b: {
            cn: '素材名字',
            value: 'testtttt'
          } },
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
        for (let i = 0; i < 300; i++) {
          this.program[`a${i}`] = {
            cn: '素材名字',
            value: 'testtttt'
          };
        }
        const me = this;
        api.getObject({ params: { objectid: this.item.id } })
          .then((res) => {
            me.program = res.result.detail.program;
          }).catch((error) => {
            me.$message.error(error);
          });
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
    overflow: scroll;
  }

  .item-infos {
    padding: 8px 30px 0 0px;
  }

  .item-info {
    margin-top: 6px;
  }

  .item-info-key {
    display: inline-block;
    text-align: right;
    width: 80px;
  }

  .item-info-value {
    display: inline-block;
  }
</style>
