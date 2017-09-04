<template>
  <div>
    <div class="task-list-controller-wrap">
      <div class="player-control-item-wrap">
        <div class="player-control-item" @click="">
          <i class="iconfont icon-video-download"></i>
        </div>
        <div class="player-control-tooltip">下载</div>
      </div>
    </div>
    <div class="timeline-title">{{ materialTitle || '时间轴（无序列）' }}</div>
  </div>
</template>
<script>
  export default {
    data() {
      return {
        materialTitle: ''
      };
    }
  };
</script>
