import axios from 'axios';
import bubble from '../higherOrder/bubble/index';

import { merge, isEmptyObject } from '../../common/utils';

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

//解析文本消息元素
function convertTextMsgToHtml(content) {
  return content.getText();
}

//解析表情消息元素
function convertFaceMsgToHtml(content) {
  const index = content.getIndex();
  const data = content.getData();
  const emotion = webim.Emotions[index];
  let url = null;

  if(emotion && emotion[1]){
    url = emotion[1];
  }

  return url ? "<img src='" + url + "'/>" : data;
}

//解析图片消息元素
function convertImageMsgToHtml(content) {
  const smallImage = content.getImage(webim.IMAGE_TYPE.SMALL); //小图
  let bigImage = content.getImage(webim.IMAGE_TYPE.LARGE); //大图
  let oriImage = content.getImage(webim.IMAGE_TYPE.ORIGIN); //原图

  if (!bigImage) {
    bigImage = smallImage;
  }

  if (!oriImage) {
    oriImage = smallImage;
  }

  return `<img src="${smallImage.getUrl()}" style="cursor: hand" id="${content.getImageId()}" bigImgUrl="${bigImage.getUrl()}" onclick="imgClick(this)"/>`;
}

//解析语音消息元素
function convertSoundMsgToHtml(content) {
  const second = content.getSecond();//获取语音时长
  const downUrl = content.getDownUrl();

  if (webim.BROWSER_INFO.type === 'ie' && parseInt(webim.BROWSER_INFO.ver) <= 8) {
    return '[这是一条语音消息]demo暂不支持ie8(含)以下浏览器播放语音,语音URL:' + downUrl;
  }

  return `<audio src="${downUrl}" controls="controls" preload="none"></audio>`;
}

//解析文件消息元素
function convertFileMsgToHtml(content) {
  const fileSize = Math.round(content.getSize() / 1024);
  return `<a href="${content.getDownUrl()}" title="点击下载文件"><i class="glyphicon glyphicon-file">&nbsp;${content.getName}(${fileSize} KB)</i></a>`;
}

//解析位置消息元素
function convertLocationMsgToHtml(content) {
  return `经度=${content.getLongitude()},纬度=${content.getLatitude()},描述=${content.getDesc()}`;
}

//解析自定义消息元素
function convertCustomMsgToHtml(content) {
  return `data="${content.getData()}", desc="${content.getDesc()}", ext="${content.getExt()}"`;
}

//解析群提示消息元素
function convertGroupTipMsgToHtml(content) {
  const WEB_IM_GROUP_TIP_MAX_USER_COUNT = 10;
  const maxIndex = WEB_IM_GROUP_TIP_MAX_USER_COUNT - 1;
  let text ="";
  let opType,opUserId,userIdList;

  opType=content.getOpType();//群提示消息类型（操作类型）
  opUserId=content.getOpUserId();//操作人id

  switch (opType) {
    case webim.GROUP_TIP_TYPE.JOIN://加入群
      userIdList=content.getUserIdList();
      //text += opUserId + "邀请了";
      for (let m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m === maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "加入该群";
      break;
    case webim.GROUP_TIP_TYPE.QUIT://退出群
      text += opUserId + "主动退出该群";
      break;
    case webim.GROUP_TIP_TYPE.KICK://踢出群
      text += opUserId + "将";
      userIdList=content.getUserIdList();
      for (let m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m === maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "踢出该群";
      break;
    case webim.GROUP_TIP_TYPE.SET_ADMIN://设置管理员
      text += opUserId + "将";
      userIdList=content.getUserIdList();
      for (let m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m === maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "设为管理员";
      break;
    case webim.GROUP_TIP_TYPE.CANCEL_ADMIN://取消管理员
      text += opUserId + "取消";
      userIdList=content.getUserIdList();
      for (let m in userIdList) {
        text += userIdList[m] + ",";
        if (userIdList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m === maxIndex) {
          text += "等" + userIdList.length + "人";
          break;
        }
      }
      text += "的管理员资格";
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_GROUP_INFO://群资料变更
      text += opUserId + "修改了群资料：";
      const groupInfoList = content.getGroupInfoList();
      let type,value;

      for (let m in groupInfoList) {
        type = groupInfoList[m].getType();
        value = groupInfoList[m].getValue();

        switch (type) {
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.FACE_URL:
            text += "群头像为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NAME:
            text += "群名称为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.OWNER:
            text += "群主为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.NOTIFICATION:
            text += "群公告为" + value + "; ";
            break;
          case webim.GROUP_TIP_MODIFY_GROUP_INFO_TYPE.INTRODUCTION:
            text += "群简介为" + value + "; ";
            break;
          default:
            text += "未知信息为:type=" + type + ",value=" + value + "; ";
            break;
        }
      }
      break;

    case webim.GROUP_TIP_TYPE.MODIFY_MEMBER_INFO: //群成员资料变更(禁言时间)
      text += opUserId + "修改了群成员资料:";
      const memberInfoList = content.getMemberInfoList();
      let userId,shutupTime;

      for (let m in memberInfoList) {
        userId = memberInfoList[m].getUserId();
        shutupTime = memberInfoList[m].getShutupTime();
        text += userId + ": ";
        if (shutupTime !== null && shutupTime !== undefined) {
          if (shutupTime === 0) {
            text += "取消禁言; ";
          } else {
            text += "禁言" + shutupTime + "秒; ";
          }
        } else {
          text += " shutupTime为空";
        }
        if (memberInfoList.length > WEB_IM_GROUP_TIP_MAX_USER_COUNT && m === maxIndex) {
          text += "等" + memberInfoList.length + "人";
          break;
        }
      }
      break;
    default:
      text += "未知群提示消息类型：type=" + opType;
      break;
  }
  return text;
}

//把消息转换成Html
function convertMsgtoHtml(msg) {
  let html = "", elems, elem, type, content;
  elems = msg.getElems();//获取消息包含的元素数组
  for (let i in elems) {
    elem = elems[i];
    type = elem.getType();//获取元素类型
    content = elem.getContent();//获取元素对象
    switch (type) {
      case webim.MSG_ELEMENT_TYPE.TEXT:
        html += convertTextMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FACE:
        html += convertFaceMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.IMAGE:
        html += convertImageMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.SOUND:
        html += convertSoundMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.FILE:
        html += convertFileMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.LOCATION://暂不支持地理位置
        //html += convertLocationMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.CUSTOM:
        html += convertCustomMsgToHtml(content);
        break;
      case webim.MSG_ELEMENT_TYPE.GROUP_TIP:
        html += convertGroupTipMsgToHtml(content);
        break;
      default:
        webim.Log.error('未知消息元素类型: elemType=' + type);
        break;
    }
  }
  return html;
}

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
  bubble.emit('im_onMsgNotify', newMsgList);
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
    loginInfo.identifierNick = userName;

    webim.login(loginInfo, listeners, options, (resp) => {
        return cb && cb(null, loginInfo);
      }, (err) => {
        return cb && cb(err.ErrorInfo);
      }
    );

  }).catch((err) => {
    return cb && cb(err);
  });

};

api.logout = function logout() {
  if (loginInfo.identifier) {
    webim.logout(() => {
      loginInfo.identifier = null;
      loginInfo.userSig = null;
    });
  } else {
    alert('未登录');
  }
};

//webim.GROUP_MSG_SUB_TYPE.COMMON-普通消息,
//webim.GROUP_MSG_SUB_TYPE.LOVEMSG-点赞消息，优先级最低
//webim.GROUP_MSG_SUB_TYPE.TIP-提示消息(不支持发送，用于区分群消息子类型)，
//webim.GROUP_MSG_SUB_TYPE.REDPACKET-红包消息，优先级最高
/**
 * 发送消息
 * @param sessionInfo 会话信息
 * @param content 信息内容
 * @param cb
 */
api.sendMessage = function(contactInfo, content, cb) {
  if (isEmptyObject(contactInfo)) {
    return cb && cb('你还没有选中好友或者群组，暂不能聊天');
  }

  const info = {
    toId: contactInfo.To_Account,
    toName: '',
    friendHeadUrl: ''
  };

  //获取消息内容
  const msgLen = webim.Tool.getStrBytes(content);

  if (content.length < 1) {
    return cb && cb('发送的消息不能为空');
  }

  let maxLen = 0;
  let err = '';
  let selType = '';
  let subType = '';

  if(contactInfo.Type === webim.RECENT_CONTACT_TYPE.C2C) {
    info.toName = contactInfo.C2cNick;
    info.friendHeadUrl = contactInfo.C2cImage;

    selType = webim.SESSION_TYPE.C2C;
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    maxLen = webim.MSG_MAX_LENGTH.C2C;
    err = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
  }else {
    info.toName = contactInfo.GroupNick;
    info.friendHeadUrl = contactInfo.GroupImage;

    selType = webim.SESSION_TYPE.GROUP;
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    err = "消息长度超出限制(最多" + Math.round(maxLen / 3) + "汉字)";
  }

  if (msgLen > maxLen) {
    return cb && cb(err);
  }

  const msgTime = Math.round(new Date().getTime() / 1000);
  const random = Math.round(Math.random() * 4294967296);//消息随机数，用于去重
  const seq = -1;//消息序列，-1表示sdk自动生成，用于去重
  const isSend = true;//是否为自己发送

  let selSess = webim.MsgStore.sessByTypeId(selType, info.toId);

  if (!selSess) {
    console.log('1', selType);
    selSess = new webim.Session(selType, info.toId, info.toName, info.friendHeadUrl, Math.round(new Date().getTime() / 1000), seq);
  }


  const msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

  let text_obj, face_obj, tmsg, emotionIndex, emotion, restMsgIndex;
  //解析文本和表情
  const expr = /\[[^[\]]{1,3}\]/mg;
  const emotions = content.match(expr);

  if (!emotions || emotions.length < 1) {
    text_obj = new webim.Msg.Elem.Text(content);
    msg.addText(text_obj);
  } else {

    for (let i = 0; i < emotions.length; i++) {
      tmsg = content.substring(0, content.indexOf(emotions[i]));

      if (tmsg) {
        text_obj = new webim.Msg.Elem.Text(tmsg);
        msg.addText(text_obj);
      }

      emotionIndex = webim.EmotionDataIndexs[emotions[i]];
      emotion = webim.Emotions[emotionIndex];

      if (emotion) {
        face_obj = new webim.Msg.Elem.Face(emotionIndex, emotions[i]);
        msg.addFace(face_obj);
      } else {
        text_obj = new webim.Msg.Elem.Text(emotions[i]);
        msg.addText(text_obj);
      }

      restMsgIndex = content.indexOf(emotions[i]) + emotions[i].length;
      content = content.substring(restMsgIndex);
    }

    if (content) {
      text_obj = new webim.Msg.Elem.Text(content);
      msg.addText(text_obj);
    }
  }

  webim.sendMsg(msg, () => {
    return cb && cb(null, msg);
  }, (err) => {
    return cb && cb(err);
  });
};

//获取最近的会话
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

//设置个人资料
api.setProfile = function setProfilePortrait(profile, cb) {
  const GENDER = {
    unknow: 'Gender_Type_Unknown',
    female: 'Gender_Type_Female',
    male: 'Gender_Type_Male',
  };

  const ALLOW_TYPE = {
    needConfirm: 'AllowType_Type_NeedConfirm', // 需要经过自己确认才能添加自己为好友
    allowAny: 'AllowType_Type_AllowAny', // 允许任何人添加自己为好友
    denyAny: 'AllowType_Type_DenyAny', // 不允许任何人添加自己为好友
  };

  const p = {
    nickName: profile.nickName, //昵称 长度不得超过500个字节
    gender: GENDER[profile.gender] || GENDER['unknow'],
    allowType: ALLOW_TYPE[profile.allowType] || ALLOW_TYPE.needConfirm, //加好友验证方式
    avatar: profile.avatar || '', // 头像URL
    sign: profile.sign || '', // 个性签名
  };

  const profile_item = [
    {
      "Tag": "Tag_Profile_IM_Nick",
      "Value": p.nickName
    },
    {
      "Tag": "Tag_Profile_IM_Gender",
      "Value": p.gender
    },
    {
      "Tag": "Tag_Profile_IM_AllowType",
      "Value": p.allowType
    },
    {
      "Tag": "Tag_Profile_IM_Image",
      "Value": p.avatar
    },
    {
      "Tag": "Tag_Profile_IM_SelfSignature",
      "Value": p.sign
    }
  ];

  webim.setProfilePortrait({ 'ProfileItem': profile_item}, () => {
    return cb && cb(null, 'ok');
  }, (err) => {
    return cb && cb(err);
  });
};

/**
 * 创建群组
 * https://cloud.tencent.com/document/product/269/1502
 * 私有群（Private）：适用于较为私密的聊天场景，群组资料不公开，只能通过邀请的方式加入，类似于微信群。
 * 公开群（Public）：适用于公开群组，具有较为严格的管理机制、准入机制，类似于QQ群。
 * 聊天室（ChatRoom）：群成员可以随意进出，组织较为松散。
 * 互动直播聊天室（AVChatRoom）：适用于互动直播场景，管理上与聊天室相似，但群成员人数无上限；支持以游客身份（不登录）接收消息。
 * 在线成员广播大群（BChatRoom）：适用于需要向全体在线用户推送消息的场景。
 * @param info
 * @param cb
 * @returns {*}
 */
api.createGroup = function createGroup(info, cb) {
  const groupInfo = merge({
    'GroupId': '',
    'Owner_Account': loginInfo.identifier,
    'Type': 'Private',
    'Name': '',
    'FaceUrl': '',
    'Notification': '',
    'Introduction': '',
    'MemberList': [],
    'ApplyJoinOption': 'FreeAccess' //DisableApply表示禁止任何人申请加入；NeedPermission表示需要群主或管理员审批；FreeAccess表示允许无需审批自由加入群组。
  }, info);

  if (!groupInfo.Name) {
    return cb && cb('请输入群组名称');
  }

  if (webim.Tool.getStrBytes(groupInfo.Name) > 30) {
    return cb && cb('您输入的群组名称超出限制(最长10个汉字)');
  }

  if (webim.Tool.getStrBytes(groupInfo.Notification) > 150) {
    return cb && cb('您输入的群组公告超出限制(最长50个汉字)');
  }

  if (webim.Tool.getStrBytes(groupInfo.Introduction) > 120) {
    return cb && cb('您输入的群组简介超出限制(最长40个汉字)');
  }

  webim.createGroup(groupInfo, () => {
      return cb && cb(null, '创建群成功');
      //读取我的群组列表
      // getJoinedGroupListHigh(getGroupsCallbackOK);
    }, (err) => {
      return cb && cb(err.ErrorInfo);
    }
  );
};

//获取我的群组
api.getMyGroup = function getMyGroup(parmas, cb) {

  const options = merge({
    'Limit': totalCount,
    'Offset': 0,
    //'GroupType':'',
  }, params);

  options.Member_Account = loginInfo.identifier;
  options.GroupBaseInfoFilter = [
    'Type', 'Name', 'Introduction', 'Notification', 'FaceUrl',
    'CreateTime', 'Owner_Account', 'LastInfoTime', 'LastMsgTime',
    'NextMsgSeq', 'MemberNum', 'MaxMemberNum', 'ApplyJoinOption', 'ShutUpAllMember'
  ];
  options.SelfInfoFilter = ['Role', 'JoinTime', 'MsgFlag', 'UnreadMsgNum'];

  webim.getJoinedGroupListHigh(options, (resp) => {
    if (!resp.GroupIdList || resp.GroupIdList.length == 0) {
      alert('你目前还没有加入任何群组');
      return;
    }
    var data = [];
    for (var i = 0; i < resp.GroupIdList.length; i++) {
      var group_id = resp.GroupIdList[i].GroupId;
      var name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
      var type_en = resp.GroupIdList[i].Type;
      var type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
      var role_en = resp.GroupIdList[i].SelfInfo.Role;
      var role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
      var msg_flag = webim.Tool.groupMsgFlagEn2Ch(
        resp.GroupIdList[i].SelfInfo.MsgFlag);
      var msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
      var join_time = webim.Tool.formatTimeStamp(
        resp.GroupIdList[i].SelfInfo.JoinTime);
      var member_num = resp.GroupIdList[i].MemberNum;
      var notification = webim.Tool.formatText2Html(
        resp.GroupIdList[i].Notification);
      var introduction = webim.Tool.formatText2Html(
        resp.GroupIdList[i].Introduction);
      var ShutUpAllMember = resp.GroupIdList[i].ShutUpAllMember;
      data.push({
        'GroupId': group_id,
        'Name': name,
        'TypeEn': type_en,
        'Type': type,
        'RoleEn': role_en,
        'Role': role,
        'MsgFlagEn': msg_flag_en,
        'MsgFlag': msg_flag,
        'MemberNum': member_num,
        'Notification': notification,
        'Introduction': introduction,
        'JoinTime': join_time,
        'ShutUpAllMember': ShutUpAllMember
      });
    }
    //打开我的群组列表对话框
    $('#get_my_group_table').bootstrapTable('load', data);
    $('#get_my_group_dialog').modal('show');
  }, (err) => {
    alert(err.ErrorInfo);
  });
};

//读取群组基本资料-高级接口
api.getGroupInfo = function getGroupInfo(id, cb) {
  const options = {
    'GroupIdList': [ id ],
    'GroupBaseInfoFilter': [
      'Type',
      'Name',
      'Introduction',
      'Notification',
      'FaceUrl',
      'CreateTime',
      'Owner_Account',
      'LastInfoTime',
      'LastMsgTime',
      'NextMsgSeq',
      'MemberNum',
      'MaxMemberNum',
      'ApplyJoinOption'
    ],
    'MemberInfoFilter': [
      'Account',
      'Role',
      'JoinTime',
      'LastSendMsgTime',
      'ShutUpUntil'
    ]
  };

  webim.getGroupInfo(options, (resp) => {
    return cb && cb(null, resp);
  }, (err) => {
    return cb && cb(err.ErrorInfo);
  });
};

const getC2CHistoryMessage = function getC2CHistoryMessage(toId, cb) {
  //获取最新的c2c历史消息,用于切换好友聊天，重新拉取好友的聊天消息
  if(!toId) {
    return cb && cb('请输入好友Id, 以便获取历史消息.');
  }

  const lastMsgTime = 0; // 第一次拉取好友历史消息时，必须传0
  const msgKey = '';
  const options = {
    'Peer_Account': toId, //好友帐号
    'MaxCnt': reqMsgCount, //拉取消息条数
    'LastMsgTime': lastMsgTime, //最近的消息时间，即从这个时间点向前拉取历史消息
    'MsgKey': msgKey
  };

  webim.getC2CHistoryMsgs(options, (resp) => {
    const complete = resp.Complete;//是否还有历史消息可以拉取，1-表示没有，0-表示有
    const retMsgCount = resp.MsgCount; //返回的消息条数，小于或等于请求的消息条数，小于的时候，说明没有历史消息可拉取了
    const messages = resp.MsgList;

    if (messages.length === 0) {
      return cb && cb(null, messages);
    }

    getPrePageC2CHistroyMsgInfoMap[selToID] = {//保留服务器返回的最近消息时间和消息Key,用于下次向前拉取历史消息
      'LastMsgTime': resp.LastMsgTime,
      'MsgKey': resp.MsgKey
    };

    return cb && cb(null, messages);

  }, (err) => {
      return cb && cb(err);
  });
};

const getGroupHistoryMessage = function getGroupHistoryMessage(toId, cb) {
  //获取最新的群历史消息,用于切换群组聊天时，重新拉取群组的聊天消息
  if(!toId) {
    return cb && cb('请输入群组的Id, 以便获取群历史消息.');
  }

  api.getGroupInfo(toId, function (err, resp) {
    if(err) {
      return cb && cb(err);
    }

    //拉取最新的群历史消息
    const options = {
      'GroupId': toId,
      'ReqMsgSeq': resp.GroupInfo[0].NextMsgSeq - 1,
      'ReqMsgNumber': reqMsgCount
    };

    if (options.ReqMsgSeq === null || options.ReqMsgSeq === undefined || options.ReqMsgSeq <= 0) {
      return cb && cb(null, []); //该群还没有历史消息
    }

    webim.syncGroupMsgs(options, (msgList) => {
      if (msgList.length === 0) {
        return cb && cb(null, msgList); //该群没有历史消息了
      }

      getPrePageGroupHistroyMsgInfoMap[selToID] = {
        "ReqMsgSeq": msgList[msgList.length - 1].MsgSeq - 1
      };

      return cb && cb(null, msgList);

    }, (err) => {
      return cb && cb(err.ErrorInfo);
    });
  });
};

api.isGroup = function(t, type = webim.RECENT_CONTACT_TYPE.GROUP) {
  let isGroup = false;

  if(t === type) {
    isGroup = true;
  }

  return isGroup;
};

api.getAvatar = function(contactInfo) {
  let headUrl = '';

  if(api.isGroup(contactInfo.Type)) {
    headUrl = contactInfo.GroupImage;
  }else {
    headUrl = contactInfo.C2cImage;
  }

  return headUrl;
};

api.getHistoryMessage = function getHistoryMessage(toId, isGroup, cb) {
  if(isGroup) {
    getGroupHistoryMessage(toId, cb);
  }else {
    getC2CHistoryMessage(toId, cb);
  }
};

api.convertMsgToHtml = function(msg) {
  return convertMsgtoHtml(msg);
};

api.on = bubble.on;
api.off = bubble.off;

module.exports = api;
