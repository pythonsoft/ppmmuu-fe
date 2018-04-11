const api = {};
const axios = require('../config');

api.esSearch = function esSearch(data, scope, needOriginResponse) {

  const startName = 'esSearchstart';
  const endName = 'esSearchend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/media/esSearch', data).then((response) => {

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
    axios.get('/media/getEsMediaList', data).then((response) => {

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

api.defaultMedia = function defaultMedia(data, scope, needOriginResponse) {

  const startName = 'defaultMediastart';
  const endName = 'defaultMediaend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/media/defaultMedia', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('defaultMedia', startName, endName);

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
    axios.get('/media/getSearchConfig', data).then((response) => {

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

api.getIcon = function getIcon(id, fromWhere) {
  return axios.defaults.baseURL + '/media/getIcon?objectid=' + id + '&fromWhere=' + fromWhere;
};

api.getObject = function getObject(data, scope, needOriginResponse) {

  const startName = 'getObjectstart';
  const endName = 'getObjectend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/media/getObject', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getObject', startName, endName);

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

api.getStream = function getStream(data, scope, needOriginResponse) {

  const startName = 'getStreamstart';
  const endName = 'getStreamend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/media/getStream', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getStream', startName, endName);

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
    axios.get('/media/getSearchHistory', data).then((response) => {

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

api.getWatchHistory = function getWatchHistory(data, scope, needOriginResponse) {

  const startName = 'getWatchHistorystart';
  const endName = 'getWatchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/media/getWatchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getWatchHistory', startName, endName);

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

api.xml2srt = function xml2srt(data, scope, needOriginResponse) {

  const startName = 'xml2srtstart';
  const endName = 'xml2srtend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/media/xml2srt', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('xml2srt', startName, endName);

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
