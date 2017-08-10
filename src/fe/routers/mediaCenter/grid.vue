<template>
  <ul v-else class="media-center-list" :style="{ width: !width ? '100%' : width + 'px' }">
    <li v-for="item in items" :key="item.id">
      <div class="iconfont icon-phoenixtv media-center-list-image" @click="change(item)">
        <img class="media-center-thumb" v-lazy="getThumb(item)" >
        <div class="media-center-duration">{{getDuration(item)}}</div>
      </div>
      <div class="media-item-name" :title="getReplaceName(item)">
        <span :class="getMediaFormatStyle(item)">{{getMediaFormat(item)}}</span>
        <span v-html="getTitle(item)"></span>
      </div>
      <div class="media-item-category">
        类别：
        <span class="media-item-category-value" v-html="item.program_type || '无分类'"></span>
      </div>
      <div class="media-item-category media-item-time">
        入库时间：
        <span class="media-item-category-value">{{ item.last_modify | formatTime }}</span>
      </div>
    </li>
  </ul>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import { getDuration, getThumb, getMediaFormat, getMediaFormatStyle, getReplaceName, getTitle } from './common';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '../../img/photoBreak.png',
    attempt: 1,
    listenEvents: []
  });

  export default {
    name: 'mediaCenterGridView',
    props: {
      width: { type: Number, default: 100 },
      items: { type: Array, default: [] }
    },
    data() {
      return {};
    },
    methods: {
      change(item) {
        this.$emit('currentItemChange', item);
      },
      getDuration,
      getThumb,
      getMediaFormat,
      getMediaFormatStyle,
      getReplaceName,
      getTitle
    }
  };
</script>
