import bubble from '../higherOrder/bubble/index';
import { merge, isEmptyObject } from '../../common/utils';
import io from 'socket.io-client';

const global = require('../../global');

const api = {};

const chat = io(`ws://${global.baseDomain}/chat`, {
  transports: ['websocket']
});

chat.on('connect', () => {
  console.log('a user connected');

  chat.on('login', (rs) => {
    console.log('rs ===>', rs);
  });

  chat.on('getRecentContactList', (rs) => {
    console.log('getRecentContactList ---', rs);
  });

  chat.on('test', (rs) => {
    console.log('test rs ====>', rs);
  });

  api.getRecentContactList();
});

/**
 * 发送消息
 * @param sessionInfo 会话信息
 * @param content 信息内容
 * @param cb
 */
api.sendMessage = function (contactInfo, content, cb) {
  if (isEmptyObject(contactInfo)) {
    return cb && cb('你还没有选中好友或者群组，暂不能聊天');
  }

  const info = {
    toId: contactInfo.To_Account,
    toName: '',
    friendHeadUrl: ''
  };

  // 获取消息内容
  const msgLen = webim.Tool.getStrBytes(content);

  if (content.length < 1) {
    return cb && cb('发送的消息不能为空');
  }

  let maxLen = 0;
  let err = '';
  let selType = '';
  let subType = '';

  if (contactInfo.Type === webim.RECENT_CONTACT_TYPE.C2C) {
    info.toName = contactInfo.C2cNick;
    info.friendHeadUrl = contactInfo.C2cImage;

    selType = webim.SESSION_TYPE.C2C;
    subType = webim.C2C_MSG_SUB_TYPE.COMMON;
    maxLen = webim.MSG_MAX_LENGTH.C2C;
    err = `消息长度超出限制(最多${Math.round(maxLen / 3)}汉字)`;
  } else {
    info.toName = contactInfo.GroupNick;
    info.friendHeadUrl = contactInfo.GroupImage;

    selType = webim.SESSION_TYPE.GROUP;
    subType = webim.GROUP_MSG_SUB_TYPE.COMMON;
    maxLen = webim.MSG_MAX_LENGTH.GROUP;
    err = `消息长度超出限制(最多${Math.round(maxLen / 3)}汉字)`;
  }

  if (msgLen > maxLen) {
    return cb && cb(err);
  }

  const msgTime = Math.round(new Date().getTime() / 1000);
  const random = Math.round(Math.random() * 4294967296);// 消息随机数，用于去重
  const seq = -1;// 消息序列，-1表示sdk自动生成，用于去重
  const isSend = true;// 是否为自己发送

  let selSess = webim.MsgStore.sessByTypeId(selType, info.toId);

  if (!selSess) {
    console.log('1', selType);
    selSess = new webim.Session(selType, info.toId, info.toName, info.friendHeadUrl, Math.round(new Date().getTime() / 1000), seq);
  }


  const msg = new webim.Msg(selSess, isSend, seq, random, msgTime, loginInfo.identifier, subType, loginInfo.identifierNick);

  let text_obj,
    face_obj,
    tmsg,
    emotionIndex,
    emotion,
    restMsgIndex;
  // 解析文本和表情
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

  webim.sendMsg(msg, () => cb && cb(null, msg), err => cb && cb(err));
};

// 获取最近的会话
api.getRecentContactList = function (cb) {
  chat.emit('getRecentContactList', { page: 1, pageSize: 30 })
  chat.emit('test', { v:12 })
};

// 设置个人资料
api.setProfile = function setProfilePortrait(profile, cb) {
  const GENDER = {
    unknow: 'Gender_Type_Unknown',
    female: 'Gender_Type_Female',
    male: 'Gender_Type_Male'
  };

  const ALLOW_TYPE = {
    needConfirm: 'AllowType_Type_NeedConfirm', // 需要经过自己确认才能添加自己为好友
    allowAny: 'AllowType_Type_AllowAny', // 允许任何人添加自己为好友
    denyAny: 'AllowType_Type_DenyAny' // 不允许任何人添加自己为好友
  };

  const p = {
    nickName: profile.nickName, // 昵称 长度不得超过500个字节
    gender: GENDER[profile.gender] || GENDER.unknow,
    allowType: ALLOW_TYPE[profile.allowType] || ALLOW_TYPE.needConfirm, // 加好友验证方式
    avatar: profile.avatar || '', // 头像URL
    sign: profile.sign || '' // 个性签名
  };

  const profile_item = [
    {
      Tag: 'Tag_Profile_IM_Nick',
      Value: p.nickName
    },
    {
      Tag: 'Tag_Profile_IM_Gender',
      Value: p.gender
    },
    {
      Tag: 'Tag_Profile_IM_AllowType',
      Value: p.allowType
    },
    {
      Tag: 'Tag_Profile_IM_Image',
      Value: p.avatar
    },
    {
      Tag: 'Tag_Profile_IM_SelfSignature',
      Value: p.sign
    }
  ];

  console.log('profile -->', profile_item);

  webim.setProfilePortrait({ ProfileItem: profile_item }, () => cb && cb(null, 'ok'), err => cb && cb(err));
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
  imAPI.addDialog({
    name: info.Name,
    type: 'GROUP',
    members: info.Members.join(',')
  }).then((resp) => {
    const groupInfo = merge({
      GroupId: resp.data,
      Owner_Account: loginInfo.identifier,
      Type: 'Public',
      Name: info.Name,
      FaceUrl: '',
      Notification: '',
      Introduction: '',
      MemberList: [], // {  "Member_Account": "xxxx" }
      ApplyJoinOption: 'FreeAccess' // DisableApply表示禁止任何人申请加入；NeedPermission表示需要群主或管理员审批；FreeAccess表示允许无需审批自由加入群组。
    }, info);

    groupInfo.MemberList = info.Members;

    if (!groupInfo.Name) {
      return cb && cb('请输入群组名称');
    }

    if (webim.Tool.getStrBytes(groupInfo.Name) > 30) {
      groupInfo.Name = `${groupInfo.Name.slice(0, 5)}...`;
      return cb && cb('您输入的群组名称超出限制(最长10个汉字)');
    }

    if (webim.Tool.getStrBytes(groupInfo.Notification) > 150) {
      return cb && cb('您输入的群组公告超出限制(最长50个汉字)');
    }

    if (webim.Tool.getStrBytes(groupInfo.Introduction) > 120) {
      return cb && cb('您输入的群组简介超出限制(最长40个汉字)');
    }

    webim.createGroup(groupInfo, () => {
      // 读取我的群组列表
      // getJoinedGroupListHigh(getGroupsCallbackOK);
      const msg = `${info.CreatorName}创建了群`;
      api.sendMessage({
        To_Account: groupInfo.GroupId,
        Type: webim.RECENT_CONTACT_TYPE.GROUP,
        GroupNick: groupInfo.Name,
        GroupImage: ''
      }, msg, (err, r) => cb && cb(null, groupInfo.GroupId));
    }, err => cb && cb(err.ErrorInfo));
  }).catch(err => cb && cb(err));
};

// 获取我的群组
api.getMyGroup = function getMyGroup(parmas, cb) {
  const options = merge({
    Limit: totalCount,
    Offset: 0
    // 'GroupType':'',
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
    const data = [];
    for (let i = 0; i < resp.GroupIdList.length; i++) {
      const group_id = resp.GroupIdList[i].GroupId;
      const name = webim.Tool.formatText2Html(resp.GroupIdList[i].Name);
      const type_en = resp.GroupIdList[i].Type;
      const type = webim.Tool.groupTypeEn2Ch(resp.GroupIdList[i].Type);
      const role_en = resp.GroupIdList[i].SelfInfo.Role;
      const role = webim.Tool.groupRoleEn2Ch(resp.GroupIdList[i].SelfInfo.Role);
      const msg_flag = webim.Tool.groupMsgFlagEn2Ch(
        resp.GroupIdList[i].SelfInfo.MsgFlag);
      const msg_flag_en = resp.GroupIdList[i].SelfInfo.MsgFlag;
      const join_time = webim.Tool.formatTimeStamp(
        resp.GroupIdList[i].SelfInfo.JoinTime);
      const member_num = resp.GroupIdList[i].MemberNum;
      const notification = webim.Tool.formatText2Html(
        resp.GroupIdList[i].Notification);
      const introduction = webim.Tool.formatText2Html(
        resp.GroupIdList[i].Introduction);
      const ShutUpAllMember = resp.GroupIdList[i].ShutUpAllMember;
      data.push({
        GroupId: group_id,
        Name: name,
        TypeEn: type_en,
        Type: type,
        RoleEn: role_en,
        Role: role,
        MsgFlagEn: msg_flag_en,
        MsgFlag: msg_flag,
        MemberNum: member_num,
        Notification: notification,
        Introduction: introduction,
        JoinTime: join_time,
        ShutUpAllMember: ShutUpAllMember
      });
    }
    // 打开我的群组列表对话框
    $('#get_my_group_table').bootstrapTable('load', data);
    $('#get_my_group_dialog').modal('show');
  }, (err) => {
    alert(err.ErrorInfo);
  });
};

// 读取群组基本资料-高级接口
api.getGroupInfo = function getGroupInfo(id, cb) {
  const options = {
    GroupIdList: [id],
    GroupBaseInfoFilter: [
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
    MemberInfoFilter: [
      'Account',
      'Role',
      'JoinTime',
      'LastSendMsgTime',
      'ShutUpUntil'
    ]
  };

  webim.getGroupInfo(options, resp => cb && cb(null, resp), err => cb && cb(err.ErrorInfo));
};

module.exports = api;
