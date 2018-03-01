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
        :is-owner="conversation.owner === myselfId"
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
            <img v-if="item.type === 'picture'" :src="item.url" class="pic-content" width="110" @click="(e)=>{handleClickImage(item, e)}">
            <div v-else-if="item.type === 'video'" class="message" @click="(e)=>{handleClickVideo(item, e)}">
              <video :src="item.url" width="110" ref="video" preload="metadata" class="pic-content"></video>
              <i class="iconfont icon-play video-poster-icon"></i>
            </div>
            <div v-else-if="item.type === 'audio'">
              <div :class="['audio-btn', {'current-audio': playingAudioIndex === index}]" @click="playMessage(item, index)">
                <i class="iconfont icon-voice"></i>
                <span class="audio-length">{{ `${item.length}''` }}</span>
              </div>
              <audio ref="audioMsg" class="audio-message"></audio>
            </div>
            <div v-else class="detail" v-html="formatContent(item.content)"></div>
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
      <div class="im-toolbar">
        <i class="iconfont icon-picture" @click="handlePicBtnClick"></i>
        <input type="file" ref="pictureInput" class="hide-input" @change="handlePictureChange">
      </div>
      <div class="im-dialog-main-right-chat-wrap">
        <textarea ref="contentInput" @focus="handleFocus" @keydown.enter="handleEnter" v-model="content"></textarea>
      </div>
      <div class="im-dialog-main-right-chat-bar">
        <span>按下{{ metaName }}+Enter换行</span>
        <fj-button size="small" @click="sendMessage">发送</fj-button>
      </div>
    </div>
    <fj-dialog
      :visible.sync="imageDialogVisible"
      :show-close="false"
      :close-on-click-modal="true"
      :width="`${imageWidth}px`"
      type="basic">
      <div class="image-dialog-wrap" v-if="dialogContentType==='image'">
        <img ref="image" :src="currentImg" :width="imageWidth">
        <a class="iconfont icon-download image-dialog-download-icon" :href="currentImg" :download="currentImgTitle"></a>
      </div>
      <div v-else>
        <video ref="dialogVideo" :src="currentVideo" autoplay loop preload="auto" :width="imageWidth"></video>
      </div>
    </fj-dialog>
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
        groupMemberBrowserVisible: false,
        fileType: 'image',
        imageDialogVisible: false,
        dialogContentType: 'image',
        currentImgTitle: '',
        currentImg: '',
        currentVideo: '',
        imageWidth: 640,
        playingAudioIndex: -1
      };
    },
    watch: {
      messages() {
        // console.log('messages change');
        this.scrollToBottom();
      },
      imageDialogVisible(val) {
        if (!val) {
          this.currentVideo = '';
        }
      }
    },
    mounted() {
      const contentInput = this.$refs.contentInput;
      contentInput.addEventListener('paste', (e)=> {
        const data = e.clipboardData;
        if (data.items.length === 1 && data.items[0].kind === 'string') return;
        e.preventDefault();
        if (data && data.types) {
          const len = data.items.length;
          if (len > 0) {
            const item = data.items[len - 1];
            if (/^image\/\w+$/.test(item.type)) {
              const blob = item.getAsFile();
              const url = window.URL.createObjectURL(blob);
              const file = { data: blob, url: url };
              this.$emit('send-picture', file);
            }
          }
        }
      });
    },
    methods: {
      playMessage(item, index) {
        const audioMsg = this.$refs.audioMsg[index];
        audioMsg.src = item.src;
        if (this.playingAudioIndex === index) {
          audioMsg.pause();
          audioMsg.currentTime = 0;
        } else {
          audioMsg.play();
          audioMsg.onended = () => {
            this.playingAudioIndex = -1;
          };
          this.playingAudioIndex = index;
        }
      },
      setImageWidth(width = 640, height = 640) {
        if (this.dialogContentType === 'video' && !this.currentVideo) return;
        if (this.dialogContentType === 'image' && !this.currentImg) return;
        let newWidth = width;
        const maxHeight = window.innerHeight - 200 - 20;
        const maxWidth = window.innerWidth - 20 - 20;
        if (height > maxHeight) {
          newWidth = width * maxHeight / height;
        }
        if (newWidth > maxWidth) {
          newWidth = maxWidth;
        }
        this.imageWidth = newWidth;
      },
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
      handleClickImage(item, e) {
        const target = e.target;
        this.currentImg = item.url;
        this.currentImgTitle = item.filename;
        this.$nextTick(() => {
          const width = target.naturalWidth;
          const height = target.naturalHeight;
          this.setImageWidth(width, height);
          this.imageDialogVisible = true;
          this.dialogContentType = 'image';
        });
      },
      handleClickVideo(item, e) {
        let target = e.target;
        if (target.tagName.toLowerCase() !== 'video') {
          target = target.parentNode.getElementsByTagName('video')[0];
        }
        this.currentVideo = item.url;
        this.$nextTick(() => {
          this.dialogContentType = 'video';
          const width = target.videoWidth;
          const height = target.videoHeight;
          this.setImageWidth(width, height);
          this.imageDialogVisible = true;
        });
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
      },
      handlePicBtnClick(fileType = 'image') {
        this.fileType = fileType;
        this.$refs.pictureInput.click();
      },
      handlePictureChange(e) {
        const file = WebIM.utils.getFileUrl(this.$refs.pictureInput);
        if (!file.filename) {
          this.$refs.pictureInput.value = null;
          return;
        }
        if (this.fileType === 'video') {
          if (['mp4','wmv','avi','rmvb','mkv'].indexOf(file.filetype.toLowerCase()) === -1) {
            this.$refs.pictureInput.value = null;
            this.$message.error('视频格式错误');
            return;
          }
          this.$emit('send-video', file);
        } else {
          if (['gif','bmp','jpg','png'].indexOf(file.filetype.toLowerCase()) === -1) {
            this.$refs.pictureInput.value = null;
            this.$message.error('图片格式错误');
            return;
          }
          this.$emit('send-picture', file);
        }
      }
    },
    components: {
      GroupMemberBrowser
    }
  };
</script>
