<template>
  <transition name="slide-in-right">
    <div v-show="visible" class="slide-dialog-wrapper" v-clickoutside="handleClose">
      <div class="shelf-detail-video">
        <div v-if="url" class="media-video-wrap">
          <div class="media-video-content" id="video" ref="video">
            <player :videoId="videoId" :height="288" :width="448" :url="url" :streamInfo="streamInfo"></player>
          </div>
          <div >
            <div class="media-video-title-wrap">
              <div class="media-video-title" :title="title" v-html="title"></div>
            </div>
          </div>
        </div>
        <div v-else class="iconfont icon-phoenixtv media-video-wrap-bg"></div>
      </div>
      <div class="shelf-detail-video-panel">
        <fj-tabs v-model="activeTabName" class="media-video-panel-wrap">
          <fj-tab-pane label="上架信息" name="tab2" v-if="showEditInfo">
            <table class="media-center-table">
              <tr v-for="(info, key) in editorDetails" v-if="info.cn && info.value" >
                <td class="item-info-key" width="80">{{ info.cn + ': ' || '空KEY:' }}</td>
                <td class="item-info-value clearfix" v-if="info.key!=='cover'">
                  <span v-if="info.isFoldedContent" class="inline-info" v-html="formatContent(info.value).slice(0, 68) + '...'"></span>
                  <span class="item-expand-btn" v-if="info.isFoldedContent" @click="expand('editorDetails', info, key)">详细<i class="tri-bottom"></i></span>
                  <template v-else>
                    <span v-if="info.cn === '內容介紹'" v-html="formatContent(info.value)"></span>
                    <span v-else v-html="formatContent(info.value)"></span>
                  </template>
                  <span class="item-folded-btn" v-if="info.value.length > 68 && !info.isFoldedContent" @click="folded('editorDetails', info, key)">收起<i class="tri-top"></i></span>
                </td>
                <td class="item-info-value " v-else>
                  <img :src="info.value" class="shelf-editor-cover" height="108px" width="192px">
                </td>
              </tr>
            </table>
          </fj-tab-pane>
          <fj-tab-pane label="媒体库信息" name="tab1">
            <div class="media-center-file-item">
              <template v-if="programEmpty">无</template>
              <template v-for="groupItem in programGroup" v-else>
                <h4 class="media-center-table-title">{{ groupItem.groupName }}</h4>
                <table class="media-center-table">
                  <tr v-for="index in groupItem.programIndexs" v-if="programDetails[index] && programDetails[index].value" >
                    <td class="item-info-key" width="80">{{ programDetails[index].cn + ': ' || '空KEY:' }}</td>
                    <td class="item-info-value clearfix">
                      <span v-if="programDetails[index].isFoldedContent" class="inline-info" v-html="formatContent(programDetails[index].value).slice(0, 68) + '...'"></span>
                      <span class="item-expand-btn" v-if="programDetails[index].isFoldedContent" @click="expand(programDetails[index], index)">详细<i class="tri-bottom"></i></span>
                      <template v-else>
                        <span v-html="formatContent(programDetails[index].value)"></span>
                      </template>
                      <span class="item-folded-btn" v-if="programDetails[index].value.length > 68 && !programDetails[index].isFoldedContent" @click="folded(programDetails[index], index)">收起<i class="tri-top"></i></span>
                    </td>
                  </tr>
                </table>
              </template>
            </div>
          </fj-tab-pane>
          <fj-tab-pane label="状态信息" name="tab3" v-if="showPackageInfo">
            暂无
          </fj-tab-pane>
        </fj-tabs>
        <div class="detail-operation" v-if="btnShow">
          <fj-button :type="btnType || 'danger'" @click="handleClick" size="small">{{btnText || '上架'}}</fj-button>
        </div>
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
    formatQuery,
    FROM_WHERE
  } from '../../../common/utils';
  import { formatProgramGroup } from '../../mediaCenter/common';
  import { SUBSCRIBE_TYPE } from '../config';
  import Player from '../../mediaCenter/components/player';
  import MoreView from '../../mediaCenter/moreView';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import '../../mediaCenter/index.css';


  const api = require('../../../api/media');
  const libraryAPI = require('../../../api/library');
  const shelfAPI = require('../../../api/shelves');
  const FILE_TYPE_MAP = {
    0: { text: '源文件' },
    1: { text: '低码流' },
    2: { text: '字幕' },
    3: { text: '缩略图' },
    4: { text: '其它' }
  };

  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      objectId: String,
      title: '',
      programNO: String,
      id: String,
      btnText: String,
      btnType: String,
      btnShow: {
        type: Boolean,
        default: true
      },
      showEditInfo: {
        type: Boolean,
        default: true
      },
      showPackageInfo: {
        type: Boolean,
        default: true
      }
    },
    data() {
      return {
        url: '',
        streamInfo: {
          INPOINT: 0,
          OUTPOINT: 0,
          FILENAME: ''
        },
        programDetails: [],
        editorDetails: {},
        activeTabName: 'tab2',
        videoId: '',
        FILE_TYPE_MAP: FILE_TYPE_MAP,
        fromWhere: '',
        programEmpty: false,
        programGroup: []
      };
    },
    created() {
      if (!this.showEditInfo){
        this.activeTabName = 'tab1';
      }
    },
    watch: {
      visible(val) {
        if (!val) {
          this.url = '';
          this.streamInfo = {
            INPOINT: 0,
            OUTPOINT: 0,
            FILENAME: ''
          };
          this.programDetails = [];
          this.editorDetails = {};
          this.activeTabName = 'tab2';
          this.programGroup = [];
          this.videoId = '';
          this.programEmpty = false;
        } else {
          this.getShelfDetail();
          this.getDetail();
          this.getStream();
        }
      }
    },
    methods: {
      isEmptyObject,
      formatSize,
      formatDuration,
      getStreamURL,
      formatTime,
      formatContent(v) {
        let r = v;

        if(typeof r === 'string') {
          r = formatContent(this.formatValue(v));
        }

        return r;
      },
      expand(source, info, key) {
        const newInfo = Object.assign({}, this[source][key], { isFoldedContent: false });
        this.$set(this[source], key, newInfo);
      },
      folded(source, info, key) {
        const newInfo = Object.assign({}, this[source][key], { isFoldedContent: true });
        this.$set(this[source], key, newInfo);
      },
      isProgramEmpty(){
        const programDetails = this.programDetails;
        if(programDetails.length > 0){
          return false;
        }
        return true;
      },
      getStream() {
        getStreamURL(this.objectId, this.fromWhere, (err, url, res) => {
          if (err) {
            console.log('err', err);
            return;
          }

          this.streamInfo = res.result;
          this.url = url;
        });
      },
      getShelfDetail(){
        const me = this;
        shelfAPI.getShelfDetail(formatQuery({_id: me.id }, true))
          .then((res)=>{
            const editorInfo = res.data.editorInfo || {};
            me.fromWhere = res.data.fromWhere || FROM_WHERE.MAM;
            me.editorDetails = res.data.details;
            for (let i = 0; i < me.editorDetails.length; i++) {
              const info = me.editorDetails[i];
              if (formatContent(info.value).length > 68) {
                info.isFoldedContent = true;
              }
            }
          })
          .catch((error)=>{
            me.$message.error(error);
          })
      },
      getDetail() {
        const me = this;
        api.getObject(formatQuery({ objectid: me.objectId, fromWhere: me.fromWhere }, true))
          .then((res)=>{
            const data = res.data.result.detail.program;
            me.programDetails = data;
            me.programGroup = formatProgramGroup(data);
            if (isEmptyObject(res.data.result.detail.program)) {
              me.programDetails = res.data.result.detail.sequence;
            }
            me.programEmpty = me.isProgramEmpty();

            for(let i =0, len = this.programDetails.length; i < len; i++){
              if(this.programDetails[i].key === 'OBJECTID'){
                this.programDetails.splice(i, 1);
                break;
              }
              const info = this.programDetails[i];
              if (this.formatContent(info.value).length > 68) {
                info.isFoldedContent = true;
              }
            }
          })
          .catch((error)=>{
            me.$message.error(error);
          })
      },
      handleClose() {
        this.$emit('update:visible', false);
      },
      handleClick() {
        this.$emit('operation-click');
      },
      formatValue(str) {
        let rs = str;

        if (/[0-9]{4}-[0-9]{2}-[0-9]{2}T/.test(str)) {
          rs = formatTime(str);
        }

        return rs;
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
  .shelf-detail-video {
    height: 330px;
    width: 100%;
    text-align: center;
    background: #CED9E5;
    overflow: hidden;
    box-sizing: border-box;
    color: #E3EAF3;
  }
  .shelf-detail-video-panel {
    position: absolute;
    top: 330px;
    left: 0;
    right: 0;
    bottom: 0;
    background: #F8FAFB;
    font-size: 12px;
    color: #2A3E52;
  }

  .shelf-detail-video-panel .fj-tabs-item{
    font-size: 12px;
  }

  .shelf-editor-cover {
    margin-top: 3px;
  }

  .shelf-detail-video-panel .fj-tabs-content{
    padding-top: 18px;
    padding-left: 15px;
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
    z-index: 101;
  }
  .closebtn:hover {
    background-color: #CED9E5;
    color: #fff;
  }
  .detail-operation {
    position: absolute;
    top: 0;
    right: 14px;
    height: 42px;
    line-height: 42px;
  }
</style>
