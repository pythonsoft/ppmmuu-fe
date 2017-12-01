<template>
  <a class="fj-card" :style="cardStyle" @click.prev="handleClick">
    <div class="fj-card-thumb" ref="cardThumbWrap" :style="thumbStyle">
      <img class="fj-card-pic" :src="selfThumb" :alt="title" @error="imgError">
      <div class="fj-card-thumb-mask">
        <i v-if="editable" class="fj-card-delete-btn iconfont icon-close" @click.stop="$emit('delete-item')"></i>
        <span class="fj-card-video-duration">{{ duration }}</span>
        <span :class="['fj-card-video-definition', `_${definition}`]">{{ definition }}</span>
      </div>
    </div>
    <div class="fj-card-meta-data">
      <div :class="['fj-card-title', { 'highlight': highlight }]" v-html="title"></div>
      <span class="fj-card-desc">{{ time }}</span>
    </div>
  </a>
</template>
<script>
  import defaultPic from './video-default-pic.png';
  import errorPic from './video-error-pic.png';
  export default {
    name: 'FjCard',
    props: {
      link: String,
      title: String,
      time: String,
      thumb: {
        type: String,
        default: defaultPic
      },
      width: {},
      duration: String,
      definition: String,
      highlight: {
        type: Boolean,
        default: true
      },
      editable: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        thumbStyle: {},
        selfThumb: this.thumb
      }
    },
    watch: {
      thumb(val) {
        this.selfThumb = val;
      }
    },
    computed: {
      cardStyle() {
        if (this.width) return { width: this.width };
        return null;
      }
    },
    mounted() {
      const width = this.$refs.cardThumbWrap.getBoundingClientRect().width;
      const height = width * 9 / 16;
      this.thumbStyle = { height: `${height}px` };
    },
    methods: {
      imgError(e) {
        this.selfThumb = errorPic;
        console.log('imgError');
      },
      handleClick(e) {
        this.$emit('click-card', e);
      }
    }
  };
</script>
<style>
  .fj-card {
    float: left;
    width: 100%;
    padding-left: 3px;
    padding-bottom: 19px;
    background: #fff;
  }
  .fj-card-thumb {
    position: relative;
    width: 100%;
    overflow: hidden;
  }
  .fj-card-thumb-mask {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }
  .fj-card-video-duration {
    position: absolute;
    top: 5px;
    right: 10px;
    padding: 0 2px;
    background: rgba(0,0,0,.5);
    font-size: 12px;
    color: #fff;
  }
  .fj-card-delete-btn {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 33px;
    height: 33px;
    line-height: 33px;
    color: #fff;
    font-size: 12px;
    background: rgba(0,0,0,.5);
    text-align: center;
  }
  .fj-card-video-definition {
    position: absolute;
    bottom: 10px;
    right: 10px;
    padding: 1px 2px;
    font-size: 12px;
    line-height: 1;
    border-radius: 2px;
    color: #fff;
    text-align: center;
  }
  .fj-card-pic {
    width: 100%;
  }
  .fj-card-title {
    padding-left: 5px;
    margin-top: 6px;
    font-size: 14px;
    line-height: 1.4;
    color: #333333;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .fj-card-title em {
    font-style: normal;
  }
  .fj-card-title.highlight em {
    color: #FF3366;
  }
  .fj-card-desc {
    display: block;
    padding-left: 5px;
    font-size: 12px;
    line-height: 1.4;
    color: #959595;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  ._4k {
    background: #F4AC32;
  }

  ._1080P {
    background: #D0021B;
  }

  ._720P {
    background: #9353DE;
  }

  ._480P {
    background: #1497D6;
  }

  ._240P {
    background: #2EC4B6;
  }
</style>
