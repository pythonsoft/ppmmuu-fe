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
