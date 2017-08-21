<template>
  <div v-if="visible" class="movie-editor">
    <div class="movie-editor-wrap">
      <div class="movie-editor-top">
        <div class="movie-editor-title">
          <span class="iconfont icon-phoenixtv"></span>
          视频编辑器
        </div>
        <ul class="movie-editor-top-bar">
          <li @click="close">
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
              name="child"
            >
              <template slot="0">
                00000000
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

  export default {
    name: 'movieEditor',
    components: {
      'panel-view': panelView
    },
    props: {
      visible: { type: Boolean, default: false }
    },
    watch: {
      visible() {
        this.resize();
      }
    },
    data() {
      return {
        size: { width: 0, height: 0 }
      };
    },
    created() {

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
      close() {
        this.$emit('update:visible', false);
      }
    }
  };
</script>
