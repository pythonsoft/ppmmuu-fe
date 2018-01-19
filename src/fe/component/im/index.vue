<template>
  <div class="im-main">

    <div class="im-main-trigger" v-show="!dialogVisible" @click="displayDialog">
      <div v-if="message" class="user-avatar">
        <span class="iconfont icon-jiqiren im-xiaou-icon" :style="{position: 'absolute', top: 0, left: '14px'}"></span>
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
            <div class="im-main-left-dialog-list" v-if="contactIds.length">
              <div
                v-for="id in contactIds"
                v-if="contactObj[id]"
                :key="id"
                :class="getRecentContactClass(contactObj[id], id)"
                @click="(e) => {contactClick(e, contactObj[id])}"
              >
                <div class="avatar">
                  <img v-if="contactObj[id].avatar" :src="contactObj[id].avatar" class="im-avatar" width="24" height="24">
                  <img
                    v-else-if="contactObj[id].members"
                    v-for="(member, index) in contactObj[id].members.slice(0, 4)"
                    :src="(users[member] && users[member].avatar) || '/static/img/avatar.png'"
                    class="im-avatar im-img-style im-avatar-group"
                    width="16" height="16"
                    :style="getGroupMemberAvatarStyle(index, contactObj[id].members.length)"
                  >
                  <div class="im-item-message-circle" v-if="contactObj[id]._hasUnreadMessage"></div>
                </div>
                <div class="content">
                  {{ contactObj[id].groupid ? contactObj[id].name : contactObj[id].nickname }}
                </div>
              </div>
            </div>
          </div>

          <div v-if="isEmptyObject(contactObj[talkToSession])" class="im-dialog-main-right">
            <div class="im-dialog-main-right-bar">
              <div class="im-dialog-main-right-bar-wrap">
                <span class="im-dialog-main-right-bar-wrap-tip">找个人聊聊天吧</span>
              </div>
            </div>
            <div class="im-dialog-main-right-content">
            </div>
          </div>
          <message-browser
            v-else
            :myself-id="myselfId"
            :messages="messagesObj[talkToSession]"
            :loading-messages="loadingMessages"
            :conversation="contactObj[talkToSession]"
            :conversation-id="talkToSession"
            @clear-unread-message="handleClearUnreadMessage"
            @send-message="sendMessage"
            :users="users"></message-browser>
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
        <fj-input ref="groupName" placeholder="群组名称" v-model="groupName" size="small"></fj-input>
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
  import { getItemFromLocalStorage, isEmptyObject } from '../../common/utils';
  import DepartmentBrowser from "../higherOrder/departmentBrowser/index.vue";
  import MessageBrowser from "./component/messageBrowser";

  const api = require('./api');
  const userAPI = require('../../api/user');

  function loadScript(url) {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.onload = function() {
        resolve();
      };
      script.src = url;
      document.getElementsByTagName('head')[0].appendChild(script);
    });
  }

  export default {
    components: {
      MessageBrowser,
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
        myselfId: '',
        talkToSession: '', // 当前聊天对象信息的索引值，对应contactObj的key
        keyword: '', // 检索用户时的关键词
        routers: [], // 好友们的id
        users: {}, // 包含用户信息的对象，key为用户id
        contactObj: {}, //最近会话列表
        contactIds: [],
        messagesObj: {},
        loadingMessages: [], // 正在发送中的消息，值为时间戳
        groupNameDialogVisible: false,
        groupName: '',
        departmentBrowserResult: [],
      }
    },
    watch: {
      dialogVisible(val) {
        if (val) {
          this.message = '';
        }
      },
      groupNameDialogVisible(val) {
        if (val) {
          this.$nextTick(() => {
            this.$refs.groupName.$refs.input.focus();
          });
        }
      }
    },
    created() {
      this.myselfInfo = getItemFromLocalStorage('userInfo');
      this.myselfId = this.myselfInfo._id.split('-').join('_');
      this.users[this.myselfId] = { nickname: this.myselfInfo.name, avatar: this.myselfInfo.photo };

      async function loadAllScript() {
        await loadScript('/static/strophe-1.2.8.min.js');
        await loadScript('/static/webim.config.js');
        await loadScript('/static/websdk-1.4.13.js');
        return ;
      };
      loadAllScript().then(this.initConn);
    },
    beforeDestroy() {
      this.conn.close();
      this.conn = null;
    },
    methods: {
      initConn() {
        this.conn = new WebIM.connection({
          isMultiLoginSessions: WebIM.config.isMultiLoginSessions,
          https: typeof WebIM.config.https === 'boolean' ? WebIM.config.https : location.protocol === 'https:',
          url: WebIM.config.xmppURL,
          heartBeatWait: WebIM.config.heartBeatWait,
          autoReconnectNumMax: WebIM.config.autoReconnectNumMax,
          autoReconnectInterval: WebIM.config.autoReconnectInterval,
          apiUrl: WebIM.config.apiURL,
          isHttpDNS: WebIM.config.isHttpDNS,
          isWindowSDK: WebIM.config.isWindowSDK,
          isAutoLogin: true,
          encrypt: WebIM.config.encrypt,
          delivery: WebIM.config.delivery,
          saveLocal: WebIM.config.saveLocal
        });
        this.openConn();

        this.conn.listen({
          onOpened: (message)=> {
            this.getRoster();
            this.getGroup();
          },
          onTextMessage: (message) => {
            console.log('onTextMessage', message);
            if (message.error) return;
            if (!this.dialogVisible) this.message = message.data;
            const msg = {
              time: new Date().getTime(),
              content: message.data
            };
            // 判断这个人是否已经在列表中。
            let flag = false;
            let isGroupMsg = message.type === 'groupchat';

            const contactObj = this.contactObj;
            let key = '';
            if (isGroupMsg) {
              key = message.to;
            } else {
              key = message.from;
            }
            if (this.contactIds.indexOf(key) > -1) {
              flag = true;
              const tempItem = contactObj[key];
              tempItem._hasUnreadMessage = true;
              this.$set(this.contactObj, key, tempItem);
              const index = this.contactIds.indexOf(key);
              this.contactIds.splice(index, 1);
              this.contactIds.unshift(key);

              const newArray = this.messagesObj[key].slice();
              newArray.push(Object.assign({}, message, msg));

              this.messagesObj = this.$set({}, this.messagesObj, { [key]: newArray });
            }

            if (!flag) {
              if (isGroupMsg) {
                this.listGroupMember(message.to);
                const item = {
                  groupid: message.to,
                  _hasUnreadMessage: true
                };
                this.$set(this.contactObj, message.to, item);
                this.contactIds.push(message.to);
                this.messagesObj = this.$set({}, this.messagesObj, { [message.to]: [Object.assign({}, message, msg)] });
              } else {
                this.getUsers([message.from]);
                const item = {
                  name: message.from,
                  _hasUnreadMessage: true
                };
                this.$set(this.contactObj, message.from, item);
                this.contactIds.push(message.from);
                this.messagesObj = this.$set({}, this.messagesObj, { [message.from]: [Object.assign({}, message, msg)] });
              }
            }
          },
          onRoster: (message) => {
            // 处理好友申请
          },
          onInviteMessage: (message) => {
            console.log('onInviteMessage', message);
            const roomid = message.roomid;
            if (roomid) {
              const item = {};
              this.listGroupMember(roomid).then((members)=> {
                item.members = members;
                const len = members.length > 4 ? 4 : members.length;
                this.getUsers(members.slice(0, len));

                this.getGroupname(roomid);

                item.groupid = roomid;
                // item.message = [];
                this.messagesObj[roomid] = [];

                item._hasUnreadMessage = false;

                this.$set(this.contactObj, roomid, item);
                this.contactIds.unshift(roomid);
                console.log('roomid', roomid);
              });
            }
          },
          onPresence: (message) => {
            // 自动接收对方添加好友的请求
            if (message.type === 'subscribe') {
              this.conn.subscribed({
                to: message.from,
                message: '[resp:true]'
              });
            } else if (message.type === 'subscribed') {
              // console.log('subscribed 别人同意你加他为好友', message);
            }
          },
          onClosed: (message) => {
            this.$message.error('您的小u已下线');
          },
          onError: (message) => {
            // this.$message.error(message);
          }
        });
      },
      openConn() {
        const _id = this.myselfId;
        const pwd = this.myselfInfo.createdTime;
        const option = {
          apiUrl: WebIM.config.apiURL,
          user: _id,
          pwd: pwd,
          appKey: WebIM.config.appkey
        };
        console.log('openConn', option);
        this.conn.open(option);
      },
      getRoster() {
        this.conn.getRoster({
          success: (roster)=> {
            console.log('roster', roster);
            const tempObj = {};
            const tempRouters = [];
            roster.forEach((item)=> {
              if (item.subscription === 'both' || item.subscription === 'to') {
                const oldItem = this.contactObj[item.name];
                if (oldItem && this.messagesObj[item.name]) {
                  item = Object.assign(item, oldItem);
                } else {
                  this.contactIds.push(item.name);
                  this.messagesObj[item.name] = [];
                  item._hasUnreadMessage = false;
                }
                tempObj[item.name] = item;
                tempRouters.push(item.name);
              }
            });
            this.routers = tempRouters;
            this.getUsers(this.routers);
            Object.assign(this.contactObj, tempObj);
            console.log('this.contactObj', this.contactObj);
          }
        });
      },
      getGroup() {
        this.conn.getGroup({
          success: (res)=> {
            const group = res.data;
            console.log('group', group);

            const tempObj = {};
            const loop = (index)=> {
              let item = group[index];
              if(!item) {
                this.contactObj = Object.assign({}, this.contactObj, tempObj);
                return false;
              }

              this.listGroupMember(item.groupid).then((members)=> {
                item.members = members;
                const len = members.length > 4 ? 4 : members.length;
                this.getUsers(members.slice(0, len));

                item.name = item.groupname;

                const oldItem = this.contactObj[item.groupid];
                if (oldItem && this.messagesObj[item.groupid]) {
                  item = Object.assign(item, oldItem);
                } else {
                  this.contactIds.push(item.groupid);
                  this.messagesObj[item.groupid] = [];
                  item._hasUnreadMessage = false;
                }

                tempObj[item.groupid] = item;

                loop(index+1);
              });
            };

            loop(0);
          }
        });
      },
      getGroupname(groupid) {
        this.conn.getGroup({
          success: (res)=> {
            const groups = res.data;
            for (let i = 0, len = groups.length; i < len; i++) {
              if (groups[i].groupid === groupid) {
                Object.assign(this.contactObj[groupid], { name: groups[i].groupname });
                break;
              }
            }
          },
          error: ()=> {}
        });
      },
      listGroupMember(groupId) {
        return new Promise((resolve, reject) => {
          const option = {
            pageNum: 1,
            pageSize: 1000,
            groupId: groupId,
            success: (res) => {
              const members = res.data.map(item => {
                return item.member || item.owner;
              });
              resolve(members);
            },
            error: (e) => reject(e)
          };
          this.conn.listGroupMember(option);
        });
      },
      getUsers(ids) {
        const reqIds = [];
        const keys = Object.keys(this.users);
        // 排除已经获取过的用户
        for (let i = 0, len = ids.length; i < len; i++) {
          const id = ids[i];
          if (keys.indexOf(id) < 0) reqIds.push(id);
        }
        if (reqIds.length === 0) return;
        userAPI.getUsers({ params: { _ids: reqIds.join(',') } }, this)
          .then((res)=>{
            const data = res.data;
            const tempObj = {};
            const keys = Object.keys(data);

            keys.forEach(key => {
              const id = key.split('-').join('_');
              const item = data[key];
              tempObj[id] = { nickname: item.name, avatar: item.photo };

              if (this.contactObj[id]) {
                Object.assign(this.contactObj[id], tempObj[id]);
              }
              if (!this.users[id]) {
                this.users[id] = tempObj[id];
              }
            });
          })
          .catch((error)=>{
            // this.$message.error(error);
          })
      },
      sendMessage(val) {
        const currentItem = this.contactObj[this.talkToSession];

        const name = currentItem.name;
        const groupid = currentItem.groupid;
        const id = this.conn.getUniqueId();
        const msg = new WebIM.message('txt', id);
        const now = new Date().getTime();
        const newMessage = {
          from: this.myselfId,
          time: now,
          content: val
        };
        const messageIndex = this.loadingMessages.length - 1;
        this.loadingMessages.push(now);
        this.messagesObj[this.talkToSession].push(newMessage);

        const option = {
          msg: val,
          to: name,
          roomType: false,
          success: (id, serverMsgId)=> {
            this.loadingMessages.splice(messageIndex, 1);
            console.log('sendMessage', this.talkToSession, this.messagesObj[this.talkToSession]);
          },
          fail: function(e) {
            this.loadingMessages.splice(messageIndex, 1);
            newMessage.error = true;
            console.log('send error');
          }
        };
        if (groupid) {
          option.to = groupid;
          option.chatType = 'chatRoom';
          msg.set(option);
          msg.setGroup('groupchat');
        } else {
          msg.set(option);
          msg.body.chatType = 'singleChat';
        }
        this.conn.send(msg.body);
      },
      contactClick(e, currentItem) {
        this.talkToSession = currentItem.groupid ? currentItem.groupid : currentItem.name;
        currentItem._hasUnreadMessage = false;
        console.log('contactClick currentItem', currentItem);
        console.log('contactClick talkToSession', this.talkToSession);
        console.log('contactClick messagesObj', this.messagesObj[this.talkToSession]);
        if (currentItem.members) {
          this.getUsers(currentItem.members);
        }
      },
      getFriendPhotoFromMembersInC2C: api.getFriendPhotoFromMembersInC2C,
      getNameFromMembers: api.getNameFromMembers,
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

        const members = [];

        for(let i = 0; i < len; i++) {
          members.push(items[i]._id.split('-').join('_'));
        }
        this.createGroupNew(members);
      },
      createGroupNew(members) {
        const option = {
          data: {
            groupname: this.groupName,
            desc: '',
            members: [],
            public: true,
            approval: true,
            allowinvites: true
          },
          success: (res)=> {
            this.departmentBrowserResult = [];
            this.groupNameDialogVisible = false;
            // this.getGroup();
            const groupid = res.data.groupid;
            this.addGroupMembers(groupid, members);
            const item = {
              groupid: groupid,
              name: this.groupName,
              members: members,
              _hasUnreadMessage: false
            };
            item.members.push(this.myselfId);
            this.$set(this.contactObj, groupid, item);
            this.contactIds.unshift(groupid);
            this.talkToSession = groupid;
            this.messagesObj[groupid] = [];
            this.groupName = '';
          },
          error: ()=> { console.log('createGroupNew error'); }
        };
        this.conn.createGroupNew(option);
      },
      addGroupMembers(groupid, members) {
        const option = {
          list: members,
          roomId: groupid,
          success: (res) => {
            console.log('addGroupMembers', res);
          }
        };
        this.conn.addGroupMembers(option);
      },
      isEmptyObject,
      getRecentContactClass(item, id) {
        const currentItem = this.contactObj[this.talkToSession];
        if (!currentItem) return 'im-main-left-dialog-list-item';
        if (currentItem.groupid) {
          if (currentItem.groupid === item.groupid) {
            return 'im-main-left-dialog-list-item active';
          }
        } else {
          if (currentItem.name === item.name) {
            return 'im-main-left-dialog-list-item active';
          }
        }
        return 'im-main-left-dialog-list-item';
      },
      getGroupMemberAvatarStyle(index, length) {
        let style_config = {};
        if (length < 4) {
          style_config = {
            0: 'top: 0; left: 4px; z-index: 1;',
            1: 'top: 8px; left: 0px; z-index: 2;',
            2: 'top: 8px; left: 8px; z-index: 3;'
          };
        } else {
          style_config = {
            0: 'top: 0; left: 0; z-index: 1;',
            1: 'top: 0; left: 8px; z-index: 2;',
            2: 'top: 8px; left: 0px; z-index: 3;',
            3: 'top: 8px; left: 8px; z-index: 4;'
          };
        }
        return style_config[index];
      },
      isGroup(item) {
        return item.type === api.MESSAGE_TYPE.GROUP;
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
      handleClearUnreadMessage() {
        this.contactObj[this.talkToSession]._hasUnreadMessage = false;
      },
      departmentBrowserConfirm(items) {
        this.departmentBrowserResult = items;
        const len = items.length;
        if(!len) return false;

        if(len === 1) {
          const info = items[0];
          info.nickname = info.name;
          info.name = info._id.split('-').join('_');
          this.messagesObj[info.name] = [];
          info._hasUnreadMessage = false;
          console.log('departmentBrowserConfirm-->', this.messagesObj[info.name]);
          if (this.routers.indexOf(info.name) < 0) {
            this.conn.subscribe({
              to: info.name,
              message: ''
            });
            info.notFriend = true;
          }
          this.contactObj[info.name] = info;
          const index = this.contactIds.indexOf(info.name);
          if (index > -1) {
            this.contactIds.splice(index, 1);
          }
          this.contactIds.unshift(info.name);
          this.users[info.name] = { nickname: info.nickname, avatar: info.photo };
          this.talkToSession = info.name;
        }else if(len > 1) {
          this.groupNameDialogVisible = true;
        }
      }
    }
  }
</script>
