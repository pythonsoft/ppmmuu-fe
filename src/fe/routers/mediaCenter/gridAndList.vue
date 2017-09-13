<template>
  <div>

    <div v-if="type==='list'" class="media-center-list">
      <div class="media-center-list-item" v-for="item in items" :key="item.id" @click="change(item)">
        <div class="media-center-list-item-thumb">
          <div class="iconfont icon-phoenixtv media-center-list-item-thumb-wrap">
            <img class="media-center-list-thumb" v-lazy="getThumb(item)" >
            <div class="media-center-duration">{{getDuration(item)}}</div>
          </div>
        </div>
        <div class="media-center-list-title-wrap">
          <span :class="getMediaFormatStyle(item, 'media-center-list-color-span')">
            {{getMediaFormat(item)}}
          </span>
          <span :class="setThumbClass(item.id, 'media-center-list-title')" v-html="getTitle(item)"></span>
        </div>
        <div class="media-center-list-description" v-html="getDescription(item)"></div>

        <ul class="media-center-list-bar">
          <li>
            <span title="分类" class="media-center-list-bar-color-span" v-html="item.program_type || '无分类'"></span>
          </li>
          <li>
            <span title="编目类别" class="media-center-list-bar-color-span">{{ item.ccid }}</span>
          </li>
          <li>
            <span title="入库时间">{{ item.last_modify | formatTime }}</span>
          </li>
        </ul>
      </div>
    </div>

    <ul v-else class="media-center-grid" :style="{ width: !width ? '100%' : width + 'px' }">
      <li v-for="item in items" :key="item.id" @click="change(item)">
        <div class="iconfont icon-phoenixtv media-center-grid-image">
          <img class="media-center-thumb" v-lazy="getThumb(item)" >
          <div class="media-center-duration">{{getDuration(item)}}</div>
          <i v-if="editable" class="media-center-delete-btn iconfont icon-close" @click="deleteItem(item)"></i>
        </div>
        <div class="media-item-name" :title="getReplaceName(item)">
          <span :class="getMediaFormatStyle(item)">{{ getMediaFormat(item) }}</span>
          <span :class="setThumbClass(item.id)" v-html="getTitle(item)"></span>
        </div>
        <div class="media-item-category">
          <span v-html="item.program_type || '无分类'"></span>
        </div>
        <p class="media-item-category media-item-time">
          {{ item.last_modify | formatTime }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import { getDuration, getThumb, getMediaFormat, getMediaFormatStyle, getReplaceName, getTitle, getDescription } from './common';
  import { isEmptyObject, deepClone, formatSize, getStringLength } from '../../common/utils';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/img/photoBreak.png',
    attempt: 1
  });

  export default {
    name: 'mediaCenterGridView',
    props: {
      type: { type: String, default: 'grid' },
      width: { type: Number, default: 100 },
      items: { type: Array, default: [] },
      editable: { type: Boolean, default: false }
    },
    data() {
      return {
        selectInfoId: ''
      };
    },
    methods: {
      deleteItem(item) {
        this.$emit('deleteItem', item);
      },
      change(item) {
        this.selectInfoId = item.id;
        this.$emit('currentItemChange', item);
      },
      setThumbClass(id, className) {
        let cn = className || '';

        if (this.selectInfoId && this.selectInfoId === id) {
          cn += ' media-center-title-selected';
        }

        return cn;
      },
      getDuration,
      getThumb,
      getMediaFormat,
      getMediaFormatStyle,
      getReplaceName,
      getTitle,
      getDescription(item) {
        const content = getDescription(item);
        const limit = 172;
        return getStringLength(content) > limit ? `${content.slice(0, limit)}...` : content;
      },
      formatSize,
      deepClone
    }
  };
</script>
