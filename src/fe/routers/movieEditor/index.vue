<template>
  <div class="movie-editor">
    <div class="movie-editor-wrap">
      <div class="movie-editor-top">
        <div class="movie-editor-title">
          <span class="iconfont icon-phoenixtv"></span>
          视频编辑器
        </div>
        <ul class="movie-editor-top-bar">
          <li @click="">
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
                <video-material-panel
                  :isActivePanel="activePanel==='meterialEditor'"
                  :size="{ width: props.width, height: props.height }"
                  @insert="insertClip"></video-material-panel>
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
                <material-list-panel
                  :isActivePanel="activePanel==='meterialList'"></material-list-panel>
              </template>
            </panel-view>
          </template>
        </panel-view>
      </div>
    </div>
  </div>
</template>
<script>
  import './index.css';
  import panelView from '../../component/layout/panel/index';
  import VideoMaterialPanel from './component/videoMaterialPanel';
  import MaterialListPanel from './component/materialListPanel';

  export default {
    name: 'movieEditor',
    components: {
      'panel-view': panelView,
      VideoMaterialPanel,
      MaterialListPanel
    },
    props: {
    },
    watch: {

    },
    data() {
      return {
        activePanel: 'meterialEditor',
        size: { width: document.body.clientWidth, height: document.body.clientHeight }
      };
    },
    created() {
      this.resize();
      // window.addEventListener('resize', this.resize);
      // document.body.removeEventListener('mouseup', this.mouseup);
    },
    mounted() {
      window.addEventListener('resize', this.resize);
    },
    methods: {
      resize(e) {
        this.size = { width: document.body.clientWidth, height: document.body.clientHeight };
      },
      insertClip(range) {
        console.log('range', range);
      }
    }
  };
</script>
