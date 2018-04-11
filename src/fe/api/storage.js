const api = {};
const axios = require('../config');

api.listBucket = function listBucket(data, scope, needOriginResponse) {

  const startName = 'listBucketstart';
  const endName = 'listBucketend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/listBucket', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listBucket', startName, endName);

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

api.getBucketDetail = function getBucketDetail(data, scope, needOriginResponse) {

  const startName = 'getBucketDetailstart';
  const endName = 'getBucketDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/getBucketDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getBucketDetail', startName, endName);

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

api.addBucket = function addBucket(data, scope, needOriginResponse) {

  const startName = 'addBucketstart';
  const endName = 'addBucketend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/addBucket', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addBucket', startName, endName);

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

api.updateBucket = function updateBucket(data, scope, needOriginResponse) {

  const startName = 'updateBucketstart';
  const endName = 'updateBucketend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/updateBucket', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateBucket', startName, endName);

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

api.enableBucket = function enableBucket(data, scope, needOriginResponse) {

  const startName = 'enableBucketstart';
  const endName = 'enableBucketend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/enableBucket', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('enableBucket', startName, endName);

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

api.deleteBucket = function deleteBucket(data, scope, needOriginResponse) {

  const startName = 'deleteBucketstart';
  const endName = 'deleteBucketend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/deleteBucket', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteBucket', startName, endName);

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

api.listPath = function listPath(data, scope, needOriginResponse) {

  const startName = 'listPathstart';
  const endName = 'listPathend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/listPath', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listPath', startName, endName);

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

api.getPathDetail = function getPathDetail(data, scope, needOriginResponse) {

  const startName = 'getPathDetailstart';
  const endName = 'getPathDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/getPathDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getPathDetail', startName, endName);

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

api.addPath = function addPath(data, scope, needOriginResponse) {

  const startName = 'addPathstart';
  const endName = 'addPathend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/addPath', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addPath', startName, endName);

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

api.updatePath = function updatePath(data, scope, needOriginResponse) {

  const startName = 'updatePathstart';
  const endName = 'updatePathend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/updatePath', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updatePath', startName, endName);

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

api.enablePath = function enablePath(data, scope, needOriginResponse) {

  const startName = 'enablePathstart';
  const endName = 'enablePathend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/enablePath', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('enablePath', startName, endName);

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

api.deletePath = function deletePath(data, scope, needOriginResponse) {

  const startName = 'deletePathstart';
  const endName = 'deletePathend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/deletePath', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deletePath', startName, endName);

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

api.listTactics = function listTactics(data, scope, needOriginResponse) {

  const startName = 'listTacticsstart';
  const endName = 'listTacticsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/listTactics', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listTactics', startName, endName);

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

api.getTacticDetail = function getTacticDetail(data, scope, needOriginResponse) {

  const startName = 'getTacticDetailstart';
  const endName = 'getTacticDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/storage/getTacticsDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getTacticDetail', startName, endName);

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

api.addTactics = function addTactics(data, scope, needOriginResponse) {

  const startName = 'addTacticsstart';
  const endName = 'addTacticsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/addTactics', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addTactics', startName, endName);

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

api.updateTactics = function updateTactics(data, scope, needOriginResponse) {

  const startName = 'updateTacticsstart';
  const endName = 'updateTacticsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/updateTactics', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateTactics', startName, endName);

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

api.enableTactics = function enableTactics(data, scope, needOriginResponse) {

  const startName = 'enableTacticsstart';
  const endName = 'enableTacticsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/enableTactics', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('enableTactics', startName, endName);

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

api.deleteTactics = function deleteTactics(data, scope, needOriginResponse) {

  const startName = 'deleteTacticsstart';
  const endName = 'deleteTacticsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/storage/deleteTactics', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteTactics', startName, endName);

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
