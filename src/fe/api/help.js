const api = {};
const axios = require('../config');

api.uploadPackage = function uploadPackage(data, scope, needOriginResponse) {

  const startName = 'uploadPackagestart';
  const endName = 'uploadPackageend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/help/uploadPackage', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('uploadPackage', startName, endName);

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

api.installPackage = function installPackage(data, scope, needOriginResponse) {

  const startName = 'installPackagestart';
  const endName = 'installPackageend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/help/installPackage', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('installPackage', startName, endName);

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

api.listPackage = function listPackage(data, scope, needOriginResponse) {

  const startName = 'listPackagestart';
  const endName = 'listPackageend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/help/listPackage', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listPackage', startName, endName);

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

api.readFile = function readFile(data, scope, needOriginResponse) {

  const startName = 'readFilestart';
  const endName = 'readFileend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/help/readFile', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('readFile', startName, endName);

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

api.detail = function detail(data, scope, needOriginResponse) {

  const startName = 'detailstart';
  const endName = 'detailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/help/detail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('detail', startName, endName);

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
