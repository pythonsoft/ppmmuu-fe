<template>
  <div class="playerWrap">
    <video :height="height" :width="width" :src="url"></video>
    <div class="playerBottom">
      <div class="progressBarWrap">
        <div class="progressBarList">
          <div class="playProgress"></div>
          <div class="hoverProgress"></div>
        </div>
        <div class="playerPullIndicator"></div>
        <div class="playerTooltip">
          <div class="playerTooltipText"></div>
        </div>
      </div>
      <div class="controllerWrap">
        <div class="controller"></div>
        <div class="playerTime"></div>
        <div class="fullscreenIcon"></div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    props: {
      url: String,
      height: Number,
      width: Number
    }
  };
</script>
<style>
  .playerWrap {
    position: relative;
  }
  .playerBottom {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
  }
  .progressBarWrap {
    position: relative;
    height: 18px;
    background-image: linear-gradient(-1deg, #021120 28%, rgba(2,17,32,0.25) 100%, rgba(0,0,0,0.00) 100%);
    cursor: pointer;
  }
  .progressBarList {
    position: absolute;
    right: 0;
    bottom: 9px;
    left: 0;
    height: 2px;
    width: 100%;
    background: rgba(204, 204, 204, .5);
  }
  .playProgress {
    width: 10%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 100%;
    background: #38B1EB;
    transform-origin: 0 0;
  }
  .hoverProgress {
    left: 0;
    width: 50%;
    position: absolute;
    bottom: 0;
    height: 100%;
    background: rgba(244, 244, 244, .3);
  }
  .playerPullIndicator {
    top: 5px;
    left: 40px;
    position: absolute;
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #fff;
  }
  .controllerWrap {
    height: 20px;
    line-height: 20px;
    background: #021120;
  }
</style>
