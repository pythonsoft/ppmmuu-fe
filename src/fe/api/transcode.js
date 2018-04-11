const api = {};
const axios = require('../config');

api.list = function list(data, scope, needOriginResponse) {

  const startName = 'liststart';
  const endName = 'listend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/transcode/list', data).then((response) => {

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

api.listChildTask = function listChildTask(data, scope, needOriginResponse) {

  const startName = 'listChildTaskstart';
  const endName = 'listChildTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/transcode/listChildTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listChildTask', startName, endName);

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

api.restart = function restart(data, scope, needOriginResponse) {

  const startName = 'restartstart';
  const endName = 'restartend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/transcode/restart', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('restart', startName, endName);

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

api.stop = function stop(data, scope, needOriginResponse) {

  const startName = 'stopstart';
  const endName = 'stopend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/transcode/stop', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('stop', startName, endName);

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
