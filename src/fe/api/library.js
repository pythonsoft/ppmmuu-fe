const api = {};
const axios = require('../config');

api.createCatalogTask = function createCatalogTask(data, scope, needOriginResponse) {

  const startName = 'createCatalogTaskstart';
  const endName = 'createCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/createCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createCatalogTask', startName, endName);

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

api.updateCatalogTask = function updateCatalogTask(data, scope, needOriginResponse) {

  const startName = 'updateCatalogTaskstart';
  const endName = 'updateCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/updateCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateCatalogTask', startName, endName);

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

api.listCatalogTask = function listCatalogTask(data, scope, needOriginResponse) {

  const startName = 'listCatalogTaskstart';
  const endName = 'listCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/listCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listCatalogTask', startName, endName);

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

api.getCatalogTask = function getCatalogTask(data, scope, needOriginResponse) {

  const startName = 'getCatalogTaskstart';
  const endName = 'getCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getCatalogTask', startName, endName);

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

api.listDepartmentCatalogTask = function listDepartmentCatalogTask(data, scope, needOriginResponse) {

  const startName = 'listDepartmentCatalogTaskstart';
  const endName = 'listDepartmentCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/listDepartmentCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listDepartmentCatalogTask', startName, endName);

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

api.listMyCatalogTask = function listMyCatalogTask(data, scope, needOriginResponse) {

  const startName = 'listMyCatalogTaskstart';
  const endName = 'listMyCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/listMyCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listMyCatalogTask', startName, endName);

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

api.assignCatalogTask = function assignCatalogTask(data, scope, needOriginResponse) {

  const startName = 'assignCatalogTaskstart';
  const endName = 'assignCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/assignCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('assignCatalogTask', startName, endName);

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

api.applyCatalogTask = function applyCatalogTask(data, scope, needOriginResponse) {

  const startName = 'applyCatalogTaskstart';
  const endName = 'applyCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/applyCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('applyCatalogTask', startName, endName);

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

api.sendBackCatalogTask = function sendBackCatalogTask(data, scope, needOriginResponse) {

  const startName = 'sendBackCatalogTaskstart';
  const endName = 'sendBackCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/sendBackCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('sendBackCatalogTask', startName, endName);

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

api.submitCatalogTask = function submitCatalogTask(data, scope, needOriginResponse) {

  const startName = 'submitCatalogTaskstart';
  const endName = 'submitCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/submitCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('submitCatalogTask', startName, endName);

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

api.deleteCatalogTask = function deleteCatalogTask(data, scope, needOriginResponse) {

  const startName = 'deleteCatalogTaskstart';
  const endName = 'deleteCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/deleteCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteCatalogTask', startName, endName);

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

api.resumeCatalogTask = function resumeCatalogTask(data, scope, needOriginResponse) {

  const startName = 'resumeCatalogTaskstart';
  const endName = 'resumeCatalogTaskend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/resumeCatalogTask', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('resumeCatalogTask', startName, endName);

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

api.getCatalog = function getCatalog(data, scope, needOriginResponse) {

  const startName = 'getCatalogstart';
  const endName = 'getCatalogend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getCatalog', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getCatalog', startName, endName);

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

api.getCatalogInfoTranslation = function getCatalogInfoTranslation(data, scope, needOriginResponse) {

  const startName = 'getCatalogInfoTranslationstart';
  const endName = 'getCatalogInfoTranslationend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getCatalogInfoTranslation', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getCatalogInfoTranslation', startName, endName);

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

api.listCatalog = function listCatalog(data, scope, needOriginResponse) {

  const startName = 'listCatalogstart';
  const endName = 'listCatalogend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/listCatalog', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listCatalog', startName, endName);

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

api.createCatalog = function createCatalog(data, scope, needOriginResponse) {

  const startName = 'createCatalogstart';
  const endName = 'createCatalogend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/createCatalog', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createCatalog', startName, endName);

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

api.updateCatalog = function updateCatalog(data, scope, needOriginResponse) {

  const startName = 'updateCatalogstart';
  const endName = 'updateCatalogend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/updateCatalog', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateCatalog', startName, endName);

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

api.createFile = function createFile(data, scope, needOriginResponse) {

  const startName = 'createFilestart';
  const endName = 'createFileend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/createFile', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createFile', startName, endName);

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

api.updateFile = function updateFile(data, scope, needOriginResponse) {

  const startName = 'updateFilestart';
  const endName = 'updateFileend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/library/updateFile', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateFile', startName, endName);

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

api.listFile = function listFile(data, scope, needOriginResponse) {

  const startName = 'listFilestart';
  const endName = 'listFileend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/listFile', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listFile', startName, endName);

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

api.getFile = function getFile(data, scope, needOriginResponse) {

  const startName = 'getFilestart';
  const endName = 'getFileend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getFile', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getFile', startName, endName);

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

api.getSubtitles = function getSubtitles(data, scope, needOriginResponse) {

  const startName = 'getSubtitlesstart';
  const endName = 'getSubtitlesend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getSubtitles', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getSubtitles', startName, endName);

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

api.generateXML = function generateXML(data, scope, needOriginResponse) {

  const startName = 'generateXMLstart';
  const endName = 'generateXMLend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/generateXML', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('generateXML', startName, endName);

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
    axios.post('/library/addTemplate', data).then((response) => {

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
    axios.get('/library/getTemplateInfo', data).then((response) => {

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

api.getTemplateResult = function getTemplateResult(data, scope, needOriginResponse) {

  const startName = 'getTemplateResultstart';
  const endName = 'getTemplateResultend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/library/getTemplateResult', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getTemplateResult', startName, endName);

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
    axios.get('/library/listTemplate', data).then((response) => {

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
    axios.post('/library/removeTemplate', data).then((response) => {

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
    axios.post('/library/updateTemplate', data).then((response) => {

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

module.exports = api;
