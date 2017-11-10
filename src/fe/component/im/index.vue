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
                <div class="im-main-left-header-top-name">{{myselfInfo.name || defaultName}}</div>
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
              <div
                v-if="recentContactList.length !== 0"
                v-for="item in recentContactList"
                :class="talkToInfo.To_Account === item.To_Account? 'im-main-left-dialog-list-item active' : 'im-main-left-dialog-list-item'"
                @click="(e) => contactClick(e, item)"
              >
                <div class="avatar">
                  <img v-if="item.C2cImage || item.GroupImage" :src="item.C2cImage || item.GroupImage" class="im-avatar" width="24" height="24">
                  <img v-else class="im-avatar im-img-style" width="24" height="24">
                </div>
                <div class="content">
                  {{ item.C2cNick || item.GroupNick || '暂无名称' }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="isEmptyObject(talkToInfo)" class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                <span class="im-dialog-main-right-bar-wrap-tip">找个人聊聊天吧</span>
              </div>
            </div>
            <div class="im-dialog-main-right-content">
            </div>
          </div>

          <div v-else class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                {{getTalkToName()}}
                <span class="iconfont icon-xiala"></span>
              </div>
            </div>
            <div class="im-dialog-main-right-content">
              <div
                v-for="item in currentDialogMessages"
                :class="setDialogMessageClass(item)"
              >
                <div class="time">{{formatTime(item.time)}}</div>
                <div class="body">
                  <div class="avatar">
                    <img :src="getAvatarAndClass(item).avatar" :class="getAvatarAndClass(item).className" width="24" height="24"/>
                    <!--<img v-if="myselfInfo.photo" :src="myselfInfo.photo" class="im-avatar" width="24" height="24">-->
                    <!--<img v-else class="im-avatar im-img-style" width="24" height="24">-->
                  </div>
                  <div class="message">
                    <div class="name">{{getTalkToName()}}</div>
                    <div class="detail" v-html="convertMsgToHtml(item)"></div>
                    <p v-if="item.isResend" class="resend">
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
  import { getItemFromLocalStorage, isEmptyObject, formatShortTime } from '../../common/utils';
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
        showTimeFlag: true, //对话框里边显示时间
        defaultName: '无名',
        message: '',
        departmentBrowserVisible: false,
        dialogVisible: false,
        myselfInfo: {}, // 当前登录用户信息
        talkToInfo: {}, // 当前聊天对象信息
        keyword: '', // 检索用户时的关键词
        content: '', //发送窗口内容
        recentContactList: [], //最近会话列表
        currentDialogMessages: [], //当前会话所有聊天内容
        timeMap: {}
      }
    },
    created() {
      this.myselfInfo = getItemFromLocalStorage('userInfo');
      this.login();

      console.log('myselfInfo ===>', this.myselfInfo);

      api.on('im_onMsgNotify', (msg) => {
        console.log('im_onMsgNotify ==>', msg);
        this.currentDialogMessages.push(msg);
      });
    },
    methods: {
      isEmptyObject,
      convertMsgToHtml(item) {
        const str = api.convertMsgToHtml(item);
        console.log('api.convertMsgToHtml(item) -->', str);
        return str;
      },
      getAvatarAndClass(item) {
        const cls = ['im-avatar'];
        const avatar = api.getAvatar(item);

        if(!avatar) {
          cls.push('im-img-style');
        }

        return { avatar: avatar, className: cls.join(' ') };
      },
      setDialogMessageClass(messageInfo) {
        const rs = ['im-dialog-main-right-content-item'];
        if(messageInfo.fromAccount === this.myselfInfo._id) {
          rs.push('right');
        }else {
          rs.push('left');
        }

        return rs.join(' ');
      },
      getTalkToName() {
        const talkTo = this.talkToInfo;
        return isEmptyObject(talkTo) ? this.defaultName : (talkTo.C2cNick || talkTo.GroupNick || this.defaultName);
      },
      formatTime(t) {
        let str = '';
        if(new Date().getTime() - t > 1000 * 60 * 20) {
          str = formatShortTime(new Date(t));
        }

        if(this.timeMap[str]) {
          str = ''
        }else {
          this.timeMap[str] = true;
        }

        return str;
      },
      closeWindowSession() {
        this.timeMap = {};
      },
      contactClick(e, currentItem) {
        this.closeWindowSession();

        this.talkToInfo = currentItem;

        api.getHistoryMessage(currentItem.To_Account, api.isGroup(currentItem.Type), (err, messages) => {
          if(err) {
            console.error('getHistoryMessage error-->', err);
            return false;
          }

          console.log('getHistoryMessage --->', messages);

          this.currentDialogMessages = messages;
        });
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

        api.sendMessage(this.talkToInfo, val.trim(), (err, r) => {
          if(err) {
            console.log(err);
            return false;
          }
        });
      },
      login() {
        api.login(this.myselfInfo._id, this.myselfInfo.name, this.myselfInfo.photo, (err, rs) => {
          if(err) {
            this.$message.error(err);
            return false;
          }

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
          this.recentContactList = list.SessionItem || [];
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
