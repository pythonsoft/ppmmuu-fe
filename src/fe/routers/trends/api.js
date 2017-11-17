const api = {};
const axios = require('../../config');

axios.defaults.baseURL = 'http://182.61.54.108:9999/api/v1/bigdata';

api.getRealtimeBuzz = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeBuzz/bd', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowNews = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/news', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowGeo = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/geo', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowTrends = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/trends', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowTimeline = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/timeline', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowSpread = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/spread', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
api.getRealtimeFlowOpinion = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/realtimeFlow/opinion', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};
module.exports = api;
