<template>
  <transition name="dialog-fade">
    <div class="fj-dialog-wrapper" v-show="visible">
      <div v-if="modal" class="fj-modal" @click.self="handleModalClick"></div>
      <div class="fj-dialog" :style="style">
        <div class="fj-dialog-header">
          <slot name="title">
            <span class="fj-dialog-title">{{title}}</span>
          </slot>
          <i v-if="showClose" class="fj-dialog-closebtn" @click="handleClose">X</i>
        </div>
        <div class="fj-dialog-body"><slot></slot></div>
        <div class="fj-dialog-footer" v-if="$slots.footer">
          <slot name="footer"></slot>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    name: 'FjDialog',
    props: {
      title: {
        type: String,
        default: ''
      },
      modal: {
        type: Boolean,
        default: true
      },
      showClose: {
        type: Boolean,
        default: true
      },
      top: {
        type: String,
        default: '200px'
      },
      width: {
        type: String,
        default: '460px'
      },
      visible: {
        type: Boolean,
        default: false
      },
      closeOnClickModal: {
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
      },
      handleModalClick() {
        if (!this.closeOnClickModal) return;
        this.handleClose();
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
    },
    computed: {
      style() {
        return { 'margin-top': this.top, width: this.width };
      }
    }
  };
</script>
