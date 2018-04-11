const api = {};
const axios = require('../config');

api.auditPass = function auditPass(data, scope, needOriginResponse) {

  const startName = 'auditPassstart';
  const endName = 'auditPassend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/audit/pass', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('auditPass', startName, endName);

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

api.listAudit = function listAudit(data, scope, needOriginResponse) {

  const startName = 'listAuditstart';
  const endName = 'listAuditend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/audit/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listAudit', startName, endName);

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

api.listAuditRule = function listAuditRule(data, scope, needOriginResponse) {

  const startName = 'listAuditRulestart';
  const endName = 'listAuditRuleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/audit/listAuditRule', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listAuditRule', startName, endName);

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

api.createAuditRule = function createAuditRule(data, scope, needOriginResponse) {

  const startName = 'createAuditRulestart';
  const endName = 'createAuditRuleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/audit/createAuditRule', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('createAuditRule', startName, endName);

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

api.updateAuditRule = function updateAuditRule(data, scope, needOriginResponse) {

  const startName = 'updateAuditRulestart';
  const endName = 'updateAuditRuleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/audit/updateAuditRule', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('updateAuditRule', startName, endName);

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

api.removeAuditRule = function removeAuditRule(data, scope, needOriginResponse) {

  const startName = 'removeAuditRulestart';
  const endName = 'removeAuditRuleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/audit/removeAuditRule', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeAuditRule', startName, endName);

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
