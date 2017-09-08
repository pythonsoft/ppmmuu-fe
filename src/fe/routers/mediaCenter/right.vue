<template>
  <div class="media-right">
    <div class=" media-video">
      <div v-if="!isEmptyObject(item)" class="media-video-wrap">
        <div class="media-video-content" id="video" ref="video">
          <video height="246" width="439" controls autoplay :src="url"></video>
        </div>
        <div >
          <div class="media-video-title-wrap">
            <div class="media-video-title" v-html="title"></div>
            <ul class="media-video-title-bar">
              <li>
                <span title="下载" class="iconfont icon-video-download" @click.stop="(e) => download()"></span>
              </li>
              <li @click.stop="showSourceMenu" ref="addtoBtn" v-clickoutside="closeSourceMenu">
                <span title="收藏" class="iconfont icon-addto"></span>
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
              <fj-button type="info" size="mini" @click.stop="(e) => download(file)">下载</fj-button>
            </div>
          </div>
        </fj-tab-pane>
      </fj-tabs>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import './index.css';
  import { getTitle, getThumb } from './common';
  import { isEmptyObject, formatSize, formatDuration, formatContent, getVideo, getStreamURL } from '../../common/utils';
  import moreView from './moreView';
  import SourceMenuDialog from './components/sourceMenuDialog';
  import { getPosition } from '../../component/fjUI/utils/position';
  import Clickoutside from '../../component/fjUI/utils/clickoutside';
  import ivideoAPI from '../../api/ivideo';

  const config = require('../../config');

  const api = require('../../api/media');
  const jobAPI = require('../../api/job');


  export default {
    name: 'right',
    directives: { Clickoutside },
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
        streamInfo: {}
      };
    },
    watch: {
      videoInfo(val) {

        console.log('this.item -->', this.item)

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
        menuPosition.left = `${addtoBtnPosition.x - 163}px`;
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
      handleAddtoMenu(data) {
        const reqData = Object.assign({}, data);
        reqData.name = this.title;
        reqData.snippet = {
          objectId: this.item.id,
          thumb: this.poster,
          input: 0,
          output: this.item.duration,
          duration: this.item.duration
        };
        ivideoAPI.createItem(reqData)
          .then((response) => {
            this.unmountMenu();
          })
          .catch((error) => {
            this.$message.error(error);
          });
      },
      getStream() {
        const me = this;

        getStreamURL(this.item.id, function(err, url, rs) {
          if(err) {
            me.$message.error(error);
            return false;
          }
          me.streamInfo = rs.result;
          me.url = url;
          console.log(rs);
        }, me);
      },
      download(info) {
        if(isEmptyObject(this.streamInfo)) {
          return false;
        }

        const me = this;

        const param = {
          objectid: this.item.id,
          inpoint: this.streamInfo.INPOINT,
          outpoint: this.streamInfo.OUTPOINT,
          fileName: this.streamInfo.FILENAME
        };

        if(info && !isEmptyObject(info)) {
          param.objectid = info.OBJECTID;
          param.fileName = info.FILENAME;
          param.inpoint = info.INPOINT;
          param.outpoint = info.OUTPOINT;
        }

        jobAPI.download(param).then((res) => {
          me.$message.success('正在下载文件，请到"任务"查看详细情况');
        }).catch((error) => {
          me.$message.error(error);
        });
      }
    }
  };
</script>

