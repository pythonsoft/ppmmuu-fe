<template>
  <ul v-else class="media-center-list" :style="{ width: !width ? '100%' : width + 'px' }">
    <li v-for="item in items" :key="item.id" @click="change(item)">
      <div class="iconfont icon-phoenixtv media-center-list-image">
        <img class="media-center-thumb" v-lazy="getThumb(item)" >
        <div class="media-center-duration">{{getDuration(item)}}</div>
      </div>
      <div class="media-item-name" :title="getReplaceName(item)">
        <span :class="getMediaFormatStyle(item)">{{getMediaFormat(item)}}</span>
        <span :class="setThumbClass(item.id)" v-html="getTitle(item)"></span>
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
  import { isEmptyObject, deepClone } from '../../common/utils';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '../../img/photoBreak.png',
    attempt: 1
  });

  export default {
    name: 'mediaCenterGridView',
    props: {
      width: { type: Number, default: 100 },
      items: { type: Array, default: [] }
    },
    data() {
      return {
        selectInfoId: ''
      };
    },
    methods: {
      change(item) {
        this.selectInfoId = item.id;
        this.$emit('currentItemChange', item);
      },
      setThumbClass(id) {
        let className = '';

        if (this.selectInfoId && this.selectInfoId === id) {
          className = 'media-center-title-selected';
        }

        return className;
      },
      getDuration,
      getThumb,
      getMediaFormat,
      getMediaFormatStyle,
      getReplaceName,
      getTitle,
      deepClone
    }
  };
</script>
