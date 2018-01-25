<template>
  <div class="im-dialog-main-right">
    <div class="im-dialog-main-right-bar">
      <div class="im-dialog-main-right-bar-wrap">
        {{ conversation.nickname || conversation.name }}
        <div class="im-dialog-main-right-bar-icon" v-if="conversation.groupid">
        <span
          id="show-group-member-btn"
          @click="groupMemberBrowserVisible = !groupMemberBrowserVisible"
          :class="['iconfont icon-xiala', { 'is-reverse': groupMemberBrowserVisible }]"></span>
        </div>
      </div>
      <group-member-browser
        v-if="conversation.groupid"
        @show-department-browser="$emit('show-department-browser')"
        @update-group-name="(name)=>{ $emit('update-group-name', name) }"
        :visible.sync="groupMemberBrowserVisible"
        :group-name="conversation.name"
        :members="conversation.members"
        :infos="users"></group-member-browser>
    </div>
    <div class="im-dialog-main-right-content" ref="container">
      <p v-if="conversation.notFriend" class="im-dialog-main-right-tip">对方不是您的好友，可能接收不到您的信息</p>
      <div
        v-for="(item, index) in messages"
        :key="item.time"
        :class="setDialogMessageClass(item)"
      >
        <div class="time" v-if="formatTime(item.time, index)">{{ formatTime(item.time, index) }}</div>
        <div class="body">
          <div class="avatar">
            <img :src="users[item.from].avatar" class="im-avatar im-img-style" width="24" height="24"/>
          </div>
          <div class="message">
            <div v-if="conversation.groupid && item.from !== myselfId" class="name">{{ users[item.from].nickname }}</div>
            <div class="detail" v-html="formatContent(item.content)"></div>
            <p v-if="item.error" class="resend">
              <span class="iconfont icon-info"></span>
              未发送成功
            </p>
            <p v-if="loadingMessages.indexOf(item.time) > -1" class="loading">
              正在发送...
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="im-dialog-main-right-chat">
      <div class="im-dialog-main-right-chat-wrap">
        <textarea ref="contentInput" @focus="handleFocus" @keydown.enter="handleEnter" v-model="content"></textarea>
      </div>
      <div class="im-dialog-main-right-chat-bar">
        <span>按下{{ metaName }}+Enter换行</span>
        <fj-button size="small" @click="sendMessage">发送</fj-button>
      </div>
    </div>
  </div>
</template>
<script>
  import GroupMemberBrowser from "./groupMemberBrowser";
  import { formatShortTime } from '../../../common/utils';

  export default {
    props: {
      messages: Array,
      loadingMessages: Array,
      conversation: Object,
      conversationId: String,
      users: Object,
      myselfId: String
    },
    data() {
      const platform = navigator.platform;
      const system = {
        win: platform.indexOf('Win') === 0,
        mac: platform.indexOf('Mac') === 0
      };
      return {
        metaName: system.win ? 'Ctrl' : 'Cmd',
        content: '', //发送窗口内容
        groupMemberBrowserVisible: false
      };
    },
    watch: {
      messages() {
        this.scrollToBottom();
      }
    },
    methods: {
      handleFocus() {
        this.$emit('clear-unread-message');
      },
      formatContent(content) {
        return content.replace(/\n/g, '<br/>');
      },
      handleEnter(e) {
        if (!e.metaKey) {
          e.preventDefault();
          this.sendMessage();
        } else {
          this.content += '\n';
          const contentInput = this.$refs.contentInput;
          this.$nextTick(()=> {
            contentInput.scrollTop += 14;
          });
        }
      },
      sendMessage() {
        this.handleFocus();
        const val = this.content.trim();
        if (val.length === 0) return;
        this.$emit('send-message', val);
        this.content = '';
      },
      setDialogMessageClass(messageInfo) {
        const rs = ['im-dialog-main-right-content-item'];
        // console.log('setDialogMessageClass -->', messageInfo);
        if(messageInfo.from === this.myselfId) {
          rs.push('right');
        }else {
          rs.push('left');
        }
        return rs.join(' ');
      },
      formatTime(t, messageIndex) {
        if (messageIndex === 0) {
          return formatShortTime(new Date(t));
        }
        let str = '';
        if(t - this.messages[messageIndex - 1].time > 1000 * 60 * 5) {
          str = formatShortTime(new Date(t));
        }
        return str;
      },
      getAvatarAndClass(item) {
        const cls = ['im-avatar'];
        const avatar = item.avatar;
        // const avatar = api.getAvatar(this.talkToSession, item);

        if(!avatar) {
          cls.push('im-img-style');
        }

        return { avatar: avatar, className: cls.join(' ') };
      },
      scrollToBottom() {
        const container = this.$refs.container;

        if(container) {
          setTimeout(function() {
            container.scrollTop = container.scrollHeight;
          }, 100);
        }
      }
    },
    components: {
      GroupMemberBrowser
    }
  };
</script>
