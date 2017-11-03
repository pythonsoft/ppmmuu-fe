<template>
  <div>

    <div class="im-main" v-show="!dialogVisible" @click="displayDialog">
      <span v-if="message">xxx</span>
      <span v-else class="iconfont icon-jiqiren im-xiaou-icon"></span>
    </div>

    <div v-show="dialogVisible" class="im-dialog">
      <div class="im-dialog-wrap">
        <div class="im-dialog-bar">
          <span class="iconfont icon-jiqiren im-dialog-logo"></span>
          <ul class="im-dialog-bar-action">
            <li @click="closeHandle">
              <span class="iconfont icon-small-close im-dialog-close"></span>
            </li>
          </ul>
        </div>
        <div class="im-dialog-main">
          <div class="im-dialog-main-left">
            <div class="im-main-left-search"></div>
            <div class="im-main-left-dialog-list"></div>
          </div>
          <div class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar"></div>
            <div class="im-dialog-main-right-content"></div>
            <div class="im-dialog-main-right-chat">
              <div class="im-dialog-main-right-chat-bar"></div>
              <div class="im-dialog-main-right-chat-input"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  import './index.css'

  export default {
    name: 'im',
    data() {
      return {
        message: null,
        dialogVisible: false,
      }
    },
    methods: {
      displayDialog() {
        this.dialogVisible = true;
      },
      closeHandle() {
        this.dialogVisible = false;
      }
    }
  }
</script>
