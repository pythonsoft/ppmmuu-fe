import bubble from '../../component/higherOrder/bubble';
import { merge, isEmptyObject, getItemFromLocalStorage } from '../../common/utils';
import io from 'socket.io-client';

const global = require('../../global');

const CONTACT_TYPE = {
  PERSON: '0', // 人
  NORMAL_GROUP: '1', // 群
  TRANSFER_BOX: '2' // 传输盒子
};

const SESSION_TYPE = {
  C2C: '1',
  GROUP: '2'
};

const MESSAGE_TYPE = {
  C2C: '1',
  GROUP: '2'
};

const DEFAULT_AVATAR = '/static/img/avatar.png';

const api = {};

let chat = null;
let meInfo = null;
let index = 0;
const callback_store = {};
const getIndex = function () {
  return `${++index}`;
};

callback_store.on = function (name, params, fn) {
  const inx = getIndex();

  callback_store[inx] = fn;
  params._cid = inx;

  chat.emit(name, params);

  return inx;
};

callback_store.off = function (index) {
  delete callback_store[index];
};

callback_store.exec = function (cid, rs) {
  const fn = callback_store[cid];
  if (fn) {
    if (rs.status === '0') {
      fn && fn(null, rs.data);
      callback_store.off(rs.cid);

      return false;
    }

    fn && fn(rs.statusInfo.message);

    callback_store.off(rs.cid);
  }
};

// 开始连接服务器
api.connect = function (ticket, cb) {
  chat = io(`ws://${global.socketDomain}/chat`, {
    transports: ['websocket'],
    query: {
      'im-key': 'ump',
      'im-ticket': ticket
    }
  });

  chat.on('connect', () => {
    console.log('a user connected');

    chat.on('error', (rs) => {
      console.log('error ===>', rs);
    });

    chat.on('disconnect', (rs) => {
      console.log('disconnect ===>', rs);
    });

    chat.on('login', (rs) => {
      if (rs.status === '0') {
        meInfo = rs.data;
        cb(null, rs.data);
      } else {
        console.error('login error -->', rs.statusInfo.message);
        cb(rs.statusInfo.message);
      }
    });

    chat.on('message', (rs) => {
      bubble.emit('onMessage', rs);
    });

    for (const k in api) {
      if (k !== 'events') {
        chat.on(k, (rs) => {
          const cid = rs.cid;

          if (cid) {
            callback_store.exec(cid, rs);
          } else {
            console.error('result cid is null', rs);
          }
        });
      }
    }
  });
};

// 获取最近的会话
api.getRecentContactList = function (page, cb) {
  callback_store.on('getRecentContactList', { page: page }, cb);
};

api.addContact = function (info, cb) {
  const data = merge({
    targetId: '',
    targetName: '',
    photo: '',
    type: ''
  }, info);

  callback_store.on('addContact', data, cb);
};

api.addFriend = function (id, name, photo, cb) {
  const data = {
    targetId: id,
    targetName: name,
    photo: photo,
    type: CONTACT_TYPE.PERSON
  };

  callback_store.on('addContact', data, (err) => {
    if (err) {
      return cb && cb(err);
    }

    api.createSession(name, id, cb);
  });
};

api.createGroup = function (name, members, cb) {
  api.createSession(name, members, (err, info) => {
    const data = {
      targetId: info._id,
      targetName: name,
      type: CONTACT_TYPE.GROUP
    };

    callback_store.on('addContact', data, (err) => {
      if (err) {
        return cb && cb(err);
      }

      return cb && cb(null, info);
    });
  });
};

const getFriendInfoFromMembers = function (meId, members) {
  let info = null;
  const len = members.length;

  for (let i = 0; i < len; i++) {
    if (meId !== members[i]._id) {
      info = members[i];
    }
  }

  return info;
};

api.getFriendPhotoFromMembersInC2C = function (meId, sessionInfo) {
  const members = sessionInfo.members;
  const len = members.length;
  let url = '';

  if (len === 0) {
    return url;
  }

  if (sessionInfo.type === SESSION_TYPE.C2C) {
    const info = getFriendInfoFromMembers(meId, members);
    if (info) {
      url = info.photo || DEFAULT_AVATAR;
    }
  }

  return url;
};

api.createSession = function (name, members, cb) {
  callback_store.on('createSession', {
    name: name,
    type: members.indexOf(',') === -1 ? SESSION_TYPE.C2C : SESSION_TYPE.GROUP,
    members: [members, meInfo._id].join(',')
  }, cb);
};

api.addUserToSession = function () {
};

api.listUnReadMessage = function (sessionId, page = 1, pageSize = 50, cb) {
  callback_store.on('listUnReadMessage', { sessionId, page, pageSize }, cb);
};

api.sendMessage = function (sessionId, sessionType, content, fromId, toId, cb) {
  const params = {
    sessionId,
    content,
    fromId,
    fromType: CONTACT_TYPE.PERSON,
    toId,
    toType: CONTACT_TYPE.PERSON,
    type: MESSAGE_TYPE.C2C
  };

  if (sessionType !== SESSION_TYPE.C2C) {
    params.toType = CONTACT_TYPE.NORMAL_GROUP;
    params.type = MESSAGE_TYPE.GROUP;
  }

  callback_store.on('message', params, cb);
};

api.hasRead = function () {
};

api.getAvatar = function(currentSessionInfo, messageInfo) {
  const members = currentSessionInfo.members;
  const fromId = messageInfo.from._id;
  let photo = '';

  for(let i = 0, len = members.length; i < len; i++) {
    if(members[i]._id === fromId) {
      photo = members[i].photo;
    }
  }


  return photo || DEFAULT_AVATAR;
};

api.SESSION_TYPE = SESSION_TYPE;
api.MESSAGE_TYPE = MESSAGE_TYPE;

api.convertMsgToHtml = function(messageInfo) {
  return messageInfo.content;
};

api.events = {};

api.events.onMessage = function (fn) {
  bubble.on('onMessage', fn);
};

api.events.offMessage = function () {
  bubble.off('onMessage');
};

module.exports = api;
