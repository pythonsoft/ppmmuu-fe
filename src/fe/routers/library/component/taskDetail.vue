<template>
  <transition name="slide-in-right">
    <div v-show="visible" class="slide-dialog-wrapper" v-clickoutside="handleClose">
      <div class="task-detail-video">
        <div v-if="url" class="media-video-wrap">
          <div class="media-video-content" id="video" ref="video">
            <player :videoId="videoId" :height="288" :width="448" :url="url" :streamInfo="streamInfo"></player>
          </div>
          <div >
            <div class="media-video-title-wrap">
              <div class="media-video-title" :title="streamInfo.FILENAME" v-html="streamInfo.FILENAME"></div>
            </div>
          </div>
        </div>
        <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
      </div>
      <div class="task-detail-video-panel">
        <fj-tabs v-if="files.length>0" v-model="activeTabName" class="media-video-panel-wrap">
          <fj-tab-pane label="文件信息" name="tab2">
            <div class="media-center-file-item media-center-file-item-bottom-line" v-for="file in files">
              <table class="media-center-table">
                <tr>
                  <td class="item-info-key" width="80">文件名: </td>
                  <td class="item-info-value" width="303">
                    <div class="media-center-file-name">
                      {{ file.name || '无文件名' }}
                      <span class="media-center-file-type">
                        {{ FILE_TYPE_MAP[file.type].text || '无信息' }}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <td class="item-info-key">文件大小: </td>
                  <td class="item-info-value" >{{ formatSize(file.size) }}</td>
                </tr>
                <tr>
                  <td class="item-info-key">时长: </td>
                  <td class="item-info-value">{{ formatDuration(file.duration) }}</td>
                </tr>
              </table>
              <more-view
                :info="file"
              ></more-view>
            </div>
          </fj-tab-pane>
          <fj-tab-pane label="编目信息" name="tab1">
            <div class="media-center-file-item media-center-file-item-bottom-line" v-for="catalogInfo in catalogInfos">
              <table class="media-center-table">
                <template v-for="(item, key) in catalogInfo">
                  <tr>
                    <td class="item-info-key">{{ item.cn || key }} </td>
                    <td class="item-info-value">{{ item.value }}</td>
                  </tr>
                </template>
              </table>
            </div>
          </fj-tab-pane>
        </fj-tabs>
      </div>
      <i class="iconfont icon-close closebtn" @click="handleClose"></i>
    </div>
  </transition>
</template>
<script>
  import {
    isEmptyObject,
    formatSize,
    formatDuration,
    formatContent,
    getStreamURL,
    formatTime,
    FROM_WHERE
  } from '../../../common/utils';
  import Player from '../../mediaCenter/components/player';
  import MoreView from '../../mediaCenter/moreView';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import '../../mediaCenter/index.css';
  const api = require('../../../api/media');
  const libraryAPI = require('../../../api/library');
  const FILE_TYPE_MAP = {
    0: { text: '高码流' },
    1: { text: '低码流' },
    2: { text: '字幕' },
    3: { text: '缩略图' },
    4: { text: '文档' },
    5: { text: '其它' }
  };

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      objectId: String
    },
    data() {
      return {
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        item: {},
        files: [], // 所有的文件信息
        activeTabName: 'tab2',
        videoId: '',
        FILE_TYPE_MAP: FILE_TYPE_MAP,
        fromWhere: FROM_WHERE.HK_RUKU,
        catalogInfos: []
      };
    },
    watch: {
      objectId(val) {
        if (this.visible) {
          this.getDetail();
          this.getCatalogInfoTranslation();
        }
      },
      visible(val) {
        if (!val) return;
        if (this.objectId) {
          this.getDetail();
          this.getCatalogInfoTranslation();
        }
      }
    },
    methods: {
      isEmptyObject,
      formatSize,
      formatDuration,
      formatContent,
      getStreamURL,
      formatTime,
      getStream() {
        getStreamURL(this.objectId, this.fromWhere, (err, url, res) => {
          if (err) {
            console.log('err', err);
            // this.$message.error(err);
            return;
          }

          this.streamInfo = res.result;
          this.url = url;
        }, this);
      },
      getDetail() {
        libraryAPI.listFile({ params: { objectId: this.objectId } }).then((res) => {
          this.files = res.data;
          this.fromWhere = this.files.length ? this.files[0].fromWhere : FROM_WHERE.HK_RUKU;
          this.getStream();
        }).catch((error) => {
          this.$message.error(error);
        });
        // api.getObject({ params: { objectid: this.objectId } }).then((res) => {
        //   this.program = res.data.result.detail.program;
        //   this.files = res.data.result.files;
        //   delete this.program.OBJECTID;
        // }).catch((error) => {
        //   this.$message.error(error);
        // });
      },
      getCatalogInfoTranslation() {
        libraryAPI.getCatalogInfoTranslation({ params: { objectId: this.objectId }}).then((res) => {
          this.catalogInfos = res.data;
        }).catch((error) => {
          this.$message.error(error);
        });
      },
      handleClose() {
        this.$emit('update:visible', false);
      }
    },
    directives: { Clickoutside },
    components: {
      Player,
      MoreView
    }
  };
</script>
<style>
  .media-video-panel-wrap .fj-tabs-header .fj-tabs-item{ font-size: 12px; }
  .slide-dialog-wrapper {
    width: 449px;
    position: fixed;
    top: 0;
    right: 0;
    bottom: 0;
    border-left: 1px solid #CED9E5;
    background: #FFFFFF;
    box-shadow: 2px 2px 15px 0px #9FB3CA;
    overflow: auto;
  }
  .task-detail-video {
    height: 330px;
    width: 100%;
    text-align: center;
    background: #CED9E5;
    overflow: hidden;
    box-sizing: border-box;
    color: #E3EAF3;
  }
  .task-detail-video-panel {
    position: absolute;
    top: 330px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F8FAFB;
    font-size: 12px;
    color: #2A3E52;
  }
  .closebtn {
    position: absolute;
    top: 0;
    right: 0;
    cursor: default;
    width: 40px;
    height: 40px;
    line-height: 40px;
    font-size: 12px;
    text-align: center;
    color: #9FB3CA;
  }
  .closebtn:hover {
    background-color: #CED9E5;
    color: #fff;
  }
</style>
