<template>
  <div class="progress-circle" :style="{width: `${width}px`}">
    <svg viewBox="0 0 100 100">
      <path class="progress-circle-track" :d="trackPath" stroke="#CED9E5" :stroke-width="relativeStrokeWidth" fill="none"></path>

      <path class="progress-circle-path" :d="trackPath" stroke-linecap="round" :stroke="stroke" :stroke-width="relativeStrokeWidth" fill="none" :style="circlePathStyle"></path>
    </svg>
    <i :class="['iconfont progress-btn', icon]"></i>
  </div>
</template>
<script>
  export default {
    props: {
      status: String,
      percentage: {
        type: Number,
        default: 0,
        validator: function (val) {
          return val >= 0 && val <= 100;
        }
      }
    },
    data() {
      return {
        width: 50,
        strokeWidth: 4,
      };
    },
    computed: {
      relativeStrokeWidth() {
        return (this.strokeWidth / this.width * 100).toFixed(1);
      },
      trackPath() {
        const radius = parseInt(50 - parseFloat(this.relativeStrokeWidth) / 2, 10);

        return `M 50 50 m 0 -${radius} a ${radius} ${radius} 0 1 1 0 ${radius * 2} a ${radius} ${radius} 0 1 1 0 -${radius * 2}`;
      },
      perimeter() {
        const radius = 50 - parseFloat(this.relativeStrokeWidth) / 2;
        return 2 * Math.PI * radius;
      },
      circlePathStyle() {
        const perimeter = this.perimeter;
        return {
          strokeDasharray: `${perimeter}px,${perimeter}px`,
          strokeDashoffset: (1 - this.percentage / 100) * perimeter + 'px',
          transition: 'stroke-dashoffset 0.6s ease 0s, stroke 0.6s ease'
        };
      },
      icon() {
        let icon = ''
        switch (this.status) {
          case 'complete':
            icon = 'icon-check';
            break;
          case 'created':
          case 'dealing':
            icon = 'icon-pause';
            break;
          default:
            icon = 'icon-play';
        }
        return icon;
      },
      stroke() {
        let ret;
        switch (this.status) {
          case 'complete':
            ret = '#2EC4B6';
            break;
          case 'error':
            ret = '#FF3366';
            break;
          default:
            ret = '#38B1EB';
        }
        return ret;
      }
    }
  };
</script>
<style>
  .progress-circle {
    position: relative;
    margin-bottom: 6px;
  }
  .progress-btn {
    position: absolute;
    top: 17px;
    left: 18px;
    /*transform: translate(-50%, -50%);*/
    width: 15px;
    height: 15px;
    font-size: 14px;
    color: #CED9E5;
    z-index: 1;
  }
</style>
