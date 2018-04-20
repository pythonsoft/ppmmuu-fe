<template>
  <div :class="['movie-editor', {'dark': theme === 'dark'}]">
    <div class="movie-editor-wrap">
      <div class="movie-editor-top">
        <div class="movie-editor-title">
          <span class="iconfont icon-phoenixtv"></span>
          视频编辑器
        </div>
        <ul class="movie-editor-top-bar clearfix">
          <li :class="['theme-btn', { 'active': theme !== 'dark' }]" @click="theme = 'stroke'">浅色主题</li>
          <li :class="['theme-btn', { 'active': theme === 'dark' }]" @click="theme = 'dark'">深色主题</li>
          <li @click="back" class="close-btn">
            <span class="iconfont icon-small-close"></span>
          </li>
        </ul>
      </div>
      <div class="movie-editor-main">
        <panel-view
          :parentSize="size"
          panels="#/2,#-p0"
          direction="y"
        >
          <template slot="0" slot-scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/2,#-p0"
              direction="x"
              name="child1"
            >
              <template slot="0" slot-scope="props">
                <video-source-panel
                  :title="sourceTitle"
                  :video-id="sourceVideoId"
                  :source-from-where="sourceFromWhere"
                  :video-snippet="sourceSnippet"
                  :active-panel.sync="activePanel"
                  :size="{ width: props.width, height: props.height }"
                  @insert="importSource"></video-source-panel>
              </template>
              <template slot="1" slot-scope="props">
                <program-panel
                  :activePanel.sync="activePanel"
                  :projectBus="projectBus"
                  :size="{ width: props.width, height: props.height }"></program-panel>
              </template>
            </panel-view>
          </template>
          <template slot="1" slot-scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/3,#-p0"
              direction="x"
              name="child2"
            >
              <template slot="0" slot-scope="props">
                <media-browser
                  :theme="theme"
                  :activePanel.sync="activePanel"
                  @updateCurrentSource="updateCurrentSource"></media-browser>
              </template>
              <template slot="1" slot-scope="props">
                <workspace-panel
                  :theme="theme"
                  :activePanel.sync="activePanel"
                  :size="{ width: props.width, height: props.height }"
                  :importSourceInfo="importSourceInfo"
                  :projectBus="projectBus"></workspace-panel>
              </template>
            </panel-view>
          </template>
        </panel-view>
      </div>
    </div>
  </div>
</template>
<script>
  import Vue from 'vue';
  import './index.css';
  import panelView from '../../component/layout/panel/index';
  import VideoSourcePanel from './component/videoSourcePanel';
  import ProgramPanel from './component/programPanel';
  import MediaBrowser from './component/mediaBrowser';
  import WorkspacePanel from './component/workspacePanel';
  import throttle from '../../component/fjUI/utils/throttle';

  export default {
    name: 'movieEditor',
    components: {
      'panel-view': panelView,
      VideoSourcePanel,
      ProgramPanel,
      MediaBrowser,
      WorkspacePanel
    },
    props: {
    },
    watch: {

    },
    data() {
      return {
        theme: 'dark',
        importSourceInfo: null,
        sourceTitle: '',
        sourceVideoId: '',
        sourceFromWhere: '',
        sourceSnippet: {},
        activePanel: 'sourcePanel',
        size: { width: document.body.clientWidth, height: document.body.clientHeight - 32 },
        sequences: []
      };
    },
    created() {
      this.resize();
      this.projectBus = new Vue();
      // window.addEventListener('resize', this.resize);
      // document.body.removeEventListener('mouseup', this.mouseup);
    },
    mounted() {
      window.addEventListener('resize', throttle(this.resize));
    },
    beforeDestroy() {
      window.removeEventListener('resize', throttle(this.resize));
    },
    methods: {
      resize(e) {
        this.size = { width: document.body.clientWidth, height: document.body.clientHeight - 32 };
      },
      importSource(info) {
        this.importSourceInfo = info;
      },
      updateCurrentSource(item) {
        this.sourceFromWhere = item.snippet.fromWhere;
        this.sourceVideoId = item.snippet.objectId || '';
        this.sourceTitle = item.name;
        this.sourceSnippet = item.snippet;
      },
      back() {
        this.$router.go(-1);
      }
    }
  };
</script>
