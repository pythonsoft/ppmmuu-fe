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
          <conversation-browser
            :loading-contacts="loadingContacts"
            :myself-info="myselfInfo"
            :talk-to-session="talkToSession"
            :contact-ids="contactIds"
            :contact-obj="contactObj"
            :users="users"
            @contact-click="contactClick"
            @display-menu="displayMenu"></conversation-browser>
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
            @update-group-name="changeGroupSubject"
            @show-department-browser="()=>{departmentBrowserVisible = true;departmentDialogOperation = 'edit';}"
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
  import { getItemFromLocalStorage, isEmptyObject, loadScript } from '../../common/utils';
  import DepartmentBrowser from "../higherOrder/departmentBrowser";
  import MessageBrowser from "./component/messageBrowser";
  import ConversationBrowser from "./component/conversationBrowser";

  const userAPI = require('../../api/user');

  export default {
    components: {
      MessageBrowser,
      DepartmentBrowser,
      ConversationBrowser
    },
    name: 'im',
    data() {
      return {
        loadingContacts: 0,
        message: '',
        departmentBrowserVisible: false,
        dialogVisible: false,
        myselfInfo: {}, // 当前登录用户信息
        myselfId: '',
        talkToSession: '', // 当前聊天对象信息的索引值，对应contactObj的key
        departmentDialogOperation: 'new',
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
        canNotify: false
      }
    },
    watch: {
      departmentBrowserVisible(val) {
        if (!val) this.departmentDialogOperation = 'new';
      },
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
      if (window.Notification) {
        if (Notification.permission !== 'granted') {
          Notification.requestPermission((status)=> {
            if (status === 'granted') this.canNotify = true;
          });
        } else {
          this.canNotify = true;
        }
      }
      this.myselfInfo = getItemFromLocalStorage('userInfo');
      this.myselfId = this.myselfInfo._id.replace(/-/g, '_');
      this.users[this.myselfId] = {
        nickname: this.myselfInfo.name,
        avatar: this.myselfInfo.photo
      };

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
            this.onTextMessage(message);
          },
          onInviteMessage: (message) => {
            console.log('onInviteMessage', message);
            const roomid = message.roomid;
            if (roomid) {
              let item = {};
              this.listGroupMember(roomid).then((result)=> {
                const { members, owner } = result;
                item.members = members;
                item.owner = owner;
                const len = members.length > 4 ? 4 : members.length;
                this.getUsers(members.slice(0, len));
                this.getGroupName(roomid);

                item.groupid = roomid;
                item._hasUnreadMessage = false;
                const oldItem = this.contactObj[roomid];
                if (oldItem && this.messagesObj[roomid]) {
                  item = Object.assign(item, oldItem); // 在onTextMessage先初始化了
                } else {
                  this.messagesObj[roomid] = [];
                }
                this.$set(this.contactObj, roomid, item);
                // console.log('onInviteMessage this.messagesObj[roomid]', roomid, this.messagesObj[roomid]);
                this.contactIds.unshift(roomid);
                // console.log('onInviteMessage this.contactIds', this.contactIds);
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
      onTextMessage(message) {
        const contactObj = this.contactObj;
        const msg = {
          time: new Date().getTime(),
          content: message.data
        };
        let flag = false; // 判断这个人是否已经在列表中
        let isGroupMsg = message.type === 'groupchat';
        let key = isGroupMsg ? message.to : message.from;
        if (!this.messagesObj[key]) this.messagesObj[key] = [];
        let newArray = this.messagesObj[key].slice();
        let tempItem = {};
        let notification = null;
        if (this.contactIds.indexOf(key) > -1) {
          flag = true;
          tempItem = contactObj[key];
          tempItem._hasUnreadMessage = true;
          const index = this.contactIds.indexOf(key);
          this.contactIds.splice(index, 1);
          let name = isGroupMsg ? this.contactObj[key].name : this.contactObj[key].nickname;
          let content = isGroupMsg ? `${this.users[message.from].nickname}: ${message.data}` : message.data;
          if (this.canNotify) {
            notification = new Notification(name, { body: content });
          }
          this.contactIds.unshift(key);
          // console.log('onTextMessage flag=false this.contactIds', this.contactIds);
        }
        if (!flag) {
          tempItem = {
            _hasUnreadMessage: true
          };
          if (isGroupMsg) {
            this.getGroupName(key, (groupName) => {
              this.getUsers([message.from], () => {
                if (this.canNotify) {
                  notification = new Notification(groupName, { body: `${this.users[message.from].nickname}: ${message.data}` });
                }
              });
            });
          } else {
            tempItem.name = key;
            this.getUsers([key], () => {
              if (this.canNotify) {
                notification = new Notification(this.contactObj[key].nickname, { body: message.data, icon: this.contactObj[key].avatar });
              }
            });
            this.contactIds.unshift(key);
            // console.log('onTextMessage flag=true this.contactIds', this.contactIds);
          }
        }
        newArray.push(Object.assign({}, message, msg));
        this.$set(this.contactObj, key, tempItem);
        this.messagesObj = Object.assign({}, this.messagesObj, { [key]: newArray });
        // console.log('onTextMessage this.contactObj', key, this.contactObj[key]);
        // console.log('onTextMessage this.messagesObj', key, this.messagesObj[key]);
      },
      getRoster() {
        this.conn.getRoster({
          success: (roster)=> {
            // console.log('roster', roster);
            const tempObj = {};
            const tempRouters = [];
            roster.forEach((item)=> {
              if (item.subscription === 'both' || item.subscription === 'to') {
                const oldItem = this.contactObj[item.name];
                if (oldItem && this.messagesObj[item.name]) {
                  item = Object.assign(item, oldItem); // 在onTextMessage先初始化了
                } else {
                  // 初始化
                  this.contactIds.push(item.name);
                  // console.log('getRoster this.contactIds', this.contactIds);
                  this.messagesObj[item.name] = [];
                  item._hasUnreadMessage = false;
                }
                tempObj[item.name] = item;
                tempRouters.push(item.name);
              }
            });
            this.routers = tempRouters;
            Object.assign(this.contactObj, tempObj);
            this.loadingContacts += 1;
            this.getUsers(this.routers);
          }
        });
      },
      getGroup() {
        this.conn.getGroup({
          success: (res)=> {
            const group = res.data;
            // console.log('group', group);

            const tempObj = {};
            let tempUsers = [];
            const loop = (index)=> {
              let item = group[index];
              if(!item) {
                this.contactObj = Object.assign({}, this.contactObj, tempObj);
                this.getUsers(tempUsers);
                this.loadingContacts += 1;
                return false;
              }

              this.listGroupMember(item.groupid).then((result)=> {
                const { members, owner } = result;
                item.members = members;
                item.owner = owner;
                const len = members.length > 4 ? 4 : members.length;
                tempUsers = tempUsers.concat(members.slice(0, len));

                item.name = item.groupname;

                const oldItem = this.contactObj[item.groupid];
                if (this.messagesObj[item.groupid]) {
                  // console.log('getgroup, already have message');
                  item = Object.assign(item, oldItem);
                } else {
                  this.contactIds.push(item.groupid);
                  // console.log('getGroup this.contactIds', this.contactIds);
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
      getGroupName(groupid, cb) {
        this.conn.getGroup({
          success: (res)=> {
            const groups = res.data;
            for (let i = 0, len = groups.length; i < len; i++) {
              if (groups[i].groupid === groupid) {
                this.contactObj[groupid] = Object.assign({}, this.contactObj[groupid], { name: groups[i].groupname });
                cb & cb(groups[i].groupname);
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
              let owner = '';
              const members = res.data.map(item => {
                if (item.owner) owner = item.owner;
                return item.member || item.owner;
              });
              resolve({members, owner});
            },
            error: (e) => reject(e)
          };
          this.conn.listGroupMember(option);
        });
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
            const groupid = res.data.groupid;
            this.addGroupMembers(groupid, members);
            const item = {
              groupid: groupid,
              name: this.groupName,
              owner: this.myselfId,
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
      addGroupMembers(groupid, members, cb = ()=>{}) {
        const option = {
          list: members,
          roomId: groupid,
          success: (res) => {
            cb();
            console.log('addGroupMembers', res);
          }
        };
        this.conn.addGroupMembers(option);
      },
      changeGroupSubject(name) {
        const option = {
          roomId: this.talkToSession,
          subject: name,
          success: () => {
            console.log('change success');
            this.contactObj[this.talkToSession].name = name;
          }
        };
        this.conn.changeGroupSubject(option);
      },
      getUsers(ids, cb) {
        const reqIds = [];
        const keys = Object.keys(this.users);
        // 排除已经获取过的用户
        for (let i = 0, len = ids.length; i < len; i++) {
          const id = ids[i];
          if (keys.indexOf(id) < 0) reqIds.push(id);
        }
        if (reqIds.length === 0) {
          cb && cb();
          return;
        }
        userAPI.getUsers({ params: { _ids: reqIds.join(',') } }, this)
          .then((res)=>{
            const data = res.data;
            const tempObj = {};
            const keys = Object.keys(data);

            keys.forEach(key => {
              const id = key.replace(/-/g, '_');
              const item = data[key];
              tempObj[id] = { nickname: item.name, avatar: item.photo };

              if (this.contactObj[id]) {
                Object.assign(this.contactObj[id], tempObj[id]);
              }
              if (!this.users[id]) {
                this.users[id] = tempObj[id];
              }
            });
            cb && cb();
          })
          .catch((error)=>{
            // this.$message.error(error);
          })
      },
      contactClick(e, currentItem) {
        this.talkToSession = currentItem.groupid ? currentItem.groupid : currentItem.name;
        currentItem._hasUnreadMessage = false;
        if (currentItem.members) {
          this.getUsers(currentItem.members);
        }
      },
      isEmptyObject,
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

        if (this.departmentDialogOperation === 'edit') {
          const groupid = this.talkToSession;
          const members = items.map(item => {
            return item._id.replace(/-/g, '_');
          });
          console.log('groupid, members', groupid, members);
          this.addGroupMembers(groupid, members, ()=> {
            this.listGroupMember(groupid).then((result)=> {
              const { members, owner } = result;
              const len = members.length > 4 ? 4 : members.length;
              this.getUsers(members.slice(0, len));
              this.contactObj[groupid] = Object.assign({}, this.contactObj[groupid], { members: members, owner: owner });
            });
          });
          return;
        }
        if(len === 1) {
          const info = items[0];
          info.nickname = info.name;
          info.name = info._id.replace(/-/g, '_');
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
      },
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
          members.push(items[i]._id.replace(/-/g, '_'));
        }
        this.createGroupNew(members);
      }
    }
  }
</script>
