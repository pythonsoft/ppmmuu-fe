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
