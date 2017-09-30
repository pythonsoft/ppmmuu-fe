<template>
  <div class="movie-editor">
    <div class="movie-editor-wrap">
      <div class="movie-editor-top">
        <div class="movie-editor-title">
          <span class="iconfont icon-phoenixtv"></span>
          视频编辑器
        </div>
        <ul class="movie-editor-top-bar">
          <li @click="back">
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
          <template slot="0" scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/2,#-p0"
              direction="x"
              name="child1"
            >
              <template slot="0" scope="props">
                <video-source-panel
                  :title="sourceTitle"
                  :videoId="sourceVideoId"
                  :videoSnippet="sourceSnippet"
                  :activePanel.sync="activePanel"
                  :size="{ width: props.width, height: props.height }"
                  @insert="importSource"></video-source-panel>
              </template>
              <template slot="1" scope="props">
                <program-panel
                  :title="programInfo.title"
                  :range="programInfo.range"
                  :videoId="programInfo.objectId"
                  :activePanel.sync="activePanel"
                  :size="{ width: props.width, height: props.height }"></program-panel>
              </template>
            </panel-view>
          </template>
          <template slot="1" scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="#/3,#-p0"
              direction="x"
              name="child2"
            >
              <template slot="0" scope="props">
                <media-browser
                  :activePanel.sync="activePanel"
                  @updateCurrentSource="updateCurrentSource"></media-browser>
              </template>
              <template slot="1" scope="props">
                <workspace-panel
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
        importSourceInfo: null,
        sourceTitle: '',
        sourceVideoId: '',
        sourceSnippet: {},
        activePanel: 'sourcePanel',
        size: { width: document.body.clientWidth, height: document.body.clientHeight - 32 },
        programInfo: { id: '', objectId: '', title: '', range: [0, 0] }
      };
    },
    created() {
      this.resize();
      this.projectBus = new Vue();
      this.projectBus.$on('updateProgram', (data) => {
        if (this.programInfo && this.programInfo.id === data.id) return;
        this.programInfo = data;
      });
      // window.addEventListener('resize', this.resize);
      // document.body.removeEventListener('mouseup', this.mouseup);
    },
    mounted() {
      window.addEventListener('resize', this.resize);
    },
    methods: {
      resize(e) {
        this.size = { width: document.body.clientWidth, height: document.body.clientHeight - 32 };
      },
      importSource(info) {
        this.importSourceInfo = info;
      },
      updateCurrentSource(item) {
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
