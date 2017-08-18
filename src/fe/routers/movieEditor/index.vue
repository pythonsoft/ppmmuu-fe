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
          panels="200,#-p0"
        >
          <template slot="0" scope="props">
            <panel-view
              :parentSize="{ width: props.width, height: props.height }"
              panels="30,#-p0"
              direction="y"
              :canResize="false"
            ></panel-view>
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
        this.size = { width: document.body.clientWidth, height: document.body.clientHeight }
      }
    },
    data() {
      return {
        size: { width: 0, height: 0 }
      }
    },
    created() {

    },
    methods: {
      close() {
        this.$emit('update:visible', false);
      }
    }
  }
</script>
