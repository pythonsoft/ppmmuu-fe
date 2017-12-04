<template>
  <div class="fj-cell" @click="handleClick">
    <div v-if="isLink" class="fj-cell-link-mask" @touchstart=""></div>
    <i v-if="icon" :class="['fj-cell-icon iconfont', icon]"></i>
    <div class="fj-cell-content">
      <div class="fj-cell-title">
        {{ title }}
        <div v-if="brief" class="fj-cell-brief">{{ brief }}</div>
      </div>
      <div :class="['fj-cell-value', {'isLink': isLink}]">
        <slot name="right">{{ value }}</slot>
      </div>
      <i v-if="rightIcon" :class="['fj-cell-right iconfont', rightIcon]" @click.stop="$emit('right-icon-click')"></i>
    </div>
    <i v-if="isLink" class="fj-cell-arrow"></i>
  </div>
</template>
<script>
  export default {
    name: 'FjCell',
    props: {
      icon: String,
      title: String,
      brief: String,
      value: {},
      isLink: Boolean,
      linkTo: {},
      rightIcon: String
    },
    methods: {
      handleClick(e) {
        if (this.linkTo && this.$router) {
          this.$router.push(this.linkTo);
        }
      }
    }
  };
</script>
<style>
  .fj-cell {
    position: relative;
    display: flex;
    align-items: center;
    min-height: 49px;
    padding-left: 15px;
    background-color: #FFFFFF;
    font-size: 15px;
    line-height: 1.4;
  }
  .fj-cell:first-child {
    background-image: linear-gradient(0deg,#CED9E5,#CED9E5 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .fj-cell:last-child {
    background-image: linear-gradient(0deg,#CED9E5,#CED9E5 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
  }
  .fj-cell:first-child .fj-cell-content {
    background-size: 0;
  }
  .fj-cell-content {
    flex: 1;
    display: flex;
    align-items: center;
    padding: 14px 0;

    background-image: linear-gradient(180deg,#CED9E5,#CED9E5 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
  }
  .fj-cell-title {
    flex: 1;
    color: #333333;
  }
  .fj-cell-brief {
    margin-top: 5px;
    font-size: 12px;
    line-height: 1;
    color: #959595;
  }
  .fj-cell-icon {
    margin-right: 16px;
    font-size: 29px;
  }
  .fj-cell-value {
    margin-right: 15px;
    color: #767676;
  }
  .fj-cell-value.isLink {
    margin-right: 30px;
  }
  .fj-cell-arrow {
    position: absolute;
    top: 50%;
    right: 15px;
    width: 12px;
    height: 12px;

    border: 2px solid #CED9E5;
    border-bottom: 0;
    border-left: 0;

    transform: translateY(-50%) rotate(45deg);
  }
  .fj-cell-link-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    background-color: #CED9E5;
  }
  .fj-cell-link-mask:active {
    opacity: .2;
  }
  .fj-cell-right {
    /*position: absolute;*/
    /*top: 50%;*/
    margin-right: 20px;
    /*transform: translateY(-50%);*/
    font-size: 20px;
    color: #AAAAAA;
  }
</style>
