const api = {};
const axios = require('../config');

api.createSubscribeInfo = function createSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'createSubscribeInfostart';
  const endName = 'createSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/create', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createSubscribeInfo', startName, endName);

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

api.updateSubscribeInfo = function updateSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'updateSubscribeInfostart';
  const endName = 'updateSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/update', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateSubscribeInfo', startName, endName);

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

api.getSubscribeInfo = function getSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'getSubscribeInfostart';
  const endName = 'getSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/getSubscribeInfo', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSubscribeInfo', startName, endName);

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

api.listSubscribeInfo = function listSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'listSubscribeInfostart';
  const endName = 'listSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listSubscribeInfo', startName, endName);

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

api.deleteSubscribeInfo = function deleteSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'deleteSubscribeInfostart';
  const endName = 'deleteSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/delete', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteSubscribeInfo', startName, endName);

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

api.searchCompany = function searchCompany(data, scope, needOriginResponse) {

  const startName = 'searchCompanystart';
  const endName = 'searchCompanyend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/searchCompany', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('searchCompany', startName, endName);

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

api.createSubscribeType = function createSubscribeType(data, scope, needOriginResponse) {

  const startName = 'createSubscribeTypestart';
  const endName = 'createSubscribeTypeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/createSubscribeType', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createSubscribeType', startName, endName);

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

api.updateSubscribeType = function updateSubscribeType(data, scope, needOriginResponse) {

  const startName = 'updateSubscribeTypestart';
  const endName = 'updateSubscribeTypeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/updateSubscribeType', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateSubscribeType', startName, endName);

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

api.getSubscribeType = function getSubscribeType(data, scope, needOriginResponse) {

  const startName = 'getSubscribeTypestart';
  const endName = 'getSubscribeTypeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/getSubscribeType', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSubscribeType', startName, endName);

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

api.listSubscribeType = function listSubscribeType(data, scope, needOriginResponse) {

  const startName = 'listSubscribeTypestart';
  const endName = 'listSubscribeTypeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/listSubscribeType', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listSubscribeType', startName, endName);

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

api.deleteSubscribeType = function deleteSubscribeType(data, scope, needOriginResponse) {

  const startName = 'deleteSubscribeTypestart';
  const endName = 'deleteSubscribeTypeend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribeManagement/deleteSubscribeType', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteSubscribeType', startName, endName);

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

api.getSearchConfig = function getSearchConfig(data, scope, needOriginResponse) {

  const startName = 'getSearchConfigstart';
  const endName = 'getSearchConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribeManagement/getSearchConfig', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSearchConfig', startName, endName);

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
