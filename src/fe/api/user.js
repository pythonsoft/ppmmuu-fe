const api = {};
const axios = require('../config');

api.postUserLogin = function postUserLogin(data, scope, needOriginResponse) {

  const startName = 'postUserLoginstart';
  const endName = 'postUserLoginend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/login', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUserLogin', startName, endName);

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

api.getToken = function getToken(data, scope, needOriginResponse) {

  const startName = 'getTokenstart';
  const endName = 'getTokenend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/getToken', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getToken', startName, endName);

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

api.postUserUpdate = function postUserUpdate(data, scope, needOriginResponse) {

  const startName = 'postUserUpdatestart';
  const endName = 'postUserUpdateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/update', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUserUpdate', startName, endName);

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

api.getUserDetail = function getUserDetail(data, scope, needOriginResponse) {

  const startName = 'getUserDetailstart';
  const endName = 'getUserDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/detail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getUserDetail', startName, endName);

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

api.postUserLogout = function postUserLogout(data, scope, needOriginResponse) {

  const startName = 'postUserLogoutstart';
  const endName = 'postUserLogoutend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/logout', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUserLogout', startName, endName);

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

api.getUsers = function getUsers(data, scope, needOriginResponse) {

  const startName = 'getUsersstart';
  const endName = 'getUsersend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/getUsers', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getUsers', startName, endName);

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

api.getUserAuth = function getUserAuth(data, scope, needOriginResponse) {

  const startName = 'getUserAuthstart';
  const endName = 'getUserAuthend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/auth', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getUserAuth', startName, endName);

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

api.postUserChangePassword = function postUserChangePassword(data, scope, needOriginResponse) {

  const startName = 'postUserChangePasswordstart';
  const endName = 'postUserChangePasswordend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/changePassword', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUserChangePassword', startName, endName);

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
    axios.get('/user/getSearchHistory', data).then((response) => {

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

api.removeSearchHistory = function removeSearchHistory(data, scope, needOriginResponse) {

  const startName = 'removeSearchHistorystart';
  const endName = 'removeSearchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/removeSearchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeSearchHistory', startName, endName);

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

api.clearSearchHistory = function clearSearchHistory(data, scope, needOriginResponse) {

  const startName = 'clearSearchHistorystart';
  const endName = 'clearSearchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/clearSearchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('clearSearchHistory', startName, endName);

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
    axios.get('/user/getWatchHistory', data).then((response) => {

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

api.removeWatchHistory = function removeWatchHistory(data, scope, needOriginResponse) {

  const startName = 'removeWatchHistorystart';
  const endName = 'removeWatchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/removeWatchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('removeWatchHistory', startName, endName);

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

api.clearWatchHistory = function clearWatchHistory(data, scope, needOriginResponse) {

  const startName = 'clearWatchHistorystart';
  const endName = 'clearWatchHistoryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/clearWatchHistory', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('clearWatchHistory', startName, endName);

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

api.listJob = function listJob(data, scope, needOriginResponse) {

  const startName = 'listJobstart';
  const endName = 'listJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/listJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listJob', startName, endName);

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

api.listMyAuditJob = function listMyAuditJob(data, scope, needOriginResponse) {

  const startName = 'listMyAuditJobstart';
  const endName = 'listMyAuditJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/listMyAuditJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listMyAuditJob', startName, endName);

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

api.listAuditJob = function listAuditJob(data, scope, needOriginResponse) {

  const startName = 'listAuditJobstart';
  const endName = 'listAuditJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/listAuditJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listAuditJob', startName, endName);

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

api.passOrRejectAudit = function passOrRejectAudit(data, scope, needOriginResponse) {

  const startName = 'passOrRejectAuditstart';
  const endName = 'passOrRejectAuditend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/user/passOrRejectAudit', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('passOrRejectAudit', startName, endName);

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

api.queryJob = function queryJob(data, scope, needOriginResponse) {

  const startName = 'queryJobstart';
  const endName = 'queryJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/queryJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('queryJob', startName, endName);

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

api.restartJob = function restartJob(data, scope, needOriginResponse) {

  const startName = 'restartJobstart';
  const endName = 'restartJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/restartJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('restartJob', startName, endName);

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

api.stopJob = function stopJob(data, scope, needOriginResponse) {

  const startName = 'stopJobstart';
  const endName = 'stopJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/stopJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('stopJob', startName, endName);

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

api.deleteJob = function deleteJob(data, scope, needOriginResponse) {

  const startName = 'deleteJobstart';
  const endName = 'deleteJobend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/deleteJob', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('deleteJob', startName, endName);

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

api.directAuthorizeAcceptorList = function directAuthorizeAcceptorList(data, scope, needOriginResponse) {

  const startName = 'directAuthorizeAcceptorListstart';
  const endName = 'directAuthorizeAcceptorListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/directAuthorize/acceptorList', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('directAuthorizeAcceptorList', startName, endName);

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

api.listUserByDepartment = function listUserByDepartment(data, scope, needOriginResponse) {

  const startName = 'listUserByDepartmentstart';
  const endName = 'listUserByDepartmentend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/listUserByDepartment', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listUserByDepartment', startName, endName);

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

api.listUsableTemplate = function listUsableTemplate(data, scope, needOriginResponse) {

  const startName = 'listUsableTemplatestart';
  const endName = 'listUsableTemplateend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/user/listUsableTemplate', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listUsableTemplate', startName, endName);

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
