<template>
  <div class="web-browser" v-if="display">
    <layout-two-row-title>
      <template slot="title">
        <span class="iconfont icon-arrow-left web-browser-back" @click="close"></span>
        {{name}}
        <span class="iconfont icon-small-close web-browser-close" @click="close"></span>
      </template>
      <template slot="content">
        <div class="web-browser-content">
          <iframe :src="url" scrolling="Auto" frameborder="0" marginwidth="0" marginheight="0"></iframe>
        </div>
      </template>
    </layout-two-row-title>
  </div>
</template>
<script>
  import './index.css';
  import LayoutTwoRowTitle from "../../layout/twoRowTitle/index.vue";
  import { removeAllHTMLTag } from '../../../common/utils';
  export default {
    components: {LayoutTwoRowTitle},
    name: 'webBrowser',
    props: {
      title: String,
      url: String,
      visible: Boolean
    },
    watch: {
      visible(v) {
        this.display = v;
        this.name = removeAllHTMLTag(this.title);
      }
    },
    data() {
      return {
        display: false,
        name: ''
      }
    },
    methods: {
      close() {
        this.$emit('close');
      }
    }
  }
</script>
