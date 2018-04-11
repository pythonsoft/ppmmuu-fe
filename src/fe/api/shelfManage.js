const api = {};
const axios = require('../config');

api.getShelfDetail = function getShelfDetail(data, scope, needOriginResponse) {

  const startName = 'getShelfDetailstart';
  const endName = 'getShelfDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/getShelfDetail', data).then((response) => {

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

api.listShelfManageTask = function listShelfManageTask(data, scope, needOriginResponse) {

  const startName = 'listShelfManageTaskstart';
  const endName = 'listShelfManageTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/listTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listShelfManageTask', startName, endName);

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
    axios.post('/shelfManage/deleteShelfTask', data).then((response) => {

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

api.addTemplate = function addTemplate(data, scope, needOriginResponse) {

  const startName = 'addTemplatestart';
  const endName = 'addTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/addTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addTemplate', startName, endName);

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

api.getTemplateInfo = function getTemplateInfo(data, scope, needOriginResponse) {

  const startName = 'getTemplateInfostart';
  const endName = 'getTemplateInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/getTemplateInfo', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getTemplateInfo', startName, endName);

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

api.listTemplate = function listTemplate(data, scope, needOriginResponse) {

  const startName = 'listTemplatestart';
  const endName = 'listTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/listTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listTemplate', startName, endName);

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

api.removeTemplate = function removeTemplate(data, scope, needOriginResponse) {

  const startName = 'removeTemplatestart';
  const endName = 'removeTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/removeTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeTemplate', startName, endName);

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

api.updateTemplate = function updateTemplate(data, scope, needOriginResponse) {

  const startName = 'updateTemplatestart';
  const endName = 'updateTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/updateTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateTemplate', startName, endName);

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

api.addFastEditTemplate = function addFastEditTemplate(data, scope, needOriginResponse) {

  const startName = 'addFastEditTemplatestart';
  const endName = 'addFastEditTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/addFastEditTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('addFastEditTemplate', startName, endName);

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

api.getFastEditTemplateInfo = function getFastEditTemplateInfo(data, scope, needOriginResponse) {

  const startName = 'getFastEditTemplateInfostart';
  const endName = 'getFastEditTemplateInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/getFastEditTemplateInfo', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getFastEditTemplateInfo', startName, endName);

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

api.listFastEditTemplate = function listFastEditTemplate(data, scope, needOriginResponse) {

  const startName = 'listFastEditTemplatestart';
  const endName = 'listFastEditTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/listFastEditTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listFastEditTemplate', startName, endName);

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

api.removeFastEditTemplate = function removeFastEditTemplate(data, scope, needOriginResponse) {

  const startName = 'removeFastEditTemplatestart';
  const endName = 'removeFastEditTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/removeFastEditTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeFastEditTemplate', startName, endName);

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

api.updateFastEditTemplate = function updateFastEditTemplate(data, scope, needOriginResponse) {

  const startName = 'updateFastEditTemplatestart';
  const endName = 'updateFastEditTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/shelfManage/updateFastEditTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateFastEditTemplate', startName, endName);

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

api.getShelfTaskProcess = function getShelfTaskProcess(data, scope, needOriginResponse) {

  const startName = 'getShelfTaskProcessstart';
  const endName = 'getShelfTaskProcessend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/shelfManage/getShelfTaskProcess', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getShelfTaskProcess', startName, endName);

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
