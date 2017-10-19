<template>
  <li v-if="item && listType === 'grid'" @click="linkToWatchFn(item.objectId)">
    <div class="iconfont icon-phoenixtv subscribe-grid-image">
      <img class="subscribe-thumb" v-lazy="item.poster" >
      <div class="subscribe-list-item-overlay">
        <span class="iconfont icon-play play-btn"></span>
        {{getDuration(item)}}
      </div>
    </div>
    <div class="subscribe-item-name" :title="getReplaceName(item)">
      <span v-html="getTitle(item)"></span>
      <span class="iconfont icon-download download-btn" ref="downloadBtn" @click.stop="(e)=>{mountDropdownMenu(e, item.files)}" v-clickoutside="handleCloseMenu"></span>
    </div>
    <div class="subscribe-item-detail">
      来源：{{ item.source }}
    </div>
    <p class="subscribe-item-detail">
      限制：{{ item.limit }}
    </p>
    <p class="subscribe-item-detail">
      入库时间：{{ item.storageTime | formatTime }}
    </p>
  </li>
  <div class="subscribe-list-item" v-else-if="item && listType === 'list'" @click="linkToWatchFn(item.objectId)">
    <div class="subscribe-list-item-thumb">
      <div class="iconfont icon-phoenixtv subscribe-list-item-thumb-wrap">
        <img class="subscribe-list-thumb" v-lazy="item.poster" >
        <div class="subscribe-list-item-overlay">
          <span class="iconfont icon-play play-btn"></span>
          {{getDuration(item)}}
        </div>
      </div>
    </div>
    <div class="subscribe-list-title-wrap">
      <span :class="setThumbClass(item.id, 'subscribe-list-title')" v-html="getTitle(item)"></span>
    </div>
    <ul class="subscribe-list-bar">
      <li>
        <span title="来源">来源：{{ item.source }}</span>
      </li>
      <li>
        <span title="限制">限制：{{ item.limit }}</span>
      </li>
      <li>
        <span title="限制">入库时间：{{ item.storageTime | formatTime }}</span>
      </li>
    </ul>
  </div>
</template>
<script>
  import Vue from 'vue';
  import VueLazyload from 'vue-lazyload';
  import DropdownMenu from './dropdownMenu';
  import Clickoutside from '../../../component/fjUI/utils/clickoutside';
  import { getPosition } from '../../../component/fjUI/utils/position';
  import {
    getDuration,
    getThumb,
    getMediaFormat,
    getMediaFormatStyle,
    getReplaceName,
    getTitle,
    getDescription
  } from '../../mediaCenter/common';
  import { isEmptyObject, deepClone, formatSize, getStringLength } from '../../../common/utils';

  Vue.use(VueLazyload, {
    preLoad: 1.3,
    error: '/img/photoBreak.png',
    attempt: 1
  });

  export default {
    props: {
      parentEl: {},
      item: {},
      listType: {
        type: String,
        default: 'grid'
      },
      downloadFn: Function,
      linkToWatchFn: Function
    },
    data() {
      return {
      };
    },
    methods: {
      setThumbClass(id, className) {
        let cn = className || '';

        if (this.selectInfoId && this.selectInfoId === id) {
          cn += ' subscribe-title-selected';
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
      deepClone,
      mountDropdownMenu(e, files) {
        this.dropdownMenu = new Vue(DropdownMenu).$mount();
        document.body.appendChild(this.dropdownMenu.$el);
        const parentEl = this.parentEl || document.body;
        parentEl.addEventListener('scroll', this.updateMenuPosition);
        this.updateMenuPosition();
        const menus = files.map(file => {
          return { command: file, key: file.FILETYPEID, name: file.FILETYPENAME };
        });
        this.dropdownMenu.menus = menus;
        this.dropdownMenu.$on('item-click', this.handleItemClick);
      },
      handleItemClick(item, command) {
        this.downloadFn(command);
        this.unmountDropdownMenu();
      },
      handleCloseMenu(target) {
        if (this.dropdownMenu && this.dropdownMenu.$el.contains(target)) return;
        this.unmountDropdownMenu();
      },
      unmountDropdownMenu() {
        if (this.dropdownMenu) {
          document.body.removeChild(this.dropdownMenu.$el);
          const parentEl = this.parentEl || document.body;
          parentEl.removeEventListener('scroll', this.updateMenuPosition);
          this.dropdownMenu = null;
        }
      },
      updateMenuPosition() {
        if (this.dropdownMenu) {
          const position = this.getDropdownMenu();
          this.dropdownMenu.menuStyle = { top: `${position.top + 30}px`, left: `${position.left - 144}px`, minWidth: '166px' };
        }
      },
      getDropdownMenu() {
        const downloadBtnPosition = getPosition(this.$refs.downloadBtn);
        const position = { top: downloadBtnPosition.y, left: downloadBtnPosition.x };
        const parentElScrollTop = this.parentEl ? this.parentEl.scrollTop : 0;
        position.top = position.top - parentElScrollTop;
        return position;
      },
    },
    beforDestroy() {
      if (this.dropdownMenu) {
        this.unmountDropdownMenu();
      }
    },
    directives: { Clickoutside }
  }
</script>
