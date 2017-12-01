<template>
  <transition name="fj-toast-fade">
    <div
      class="fj-toast"
      v-show="visible">
      <i v-if="icon" :class="['fj-toast-icon iconfont', icon]"></i>
      <span class="fj-toast-text">{{ message }}</span>
    </div>
  </transition>
</template>
<script>
  export default {
    data() {
      return {
        visible: false,
        icon: '',
        message: '',
        type: '',
        duration: 3000
      };
    },
    methods: {
      close() {
        this.visible = false;
        this.$el.addEventListener('transitionend', this.destroyElement);
      },
      destroyElement() {
        this.$el.removeEventListener('transitionend', this.destroyElement);
        this.$destroy(true);
        this.$el.parentNode.removeChild(this.$el);
      },
      startTimer() {
        if (this.duration > 0) {
          this.timer = setTimeout(() => {
            this.close();
          }, this.duration);
        }
      }
    },
    mounted() {
      this.startTimer();
    }
  };
</script>
<style>
  @import "../../../variables.css";
  .fj-toast {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    padding: 16px;
    background: rgba(0, 0, 0, .8);
    border-radius: 3px;
    font-size: 12px;
    color: #FFFFFF;
    text-align: center;
    z-index: var(--z-index-toast);
  }
  .fj-toast-icon {
    display: block;
    margin-bottom: 9px;
    font-size: 22px;
  }
</style>
