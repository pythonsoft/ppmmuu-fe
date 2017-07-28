<template>
  <transition name="slide-in-right">
    <div v-show="visible" class="fj-slide-dialog-wrapper" :style="{ width: width }">
      <div class="fj-slide-dialog-header">
        <slot name="title">
          <span class="fj-slide-dialog-title">{{title}}</span>
        </slot>
        <i v-if="showClose" class="iconfont icon-close fj-dialog-closebtn" @click="handleClose"></i>
      </div>
      <div class="fj-dialog-body"><slot></slot></div>
      <div class="fj-dialog-footer" v-if="$slots.footer">
        <slot name="footer"></slot>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'FjSlideDialog',
    props: {
      title: {
        type: String,
        default: ''
      },
      showClose: {
        type: Boolean,
        default: true
      },
      width: {
        type: String,
        default: '468px'
      },
      visible: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {};
    },
    methods: {
      handleClose() {
        this.$emit('update:visible', false);
      }
    },
    watch: {
      visible(val) {
        if (val) {
          this.$emit('open');
        } else {
          this.$emit('close');
        }
      }
    }
  };
</script>
