<template>
  <transition name="fj-zoom-in-top">
    <div :class="[$style.wrap, 'clearfix']" v-show="visible" v-clickoutside="handleClose">
      <div v-for="member in members" :key="member" :class="$style.item" :title="(infos[member] && infos[member].nickname) || ''">
        <img :src="member.avatar" :class="['im-avatar im-img-style', $style.avatar]" width="24" height="24">
        <p :class="$style.nickname">{{ (infos[member] && infos[member].nickname) || '' }}</p>
      </div>
    </div>
  </transition>
</template>
<script>
  import Clickoutside from '../../fjUI/utils/clickoutside';

  export default {
    directives: { Clickoutside },
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      members: {
        type: Array,
        default: []
      },
      infos: Object
    },
    data() {
      return {};
    },
    methods: {
      handleClose(e) {
        if (e.id === 'show-group-member-btn') return;
        this.$emit('update:visible', false);
      }
    }
  };
</script>
<style module>
  .wrap {
    position: absolute;
    top: 39px;
    left: 0;
    right: 0;
    height: 125px;
    padding: 10px 14px;
    border-bottom: 1px solid #E3EAF3;
    z-index: 1;
    overflow: auto;
    background: #F3F5F6;
  }
  .item {
    float: left;
    width: 36px;
    margin: 5px 9px;
    text-align: center;
    cursor: default;
  }
  .avatar {
    display: block;
    margin: 0 auto;
  }
  .nickname {
    width: 36px;
    margin-top: 4px;
    font-size: 12px;
    color: #4C637B;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    line-height: 1;
    text-align: center;
    vertical-align: middle;
  }
</style>
