<template>
  <div class="im-main">

    <div class="im-main-trigger" v-show="!dialogVisible" @click="displayDialog">
      <div v-if="message" class="user-avatar">
        <img :src="myselfInfo.photo" width="24"/>
        <div class="im-main-trigger-red-point"></div>
      </div>
      <span v-else class="iconfont icon-jiqiren im-xiaou-icon"></span>
    </div>

    <div v-show="dialogVisible" class="im-dialog">
      <div class="im-dialog-wrap">
        <div class="im-dialog-main">
          <div class="im-dialog-main-left">
            <div class="im-main-left-header">
              <div class="im-main-left-header-top">
                <div class="im-main-left-header-top-avatar">
                  <img v-if="myselfInfo.photo" :src="myselfInfo.photo" class="im-avatar" width="24" height="24">
                  <img v-else class="im-avatar im-img-style" width="24" height="24">
                </div>
                <div class="im-main-left-header-top-name">{{myselfInfo.name || '无名'}}</div>
              </div>
              <div class="iconfont icon-tongxunlu im-icon-menu" @click="displayMenu"></div>
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
              <div v-for="item in recentContactList" class="im-main-left-dialog-list-item active" @click="contactClick">
                <div class="avatar">
                  <img v-if="myselfInfo.photo" :src="myselfInfo.photo" class="im-avatar" width="24" height="24">
                  <img v-else class="im-avatar im-img-style" width="24" height="24">
                </div>
                <div class="content">
                  幸福大家庭
                </div>
              </div>
            </div>
          </div>
          <div class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                sasa
                <span class="iconfont icon-xiala"></span>
              </div>
            </div>
            <div class="im-dialog-main-right-content">
              <div class="im-dialog-main-right-content-item left">
                <div class="time">21:55</div>
                <div class="body">
                  <div class="avatar">
                    <img v-if="myselfInfo.photo" :src="myselfInfo.photo" class="im-avatar" width="24" height="24">
                    <img v-else class="im-avatar im-img-style" width="24" height="24">
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
                    <img v-if="myselfInfo.photo" :src="myselfInfo.photo" class="im-avatar" width="24" height="24">
                    <img v-else class="im-avatar im-img-style" width="24" height="24">
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
                <textarea @keyup.enter="sendMessage" v-model="content"></textarea>
              </div>
              <div class="im-dialog-main-right-chat-bar">
                <span>按下Cmd+Enter换行</span>
                <fj-button size="small" @click="sendMessage">发送</fj-button>
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
  import FjButton from "../fjUI/packages/button/src/button.vue";

  const api = require('./api');

  export default {
    components: {
      FjButton,
      DepartmentBrowser},
    name: 'im',
    data() {
      return {
        message: '',
        departmentBrowserVisible: false,
        dialogVisible: false,
        myselfInfo: {}, // 当前登录用户信息
        talkToInfo: {}, // 当前聊天对象信息
        keyword: '', // 检索用户时的关键词
        content: '', //发送窗口内容
        recentContactList: [], //最近会话列表
        currentDialogMessages: [], //当前会话所有聊天内容
      }
    },
    created() {
      this.myselfInfo = getItemFromLocalStorage('userInfo');
      this.login();
      console.log(this.myselfInfo);
      api.on('im_onMsgNotify', (msg) => {
        console.log('im_onMsgNotify ==>', msg);
      });
    },
    methods: {
      contactClick() {

      },
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
      sendMessage() {
        const val = this.content;
        this.content = '';
        api.sendMessage(this.talkToInfo._id, this.talkToInfo.name, this.talkToInfo.photo, val.trim(), (err, r) => {
          if(err) {
            console.log(err);
            return false;
          }
        });
      },
      login() {
        api.login(this.myselfInfo._id, this.myselfInfo.name, this.myselfInfo.photo, (err, rs) => {
          this.getRecentContactList();
          this.setProfile();
        });
      },
      getRecentContactList() {
        api.getRecentContactList((err, list) => {
          if(err) {
            this.$message.error(err);
            return false;
          }
          this.recentContactList = list.SessionItem;
          console.log('recentContactList -->', this.recentContactList);
        });
      },
      setProfile() {
        const myselfInfo = this.myselfInfo;

        api.setProfile({
          nickName: myselfInfo.name,
          gender: 'unknow',
          birderDay: '',
          allowType: 'allowAny',
          avatar: myselfInfo.photo,
          sign: '',
        }, (err, r) => {
          console.log(err, r);
        });
      }
    }
  }
</script>
