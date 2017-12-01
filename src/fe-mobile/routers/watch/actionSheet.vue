<template>
  <transition name="fj-picker" :duration="300">
    <div v-show="visible">
      <div class="fj-picker-mask" @click="cancel"></div>
      <div class="fj-picker-popup">
        <div class="actionsheet-title">下载地址选择列表</div>
        <ul class="actionsheet-list">
          <li class="actionsheet-list-item" v-for="item in actions" @click="$emit('click-menu', item)">
            {{ item.name }}
            <span v-if="item.desc" class="actionsheet-list-item-desc">{{ item.desc }}</span>
          </li>
        </ul>
      </div>
    </div>
  </transition>
</template>
<script>
  export default {
    props: {
      visible: {
        type: Boolean,
        default: false
      },
      actions: Array
    },
    data() {
      return {
      };
    },
    methods: {
      cancel() {
        this.$emit('update:visible', false);
      },
    }
  };
</script>
<style>
  .actionsheet-title {
    padding: 2px 15px;
    font-size: 12px;
    color: #767676;
    background: #E2E2E2;
  }
  .actionsheet-list-item {
    padding: 13px 15px;
    background: #fff;
    background-image: linear-gradient(0deg,#E2E2E2,#E2E2E2 50%,transparent 0);
    background-size: 100% 1px;
    background-repeat: no-repeat;
    background-position: bottom;
    font-size: 15px;
    color: #333333;
  }
  .actionsheet-list-item-desc {
    display: block;
    padding-top: 2.5px;
    font-size: 12px;
    color: #959595;
  }
</style>
