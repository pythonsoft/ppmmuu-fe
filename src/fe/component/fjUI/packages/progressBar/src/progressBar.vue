<template>
  <div class="fj-progress" :style="style"></div>
</template>
<script>
  export default {
    name: 'FjProgressBar',
    computed: {
      progress() {
        return window.FjProgressBarEventBus;
      },
      style() {
        const style = {};
        const transition = this.progress.transition;

        style.transition = `width ${transition.speed} ease, opacity ${transition.opacity} ease`;
        style.backgroundColor = this.progress.canSuccess ? '#aeff00' : 'red';
        style.boxShadow = this.progress.canSuccess ? '0 0 10px rgba(62, 173, 186, .7)' : '0 0 10px rgba(255, 107, 144, .7)';

        style.opacity = this.progress.show ? 1 : 0;
        style.width = `${this.progress.percent * 100}%`;
        return style;
      }
    }
  };
</script>
<style>
  .fj-progress {
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    /*background-color: #aeff00;*/
    /*box-shadow: 0 0 10px rgba(62, 173, 186, .7);*/
    /*transition: width .4s ease, opacity .2s ease;*/
    z-index: 9999;
  }
</style>
