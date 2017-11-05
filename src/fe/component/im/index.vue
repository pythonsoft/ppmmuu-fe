<template>
  <div class="im-main">

    <div class="im-main-trigger" v-show="!dialogVisible" @click="displayDialog">
      <span v-if="message">xxx</span>
      <span v-else class="iconfont icon-jiqiren im-xiaou-icon"></span>
    </div>

    <div v-show="dialogVisible" class="im-dialog">
      <div class="im-dialog-wrap">
        <div class="im-dialog-main">
          <div class="im-dialog-main-left">
            <div class="im-main-left-header">
              <div class="im-main-left-header-top">
                <div class="im-main-left-header-top-avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="im-main-left-header-top-name">{{userInfo.name || '无名'}}</div>
                <div class="iconfont icon-menu im-icon-menu" @click="displayMenu"></div>
              </div>
              <div class="im-dialog-main-left-search">
                <fj-input
                  placeholder="请输入用户名"
                  size="small"
                  theme="fill"
                  v-model="keyword"
                  icon="icon-search input-search-icon"
                  @on-icon-click=""
                  @keydown.native.enter.prevent=""
                ></fj-input>
              </div>
            </div>
            <div class="im-main-left-dialog-list">
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item active">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
              <div class="im-main-left-dialog-list-item">
                <div class="avatar">
                  <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                  <img v-else class="im-avatar im-img-style" width="30" height="30">
                </div>
                <div class="content">
                  <span>幸福大家庭</span>
                  <span class="time">20:40</span>
                </div>
              </div>
            </div>
          </div>
          <div class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                sasa
              </div>
            </div>
            <div class="im-dialog-main-right-content">
              <div class="im-dialog-main-right-content-item left">
                <div class="time">21:55</div>
                <div class="body">
                  <div class="avatar">
                    <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                    <img v-else class="im-avatar im-img-style" width="30" height="30">
                  </div>
                  <div class="message">
                    <div class="name">sasa</div>
                    <div class="detail">
                      加班还是聚餐去啦？
                    </div>
                    <p class="resend">
                      <span class="iconfont icon-info"></span>
                      点击重发
                    </p>
                  </div>
                </div>
              </div>
              <div class="im-dialog-main-right-content-item right">
                <div class="time">21:55</div>
                <div class="body">
                  <div class="avatar">
                    <img v-if="userInfo.photo" :src="userInfo.photo" class="im-avatar" width="30" height="30">
                    <img v-else class="im-avatar im-img-style" width="30" height="30">
                  </div>
                  <div class="message">
                    <div class="name">sasa</div>
                    <div class="detail">
                      加班还是聚餐去啦？
                    </div>
                    <p class="resend">
                      <span class="iconfont icon-info"></span>
                      点击重发
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div class="im-dialog-main-right-chat">
              <div class="im-dialog-main-right-chat-wrap">
                <textarea placeholder="按下Cmd+Enter换行"></textarea>
              </div>
            </div>
          </div>
        </div>
        <div class="iconfont icon-small-close im-icon-small-close" @click="closeHandle"></div>
      </div>
    </div>

    <department-browser
      :visible.sync="departmentBrowserVisible"
      @confirm="departmentBrowserConfirm"
    ></department-browser>
  </div>
</template>
<script>
  import './index.css'
  import { getItemFromLocalStorage } from '../../common/utils';
  import DepartmentBrowser from "../higherOrder/departmentBrowser/index.vue";

  const api = require('./api');

  const accountMode = 1;
  //官方 demo appid,需要开发者自己修改
  const sdkAppID = 1400047308;
  const accountType = 18694;

  export default {
    components: {DepartmentBrowser},
    name: 'im',
    data() {
      return {
        departmentBrowserVisible: false,
        message: null,
        dialogVisible: false,
        userInfo: {},
        keyword: ''
      }
    },
    created() {
      this.userInfo = getItemFromLocalStorage('userInfo');
      this.login();
    },
    methods: {
      displayMenu() {
        this.departmentBrowserVisible = true;
      },
      displayDialog() {
        this.dialogVisible = true;
      },
      closeHandle() {
        this.dialogVisible = false;
      },
      departmentBrowserConfirm() {

      },
      login() {
        api.login({
          username: this.userInfo._id,
          displayname: this.userInfo.name
        }).then((res) => {
          console.log('login --->', res);
        }).catch((err) => {
          this.$message.error(err);
        });
      }
    }
  }
</script>
