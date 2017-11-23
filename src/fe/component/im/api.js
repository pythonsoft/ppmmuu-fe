import { merge, isEmptyObject } from '../../common/utils';
import io from 'socket.io-client';

const global = require('../../global');

const api = {};

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
    fn && fn(rs);
    callback_store.off(rs.cid);
  }
};

// 获取最近的会话
api.getRecentContactList = function (page, cb) {
  callback_store.on('getRecentContactList', { page: page }, cb);
};

api.addContact = function (cb) {
  callback_store.on('addContact', { page: 1, pageSize: 30 });
};

api.createSession = function () {
};

api.addUserToSession = function () {
};

api.listUnReadMessage = function () {
};

api.hasRead = function () {
};

api.message = function () {
};

const chat = io(`ws://${global.baseDomain}/chat`, {
  transports: ['websocket']
});

chat.on('connect', () => {
  console.log('a user connected');

  chat.on('error', (rs) => {
    console.log('error ===>', rs);
  });

  chat.on('disconnect', (rs) => {
    console.log('disconnect ===>', rs);
  });

  for (const k in api) {
    chat.on(k, (rs) => {
      if (!rs) {
        console.error('result is null', rs);
        return false;
      }

      const data = JSON.parse(rs);
      const cid = data.cid;

      if (cid) {
        callback_store.exec(cid, data);
      } else {
        console.error('result cid is null', rs);
      }
    });
  }
});

module.exports = api;
