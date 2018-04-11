const api = {};
const axios = require('../config');

api.getTagsConfig = function getTagsConfig(data, scope, needOriginResponse) {

  const startName = 'getTagsConfigstart';
  const endName = 'getTagsConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/getTagsConfig', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getTagsConfig', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getManuscriptConfig = function getManuscriptConfig(data, scope, needOriginResponse) {

  const startName = 'getManuscriptConfigstart';
  const endName = 'getManuscriptConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/getManuscriptConfig', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getManuscriptConfig', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getManuscript = function getManuscript(data, scope, needOriginResponse) {

  const startName = 'getManuscriptstart';
  const endName = 'getManuscriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/getManuscript', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getManuscript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.addOrUpdateManuscript = function addOrUpdateManuscript(data, scope, needOriginResponse) {

  const startName = 'addOrUpdateManuscriptstart';
  const endName = 'addOrUpdateManuscriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/addOrUpdate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addOrUpdateManuscript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getSummary = function getSummary(data, scope, needOriginResponse) {

  const startName = 'getSummarystart';
  const endName = 'getSummaryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/getSummary', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSummary', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.listManuscript = function listManuscript(data, scope, needOriginResponse) {

  const startName = 'listManuscriptstart';
  const endName = 'listManuscriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listManuscript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.listSubmitScript = function listSubmitScript(data, scope, needOriginResponse) {

  const startName = 'listSubmitScriptstart';
  const endName = 'listSubmitScriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/listSubmitScript', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listSubmitScript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getSearchHistory = function getSearchHistory(data, scope, needOriginResponse) {

  const startName = 'getSearchHistorystart';
  const endName = 'getSearchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/getSearchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSearchHistory', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.clearSearchHistory = function clearSearchHistory(data, scope, needOriginResponse) {

  const startName = 'clearSearchHistorystart';
  const endName = 'clearSearchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/clearSearchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('clearSearchHistory', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.changeManuscriptStatus = function changeManuscriptStatus(data, scope, needOriginResponse) {

  const startName = 'changeManuscriptStatusstart';
  const endName = 'changeManuscriptStatusend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/changeManuscriptStatus', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('changeManuscriptStatus', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.copy = function copy(data, scope, needOriginResponse) {

  const startName = 'copystart';
  const endName = 'copyend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/copy', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('copy', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.clearAll = function clearAll(data, scope, needOriginResponse) {

  const startName = 'clearAllstart';
  const endName = 'clearAllend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/clearAll', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('clearAll', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.addAttachment = function addAttachment(data, scope, needOriginResponse) {

  const startName = 'addAttachmentstart';
  const endName = 'addAttachmentend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/addAttachment', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addAttachment', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.bindAttachment = function bindAttachment(data, scope, needOriginResponse) {

  const startName = 'bindAttachmentstart';
  const endName = 'bindAttachmentend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/bindAttachment', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('bindAttachment', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.listAttachments = function listAttachments(data, scope, needOriginResponse) {

  const startName = 'listAttachmentsstart';
  const endName = 'listAttachmentsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/listAttachments', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listAttachments', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.deleteAttachments = function deleteAttachments(data, scope, needOriginResponse) {

  const startName = 'deleteAttachmentsstart';
  const endName = 'deleteAttachmentsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/deleteAttachments', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteAttachments', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.hongKongSimplified = function hongKongSimplified(data, scope, needOriginResponse) {

  const startName = 'hongKongSimplifiedstart';
  const endName = 'hongKongSimplifiedend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/hongKongSimplified', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('hongKongSimplified', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getGroupList = function getGroupList(data, scope, needOriginResponse) {

  const startName = 'getGroupListstart';
  const endName = 'getGroupListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/listGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupList', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getGroupUserList = function getGroupUserList(data, scope, needOriginResponse) {

  const startName = 'getGroupUserListstart';
  const endName = 'getGroupUserListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/listUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupUserList', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.createWebSocketTask = function createWebSocketTask(data, scope, needOriginResponse) {

  const startName = 'createWebSocketTaskstart';
  const endName = 'createWebSocketTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/createWebSocketTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createWebSocketTask', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.updateWebSocketTask = function updateWebSocketTask(data, scope, needOriginResponse) {

  const startName = 'updateWebSocketTaskstart';
  const endName = 'updateWebSocketTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/updateWebSocketTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateWebSocketTask', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.resubmitScript = function resubmitScript(data, scope, needOriginResponse) {

  const startName = 'resubmitScriptstart';
  const endName = 'resubmitScriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/resubmitScript', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('resubmitScript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.listManageSubmitScript = function listManageSubmitScript(data, scope, needOriginResponse) {

  const startName = 'listManageSubmitScriptstart';
  const endName = 'listManageSubmitScriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/manuscript/listManageSubmitScript', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listManageSubmitScript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.manageResubmitScript = function manageResubmitScript(data, scope, needOriginResponse) {

  const startName = 'manageResubmitScriptstart';
  const endName = 'manageResubmitScriptend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/manuscript/manageResubmitScript', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('manageResubmitScript', startName, endName);

      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if (scope) { scope.$progress.finish(); }
        return resolve(res);
      }
      if (scope) { scope.$progress.fail(); }
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

module.exports = api;
