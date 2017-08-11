<template>
  <div>
    <table class="media-center-table">
      <tr>
        <td class="item-info-key" width="80">详细信息: </td>
        <td class="item-info-value">
          <div class="media-center-more-bar">
            <span class="media-center-more" @click="moreClick">更多</span>
            <span :class="arrowClass"></span>
          </div>
        </td>
      </tr>
    </table>
    <table class="media-center-table" :style="{ display: visible }">
      <tr v-for="(item, key) in info">
        <td class="item-info-key" width="80">{{ key + ': ' || '空KEY:' }}</td>
        <td class="item-info-value">{{ item || '-' }}</td>
      </tr>
    </table>
  </div>
</template>
<script>
  export default {
    name: 'mediaCenterMore',
    props: {
      info: { type: Object, default: {} },
    },
    data() {
      return {
        visible: 'none',
        arrowClass: 'media-center-arrow-right'
      };
    },
    methods: {
      moreClick() {
        if(this.visible === 'none') {
          this.visible = 'block';
          this.arrowClass = 'media-center-arrow-down';
        }else {
          this.visible = 'none';
          this.arrowClass = 'media-center-arrow-right';
        }

      },
    }
  }
</script>
