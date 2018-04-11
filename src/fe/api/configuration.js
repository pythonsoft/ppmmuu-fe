const api = {};
const axios = require('../config');

api.postAddConfig = function postAddConfig(data, scope, needOriginResponse) {

  const startName = 'postAddConfigstart';
  const endName = 'postAddConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/add', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postAddConfig', startName, endName);

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

api.postUpdateConfig = function postUpdateConfig(data, scope, needOriginResponse) {

  const startName = 'postUpdateConfigstart';
  const endName = 'postUpdateConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/update', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateConfig', startName, endName);

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

api.getListConfig = function getListConfig(data, scope, needOriginResponse) {

  const startName = 'getListConfigstart';
  const endName = 'getListConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/configuration/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getListConfig', startName, endName);

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

api.postDeleteConfig = function postDeleteConfig(data, scope, needOriginResponse) {

  const startName = 'postDeleteConfigstart';
  const endName = 'postDeleteConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/delete', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteConfig', startName, endName);

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

api.postAddGroup = function postAddGroup(data, scope, needOriginResponse) {

  const startName = 'postAddGroupstart';
  const endName = 'postAddGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/addGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postAddGroup', startName, endName);

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

api.postUpdateGroup = function postUpdateGroup(data, scope, needOriginResponse) {

  const startName = 'postUpdateGroupstart';
  const endName = 'postUpdateGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/updateGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateGroup', startName, endName);

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

api.getListGroup = function getListGroup(data, scope, needOriginResponse) {

  const startName = 'getListGroupstart';
  const endName = 'getListGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/configuration/listGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getListGroup', startName, endName);

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

api.postDeleteGroup = function postDeleteGroup(data, scope, needOriginResponse) {

  const startName = 'postDeleteGroupstart';
  const endName = 'postDeleteGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/configuration/deleteGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteGroup', startName, endName);

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
