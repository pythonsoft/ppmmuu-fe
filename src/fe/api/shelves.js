const api = {};
const axios = require('../config');

api.createShelfTask = function createShelfTask(data, scope, needOriginResponse) {

  const startName = 'createShelfTaskstart';
  const endName = 'createShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/createShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createShelfTask', startName, endName);

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

api.getShelfDetail = function getShelfDetail(data, scope, needOriginResponse) {

  const startName = 'getShelfDetailstart';
  const endName = 'getShelfDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/getShelfDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getShelfDetail', startName, endName);

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

api.listDepartmentPrepareShelfTask = function listDepartmentPrepareShelfTask(data, scope, needOriginResponse) {

  const startName = 'listDepartmentPrepareShelfTaskstart';
  const endName = 'listDepartmentPrepareShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/listDepartmentPrepareShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listDepartmentPrepareShelfTask', startName, endName);

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

api.claimShelfTask = function claimShelfTask(data, scope, needOriginResponse) {

  const startName = 'claimShelfTaskstart';
  const endName = 'claimShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/claimShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('claimShelfTask', startName, endName);

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

api.assignShelfTask = function assignShelfTask(data, scope, needOriginResponse) {

  const startName = 'assignShelfTaskstart';
  const endName = 'assignShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/assignShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('assignShelfTask', startName, endName);

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

api.deleteShelfTask = function deleteShelfTask(data, scope, needOriginResponse) {

  const startName = 'deleteShelfTaskstart';
  const endName = 'deleteShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/deleteShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteShelfTask', startName, endName);

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

api.listDepartmentShelfTask = function listDepartmentShelfTask(data, scope, needOriginResponse) {

  const startName = 'listDepartmentShelfTaskstart';
  const endName = 'listDepartmentShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/listDepartmentShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listDepartmentShelfTask', startName, endName);

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

api.listMyselfShelfTask = function listMyselfShelfTask(data, scope, needOriginResponse) {

  const startName = 'listMyselfShelfTaskstart';
  const endName = 'listMyselfShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/listMyselfShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listMyselfShelfTask', startName, endName);

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

api.saveShelf = function saveShelf(data, scope, needOriginResponse) {

  const startName = 'saveShelfstart';
  const endName = 'saveShelfend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/saveShelf', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('saveShelf', startName, endName);

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

api.batchSaveShelf = function batchSaveShelf(data, scope, needOriginResponse) {

  const startName = 'batchSaveShelfstart';
  const endName = 'batchSaveShelfend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/batchSaveShelf', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('batchSaveShelf', startName, endName);

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

api.submitShelf = function submitShelf(data, scope, needOriginResponse) {

  const startName = 'submitShelfstart';
  const endName = 'submitShelfend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/submitShelf', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('submitShelf', startName, endName);

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

api.batchSubmitShelf = function batchSubmitShelf(data, scope, needOriginResponse) {

  const startName = 'batchSubmitShelfstart';
  const endName = 'batchSubmitShelfend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/batchSubmitShelf', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('batchSubmitShelf', startName, endName);

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

api.sendBackShelf = function sendBackShelf(data, scope, needOriginResponse) {

  const startName = 'sendBackShelfstart';
  const endName = 'sendBackShelfend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/sendBackShelf', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('sendBackShelf', startName, endName);

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

api.listLineShelfTask = function listLineShelfTask(data, scope, needOriginResponse) {

  const startName = 'listLineShelfTaskstart';
  const endName = 'listLineShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/listLineShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listLineShelfTask', startName, endName);

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

api.onlineShelfTask = function onlineShelfTask(data, scope, needOriginResponse) {

  const startName = 'onlineShelfTaskstart';
  const endName = 'onlineShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/onlineShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('onlineShelfTask', startName, endName);

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

api.offlineShelfTask = function offlineShelfTask(data, scope, needOriginResponse) {

  const startName = 'offlineShelfTaskstart';
  const endName = 'offlineShelfTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/offlineShelfTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('offlineShelfTask', startName, endName);

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

api.editShelfTaskAgain = function editShelfTaskAgain(data, scope, needOriginResponse) {

  const startName = 'editShelfTaskAgainstart';
  const endName = 'editShelfTaskAgainend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/editShelfTaskAgain', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('editShelfTaskAgain', startName, endName);

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

api.searchUser = function searchUser(data, scope, needOriginResponse) {

  const startName = 'searchUserstart';
  const endName = 'searchUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelves/searchUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('searchUser', startName, endName);

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
    axios.get('/shelves/listSubscribeType', data).then((response) => {

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

api.warehouse = function warehouse(data, scope, needOriginResponse) {

  const startName = 'warehousestart';
  const endName = 'warehouseend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/warehouse', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('warehouse', startName, endName);

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

api.batchSubmitByIds = function batchSubmitByIds(data, scope, needOriginResponse) {

  const startName = 'batchSubmitByIdsstart';
  const endName = 'batchSubmitByIdsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelves/batchSubmitByIds', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('batchSubmitByIds', startName, endName);

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
