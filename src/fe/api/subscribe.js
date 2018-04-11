const api = {};
const axios = require('../config');

api.getSubscribeInfo = function getSubscribeInfo(data, scope, needOriginResponse) {

  const startName = 'getSubscribeInfostart';
  const endName = 'getSubscribeInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribe/getSubscribeInfo', data).then((response) => {

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

api.getSubscribeTypeSummary = function getSubscribeTypeSummary(data, scope, needOriginResponse) {

  const startName = 'getSubscribeTypeSummarystart';
  const endName = 'getSubscribeTypeSummaryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribe/getSubscribeTypeSummary', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSubscribeTypeSummary', startName, endName);

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

api.esSearch = function esSearch(data, scope, needOriginResponse) {

  const startName = 'esSearchstart';
  const endName = 'esSearchend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribe/esSearch', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('esSearch', startName, endName);

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

api.getEsMediaList = function getEsMediaList(data, scope, needOriginResponse) {

  const startName = 'getEsMediaListstart';
  const endName = 'getEsMediaListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribe/getEsMediaList', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getEsMediaList', startName, endName);

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

api.getSubscribeSearchConfig = function getSubscribeSearchConfig(data, scope, needOriginResponse) {

  const startName = 'getSubscribeSearchConfigstart';
  const endName = 'getSubscribeSearchConfigend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribe/getSubscribeSearchConfig', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSubscribeSearchConfig', startName, endName);

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

api.getVideoInfo = function getVideoInfo(data, scope, needOriginResponse) {

  const startName = 'getVideoInfostart';
  const endName = 'getVideoInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/subscribe/getVideoInfo', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getVideoInfo', startName, endName);

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

api.createDownloadUrl = function createDownloadUrl(data, scope, needOriginResponse) {

  const startName = 'createDownloadUrlstart';
  const endName = 'createDownloadUrlend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/subscribe/createDownloadUrl', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createDownloadUrl', startName, endName);

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
