import axios from 'axios';

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
    // Do something before request is sent
    if (config.method === 'get') {
      config.params = config.params || {};
      config.params.t = new Date().getTime();
    } else if (config.method === 'post') {
      config.data = config.data || {};
      config.data.t = new Date().getTime();
    }

    return config;
  }, error =>
    // Do something with request error
    Promise.reject(error)
);

const api = {};

//腾讯云通讯接口

//帐号模式，0-表示独立模式，1-表示托管模式
const accountMode = 0;

//官方 demo appid,需要开发者自己修改（托管模式）
const sdkAppID = 1400047308;
const accountType = 18694;

const AdminAcount = 'xuyawen';
const selType = webim.SESSION_TYPE.C2C; //当前聊天类型
const selToID = null; //当前选中聊天id（当聊天类型为私聊时，该值为好友帐号，否则为群号）
const selSess = null; //当前聊天会话对象
const recentSessMap = {}; //保存最近会话列表
const reqRecentSessCount = 50; //每次请求的最近会话条数，业务可以自定义

//默认好友头像
const friendHeadUrl = 'img/friend.jpg'; //仅demo使用，用于没有设置过头像的好友
//默认群头像
const groupHeadUrl = 'img/group.jpg'; //仅demo使用，用于没有设置过群头像的情况

//存放c2c或者群信息（c2c用户：c2c用户id，昵称，头像；群：群id，群名称，群头像）
const infoMap = {}; //初始化时，可以先拉取我的好友和我的群组信息
const maxNameLen = 12; //我的好友或群组列表中名称显示最大长度，仅demo用得到
const reqMsgCount = 15; //每次请求的历史消息(c2c获取群)条数，仅demo用得到
const pageSize = 15; //表格的每页条数，bootstrap table 分页时用到
const totalCount = 200; //每次接口请求的条数，bootstrap table 分页时用到
const emotionFlag = false; //是否打开过表情选择框
const curPlayAudio = null; //当前正在播放的audio对象
const getPrePageC2CHistroyMsgInfoMap = {}; //保留下一次拉取好友历史消息的信息
const getPrePageGroupHistroyMsgInfoMap = {}; //保留下一次拉取群历史消息的信息
const defaultSelGroupId = null; //登录默认选中的群id，选填，仅demo用得到

//监听（多终端同步）群系统消息方法，方法都定义在receive_group_system_msg.js文件中
//注意每个数字代表的含义，比如，
//1表示监听申请加群消息，2表示监听申请加群被同意消息，3表示监听申请加群被拒绝消息
const onGroupSystemNotifys = {
  "1": onApplyJoinGroupRequestNotify, //申请加群请求（只有管理员会收到）
  "2": onApplyJoinGroupAcceptNotify, //申请加群被同意（只有申请人能够收到）
  "3": onApplyJoinGroupRefuseNotify, //申请加群被拒绝（只有申请人能够收到）
  "4": onKickedGroupNotify, //被管理员踢出群(只有被踢者接收到)
  "5": onDestoryGroupNotify, //群被解散(全员接收)
  "6": onCreateGroupNotify, //创建群(创建者接收)
  "7": onInvitedJoinGroupNotify, //邀请加群(被邀请者接收)
  "8": onQuitGroupNotify, //主动退群(主动退出者接收)
  "9": onSetedGroupAdminNotify, //设置管理员(被设置者接收)
  "10": onCanceledGroupAdminNotify, //取消管理员(被取消者接收)
  "11": onRevokeGroupNotify, //群已被回收(全员接收)
  "15": onReadedSyncGroupNotify, //群消息已读同步通知
  "255": onCustomGroupNotify, //用户自定义通知(默认全员接收)
  "12":onInvitedJoinGroupNotifyRequest//邀请加群(被邀请者接收,接收者需要同意)
};

//监听好友系统通知函数对象，方法都定义在receive_friend_system_msg.js文件中
const onFriendSystemNotifys = {
  "1": onFriendAddNotify, //好友表增加
  "2": onFriendDeleteNotify, //好友表删除
  "3": onPendencyAddNotify, //未决增加
  "4": onPendencyDeleteNotify, //未决删除
  "5": onBlackListAddNotify, //黑名单增加
  "6": onBlackListDeleteNotify //黑名单删除
};

const onC2cEventNotifys = {
  "92": onMsgReadedNotify, //消息已读通知,
  "96" : onMultipleDeviceKickedOut
};

//监听资料系统通知函数对象，方法都定义在receive_profile_system_msg.js文件中
const onProfileSystemNotifys = {
  "1": onProfileModifyNotify //资料修改
};

//监听连接状态回调变化事件
const onConnNotify = function(resp) {
  let info = null;
  switch (resp.ErrorCode) {
    case webim.CONNECTION_STATUS.ON:
      webim.Log.warn('建立连接成功: ' + resp.ErrorInfo);
      break;
    case webim.CONNECTION_STATUS.OFF:
      info = '连接已断开，无法收到新消息，请检查下你的网络是否正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    case webim.CONNECTION_STATUS.RECONNECT:
      info = '连接状态恢复正常: ' + resp.ErrorInfo;
      // alert(info);
      webim.Log.warn(info);
      break;
    default:
      webim.Log.error('未知连接状态: =' + resp.ErrorInfo);
      break;
  }
};

//IE9(含)以下浏览器用到的jsonp回调函数
const jsonpCallback = function(rspData) {
  webim.setJsonpLastRspData(rspData);
}
//监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
const onMsgNotify = function(newMsgList) {
  console.warn('newMsgList ==>', newMsgList);
};
const onBigGroupMsgNotify = function() {};
const onGroupInfoChangeNotify = function() {};
const onKickedEventCall = function() {};
const onAppliedDownloadUrl = function() {};
const onFriendAddNotify = function() {};
const onFriendDeleteNotify = function() {};
const onPendencyAddNotify = function() {};
const onBlackListAddNotify = function() {};
const onPendencyDeleteNotify = function() {};
const onBlackListDeleteNotify = function() {};
const onMsgReadedNotify = function() {};
const onMultipleDeviceKickedOut = function() {};

const onApplyJoinGroupRequestNotify = function() {};
const onApplyJoinGroupAcceptNotify = function() {};
const onApplyJoinGroupRefuseNotify = function() {};
const onKickedGroupNotify = function() {};
const onDestoryGroupNotify = function() {};
const onCreateGroupNotify = function() {};
const onInvitedJoinGroupNotify = function() {};
const onQuitGroupNotify = function() {};
const onSetedGroupAdminNotify = function() {};
const onCanceledGroupAdminNotify = function() {};
const onRevokeGroupNotify = function() {};
const onReadedSyncGroupNotify = function() {};
const onCustomGroupNotify = function() {};
const onInvitedJoinGroupNotifyRequest = function() {};

const onProfileModifyNotify = function() {};

//监听事件
const listeners = {
  "onConnNotify": onConnNotify, //监听连接状态回调变化事件,必填
  "jsonpCallback": jsonpCallback, //IE9(含)以下浏览器用到的jsonp回调函数，
  "onMsgNotify": onMsgNotify, //监听新消息(私聊，普通群(非直播聊天室)消息，全员推送消息)事件，必填
  "onBigGroupMsgNotify": onBigGroupMsgNotify, //监听新消息(直播聊天室)事件，直播场景下必填
  "onGroupSystemNotifys": onGroupSystemNotifys, //监听（多终端同步）群系统消息事件，如果不需要监听，可不填
  "onGroupInfoChangeNotify": onGroupInfoChangeNotify, //监听群资料变化事件，选填
  "onFriendSystemNotifys": onFriendSystemNotifys, //监听好友系统通知事件，选填
  "onProfileSystemNotifys": onProfileSystemNotifys, //监听资料系统（自己或好友）通知事件，选填
  "onKickedEventCall": onKickedEventCall, //被其他登录实例踢下线
  "onC2cEventNotifys": onC2cEventNotifys, //监听C2C系统消息通道
  "onAppliedDownloadUrl": onAppliedDownloadUrl //申请文件/音频下载地址的回调
};

//初始化时，其他对象，选填
const options = {
  'isAccessFormalEnv': true, //是否访问正式环境，默认访问正式，选填
  'isLogOn': false //是否开启控制台打印日志,默认开启，选填
};

// const msgflow = document.getElementsByClassName("msgflow")[0];
// const bindScrollHistoryEvent = {
//   init: function() {
//     msgflow.onscroll = function() {
//       if (msgflow.scrollTop == 0) {
//         msgflow.scrollTop = 10;
//         if (selType == webim.SESSION_TYPE.C2C) {
//           getPrePageC2CHistoryMsgs();
//         } else {
//           getPrePageGroupHistoryMsgs();
//         }
//
//       }
//     }
//   },
//   reset: function() {
//     msgflow.onscroll = null;
//   }
// };

api.timaccounts = function (data) {
  return new Promise((resolve, reject) => {
    axios.post('http://182.61.30.36/api/timaccounts', data).then((response) => {
      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        return resolve(res);
      }
      return reject(res.statusInfo.message);
    }).catch((error) => {
      reject(error);
    });
  });
};

//当前用户身份
const loginInfo = {
  sdkAppID: sdkAppID, //用户所属应用id,必填
  identifier: '', //当前用户ID,必须是否字符串类型，必填
  accountType: accountType, //用户所属应用帐号类型，必填
  userSig: '', //当前用户身份凭证，必须是字符串类型，必填
  identifierNick: null, //当前用户昵称，不用填写，登录接口会返回用户的昵称，如果没有设置，则返回用户的id
  headurl: 'img/me.jpg' //当前用户默认头像，选填，如果设置过头像，则可以通过拉取个人资料接口来得到头像信息
};

api.login = function(userId, userName, headurl, cb) {

  api.timaccounts({
    username: userId,
    displayname: userName
  }).then((res) => {

    const data = res.data;

    loginInfo.identifier = userId;
    loginInfo.userSig = data.usersig;
    loginInfo.headurl = headurl;

    webim.login(loginInfo, listeners, options, (resp) => {
        loginInfo.identifierNick = resp.identifierNick; //设置当前用户昵称
        return cb && cb(null, loginInfo);
      }, (err) => {
        return cb && cb(err.ErrorInfo);
      }
    );

  }).catch((err) => {
    return cb && cb(err);
  });

};

api.sendMessage = function(toId, toName, friendHeadUrl, content, cb) {
  const msgTime = Math.round(new Date().getTime() / 1000);
  const random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
  const seq = -1;//消息序列，-1表示sdk自动生成，用于去重
  const isSend = true;//是否为自己发送

  const selType = webim.SESSION_TYPE.C2C; //定认为私聊
  let selSess = webim.MsgStore.sessByTypeId(selType, toId);

  if (!selSess) {
    selSess = new webim.Session(selType, toId, toName, friendHeadUrl, Math.round(new Date().getTime() / 1000), seq);
  }
  const msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, webim.C2C_MSG_SUB_TYPE.COMMON, loginInfo.identifierNick);

  msg.addText(new webim.Msg.Elem.Text(content));
  webim.sendMsg(msg, () => {
    return cb && cb(null, 'ok');
  }, (err) => {
    return cb && cb(err);
  });
};

api.getRecentContactList = function(cb) {
  webim.getRecentContactList({
    'Count': 50 //最近的会话数 ,最大为100, 50个为最大免费上限
  }, (resp) => {
    return cb && cb(null, resp);
    //业务处理
  }, (resp) => {
    //错误回调
    return cb && cb(resp);
  });
};


module.exports = api;
