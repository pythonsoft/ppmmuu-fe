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
                :class="talkToInfo.ToAccount === item.txSession.ToAccount? 'im-main-left-dialog-list-item active' : 'im-main-left-dialog-list-item'"
                @click="(e) => contactClick(e, item)"
              >
                <div class="avatar">
                  <img v-if="item.dialogInfo.members.length === 0" class="im-avatar" width="24" height="24">
                  <img v-else-if="item.dialogInfo.members.length === 1" :src="item.dialogInfo.members[0].photo || '/static/img/avatar.png'" class="im-avatar" width="24" height="24"/>
                  <img
                    v-else
                    v-for="(member, index) in item.dialogInfo.members.slice(0, 3)"
                    :src="member.photo || '/static/img/avatar.png'"
                    class="im-avatar im-img-style im-avatar-group"
                    width="16" height="16"
                    :style="index === 0 ? 'top: 0; left: 0; z-index: 1;' : index === 1 ? 'top: 0; left: 8px; z-index: 2;' : 'top: 8px; left: 4px; z-index: 3;' "
                  >
                </div>
                <div class="content">
                  {{ item.dialogInfo.name || '暂无名称' }}
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
            <div class="im-dialog-main-right-content" ref="container">
            </div>
          </div>

          <div v-else class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                {{getTalkToName()}}
                <span class="iconfont icon-xiala"></span>
              </div>
            </div>
            <div class="im-dialog-main-right-content" ref="container">
              <div
                v-for="item in currentDialogMessages"
                :class="setDialogMessageClass(item)"
              >
                <div class="time">{{formatTime(item.time)}}</div>
                <div class="body">
                  <div class="avatar">
                    <img :src="getAvatarAndClass(item).avatar" :class="getAvatarAndClass(item).className" width="24" height="24"/>
                  </div>
                  <div class="message">
                    <div v-if="isGroup(item)" class="name">{{getTalkToName()}}</div>
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
            <div class="im-dialog-main-right-dialog-members">
              <div class="add"></div>
              <div class="delete"></div>
              <div class="item"></div>
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

    <fj-dialog
      title="输入群组名称"
      :visible.sync="groupNameDialogVisible"
      @close="groupNameDialogVisible=false"
    >
      <div>请输入群组名称</div>
      <div>
        <fj-input placeholder="群组名称" v-model="groupName" size="small"></fj-input>
      </div>
      <div slot="footer" class="dialog-footer">
        <fj-button @click="groupNameDialogCancel">取消</fj-button><!--
        --><fj-button type="primary" @click="groupNameDialogConfirm">确定</fj-button>
      </div>
    </fj-dialog>

  </div>
</template>
<script>
  import './index.css'
  import { getItemFromLocalStorage, isEmptyObject, formatShortTime } from '../../common/utils';
  import DepartmentBrowser from "../higherOrder/departmentBrowser/index.vue";
  import FjButton from "../fjUI/packages/button/src/button.vue";
  import FjDialog from "../fjUI/packages/dialog/src/dialog.vue";
  import FjInput from "../fjUI/packages/input/src/input.vue";

  const api = require('./api');

  export default {
    components: {
      FjInput,
      FjDialog,
      FjButton,
      DepartmentBrowser
    },
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
        timeMap: {},
        groupNameDialogVisible: false,
        groupName: '',
        departmentBrowserResult: [],
      }
    },
    created() {
      this.myselfInfo = getItemFromLocalStorage('userInfo');
//      this.login();
//
//      console.log('myselfInfo ===>', this.myselfInfo);
//
//      api.on('im_onMsgNotify', (msg) => {
//        console.log('im_onMsgNotify --->', msg);
//        this.currentDialogMessages = this.currentDialogMessages.concat(msg);
//        this.scrollToBottom();
//      });


    },
    updated() {
    },
    methods: {
      groupNameDialogCancel() {
        this.departmentBrowserResult = [];
        this.groupNameDialogVisible = false;
        this.groupName = '';
      },
      groupNameDialogConfirm() {
        if(!this.groupName) {
          this.$message.error('请输入群组名称');
          return false;
        }

        const items = this.departmentBrowserResult;
        const len = items.length;

        const info = {
          Name: this.groupName,
          Members: [this.myselfInfo._id],
          CreatorName: this.myselfInfo.name
        };

        for(let i = 0; i < len; i++) {
          info.Members.push(items[i]._id);
        }

        api.createGroup(info, (err, newGroupId) => {
          if(err) {
            this.$message.error(err);
            return false;
          }
          const me = this;

          this.departmentBrowserResult = [];
          this.groupNameDialogVisible = false;
          this.groupName = '';

          setTimeout(function() {
            me.getRecentContactList();
          }, 2000);
        });
      },
      isEmptyObject,
      convertMsgToHtml(item) {
        const str = api.convertMsgToHtml(item);
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
      scrollToBottom() {
        const container = this.$refs.container;

        if(container) {
          setTimeout(function() {
            container.scrollTop = container.scrollHeight;
          }, 100);
        }
      },
      getTalkToName() {
        const talkTo = this.talkToInfo;
        return isEmptyObject(talkTo) ? this.defaultName : (talkTo.C2cNick || talkTo.GroupNick || this.defaultName);
      },
      formatTime(t) {
        let str = '';
        const time = t * 1000;

        if(new Date().getTime() - time > 1000 * 60 * 10) {
          str = formatShortTime(new Date(time));
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
        this.currentDialogMessages = [];
      },
      isGroup(item) {
        return api.isGroup(item.Type);
      },
      contactClick(e, currentItem) {
        this.closeWindowSession();

        this.talkToInfo = currentItem.txSession;

        console.log('talk --->', this.talkToInfo, currentItem);

        api.getHistoryMessage(this.talkToInfo.ToAccount, api.isGroup(this.talkToInfo.Type), (err, messages) => {
          if(err) {
            console.error('getHistoryMessage error-->', err);
            return false;
          }

          console.log('contactCLICKC messages --->', messages);

          this.currentDialogMessages = messages;
          this.scrollToBottom();
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
      departmentBrowserConfirm(items) {
        this.departmentBrowserResult = items;
        const len = items.length;

        if(!len) {
          return false;
        }

        if(len === 1) {

        }else if(len > 1) {
          this.groupNameDialogVisible = true;
        }
      },
      sendMessage() {
        const val = this.content;
        this.content = '';

        api.sendMessage(this.talkToInfo, val.trim(), (err, msg) => {
          if(err) {
            console.log(err);
            return false;
          }

          this.currentDialogMessages.push(msg);
          this.scrollToBottom();
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
        api.getRecentContactList((err, rs) => {
          if(err) {
            this.$message.error(err);
            return false;
          }

          this.recentContactList = rs;
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
      },
    }
  }
</script>
