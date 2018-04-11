const api = {};
const axios = require('../config');

api.addTemplateGroup = function addTemplateGroup(data, scope, needOriginResponse) {

  const startName = 'addTemplateGroupstart';
  const endName = 'addTemplateGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/addGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addTemplateGroup', startName, endName);

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

api.listTemplateGroup = function listTemplateGroup(data, scope, needOriginResponse) {

  const startName = 'listTemplateGroupstart';
  const endName = 'listTemplateGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/template/listGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listTemplateGroup', startName, endName);

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

api.removeTemplateGroup = function removeTemplateGroup(data, scope, needOriginResponse) {

  const startName = 'removeTemplateGroupstart';
  const endName = 'removeTemplateGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/removeGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeTemplateGroup', startName, endName);

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

api.getGroup = function getGroup(data, scope, needOriginResponse) {

  const startName = 'getGroupstart';
  const endName = 'getGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/template/getGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroup', startName, endName);

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

api.updateTemplateGroup = function updateTemplateGroup(data, scope, needOriginResponse) {

  const startName = 'updateTemplateGroupstart';
  const endName = 'updateTemplateGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/updateGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateTemplateGroup', startName, endName);

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

api.list = function list(data, scope, needOriginResponse) {

  const startName = 'liststart';
  const endName = 'listend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/template/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('list', startName, endName);

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

api.createDownloadTemplate = function createDownloadTemplate(data, scope, needOriginResponse) {

  const startName = 'createDownloadTemplatestart';
  const endName = 'createDownloadTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/createDownloadTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createDownloadTemplate', startName, endName);

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

api.remove = function remove(data, scope, needOriginResponse) {

  const startName = 'removestart';
  const endName = 'removeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/remove', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('remove', startName, endName);

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

api.update = function update(data, scope, needOriginResponse) {

  const startName = 'updatestart';
  const endName = 'updateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/update', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('update', startName, endName);

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

api.getDetail = function getDetail(data, scope, needOriginResponse) {

  const startName = 'getDetailstart';
  const endName = 'getDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/template/getDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getDetail', startName, endName);

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

api.getTemplateSearchUserOrGroup = function getTemplateSearchUserOrGroup(data, scope, needOriginResponse) {

  const startName = 'getTemplateSearchUserOrGroupstart';
  const endName = 'getTemplateSearchUserOrGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/template/search/userOrGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getTemplateSearchUserOrGroup', startName, endName);

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

api.updateGroupUser = function updateGroupUser(data, scope, needOriginResponse) {

  const startName = 'updateGroupUserstart';
  const endName = 'updateGroupUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/template/updateGroupUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateGroupUser', startName, endName);

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

api.getWatermark = function getWatermark(id, fromWhere) {
  return axios.defaults.baseURL + '/template/getWatermark?objectid=' + id + '&fromWhere=' + fromWhere;
};

module.exports = api;
