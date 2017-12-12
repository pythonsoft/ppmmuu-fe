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
          <li v-if="item.house_num">
            <span title="HOUSENO" class="media-center-list-bar-color-span">{{ item.house_num }}</span>
          </li>
          <li v-if="item.resource_location">
            <span title="资源所属部门" class="media-center-list-bar-color-span">{{ item.resource_location }}</span>
          </li>
          <li>
            <span :title="formatShowTime(item).name">{{ formatShowTime(item).value || '无发布时间' }}</span>
          </li>
        </ul>
      </div>
    </div>

    <ul v-else class="media-center-grid" :style="{ width: !width ? '100%' : width + 'px' }">
      <li v-for="item in items" v-if="item" :key="item.id" @click="change(item)">
        <div class="iconfont icon-phoenixtv media-center-grid-image">
          <img class="media-center-thumb" v-lazy="getThumb(item)" >
          <div class="media-center-duration">{{getDuration(item)}}</div>
          <i v-if="editable" class="media-center-delete-btn iconfont icon-close" @click.stop="deleteItem(item)"></i>
        </div>
        <div class="media-item-name" :title="getReplaceName(item)">
          <span :class="getMediaFormatStyle(item)">{{ getMediaFormat(item) }}</span>
          <span :class="setThumbClass(item.id)" v-html="getTitle(item)"></span>
        </div>
        <div class="media-item-category">
          <span v-html="item.program_type || '无分类'"></span>
        </div>
        <p class="media-item-category media-item-time" :title="formatShowTime(item).name">
          {{ formatShowTime(item).value || '无发布时间' }}
        </p>
      </li>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import {
    getDuration,
    getThumb,
    getMediaFormat,
    getMediaFormatStyle,
    getReplaceName,
    getTitle,
    formatShowTime
  } from './common';
  import { isEmptyObject, deepClone, formatSize, getStringLength, formatTime } from '../../common/utils';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/static/source/photoBreak.png',
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
        const content = item.content_introduction || item.content || item.full_text;
        const limit = 172;
        return getStringLength(content) > limit ? `${content.slice(0, limit)}...` : content;
      },
      formatSize,
      deepClone,
      formatTime,
      formatShowTime
    }
  };
</script>
<style>

.media-center-list-item{
  position: relative;
  padding-left: 211px;
  font-size: 12px;
  margin-bottom: 16px;
  min-height: 108px;
  cursor: pointer;
}

.media-center-list-item-thumb-wrap{
  position: relative;
  height: 108px;
  width: 192px;
  text-align: center;
  overflow: hidden;
  border-radius: 2px;
  box-sizing: border-box;
  background: #EBF3FB;
  color: #D4DFEC;
  font-size: 40px;
}

.media-center-list-item-thumb{
  height: 108px;
  line-height: 108px;
  width: 192px;
  overflow: hidden;
  position: absolute;
  left: 0;
  top: 0;
}

.media-center-list-thumb{
  position: absolute;
  left: 0;
  top: 0;
  width: 192px;
  height: 108px;
}

.media-center-list-color-span {
  display: inline-block;
  width: 40px;
  height: 15px;
  line-height: 16px;
  text-align: center;
  font-size: 10px;
  border-radius: 2px;
  font-weight: normal;
  margin-right: 6px;
}

.media-center-list-bar{
  height: 18px;
  line-height: 18px;
  overflow: auto;
}

.media-center-list-bar li {
  float: left;
  display: inline;
  margin-right: 6px;
  cursor: default;
}

.media-center-list-bar-color-span {
  height: 14px;
  line-height: 14px;
  text-align: center;
  border-radius: 2px;
  font-weight: normal;
  background: #EBF3FB;
  padding: 2px 6px;
  color: #2A3E52;
}

.media-center-list-title {
  font-weight: bold;
  font-size: 14px;
  color: #2A3E52;
}

.media-center-title-selected{
  color: #38B1EB;
}
.media-center-list-title-wrap {
  margin-bottom: 12px;
}
.media-center-list-description {
  margin-bottom: 8px;
  font-size: 12px;
  color: #4C637B;
  font-weight: normal;
  overflow: hidden;
  text-overflow: ellipsis;
}

.media-center-duration {
  position: absolute;
  right: 0;
  bottom: 0;
  width: 56px;
  height: 14px;
  line-height: 14px;
  text-align: center;
  background: rgba(0, 0, 0, .5);
  color: #fff;
  font-size: 12px;
}

.media-center-grid-image:hover .media-center-delete-btn {
  display: block;
}
.media-center-delete-btn {
  display: none;
  position: absolute;
  right: 1px;
  top: 2px;
  width: 33px;
  height: 33px;
  line-height: 33px;
  color: #fff;
  font-size: 12px;
  background-color: rgba(0, 0, 0, .5);
  cursor: pointer;
}

.media-center-grid {
  overflow: auto;
}

.media-center-grid li {
  height: 180px;
  width: 192px;
  float: left;
  margin-right: 6px;
  margin-bottom: 25px;
  box-sizing: border-box;
  cursor: default;
}

.media-center-grid-image {
  height: 108px;
  line-height: 108px;
  text-align: center;
  width: 192px;
  overflow: hidden;
  border-radius: 2px;
  box-sizing: border-box;
  position: relative;
  background: #EBF3FB;
  color: #D4DFEC;
  font-size: 40px;
}

.media-center-thumb {
  position: absolute;
  overflow: hidden;
  width: 192px;
  height: 108px;
  left: 0;
  top: 0;
}

.media-item-name {
  margin-top: 9px;
  height: 17px;
  line-height: 17px;
  width: 100%;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  box-sizing: border-box;
  position: relative;
  padding-left: 42px;
  font-size: 12px;
  font-weight: bold;
  color: #2A3E52;
}

.media-item-category {
  margin-top: 9px;
  color: #4C637B;
  line-height: 17px;
}

.media-item-time{
  margin-top: 2px;
}

.media-center-color-span {
  width: 40px;
  height: 15px;
  line-height: 16px;
  text-align: center;
  display: block;
  font-size: 10px;
  border-radius: 2px;
  position: absolute;
  left: 0;
  top: 1px;
  font-weight: normal;
}

._4k {
  color: #fff;
  background: #F4AC32;
}

._HD {
  color: #fff;
  background: #D0021B;
}

._SD {
  color: #fff;
  background: #9353DE;
}

._480P {
  color: #fff;
  background: #1497D6;
}

._240P {
  color: #fff;
  background: #2EC4B6;
}

</style>
