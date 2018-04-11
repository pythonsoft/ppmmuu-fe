const api = {};
const axios = require('../config');

api.getRoleList = function getRoleList(data, scope, needOriginResponse) {

  const startName = 'getRoleListstart';
  const endName = 'getRoleListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getRoleList', startName, endName);

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

api.getRoleDetail = function getRoleDetail(data, scope, needOriginResponse) {

  const startName = 'getRoleDetailstart';
  const endName = 'getRoleDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/getDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getRoleDetail', startName, endName);

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

api.postAddRole = function postAddRole(data, scope, needOriginResponse) {

  const startName = 'postAddRolestart';
  const endName = 'postAddRoleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/add', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postAddRole', startName, endName);

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

api.postUpdateRole = function postUpdateRole(data, scope, needOriginResponse) {

  const startName = 'postUpdateRolestart';
  const endName = 'postUpdateRoleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/update', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateRole', startName, endName);

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

api.postUpdateRoleAddPermission = function postUpdateRoleAddPermission(data, scope, needOriginResponse) {

  const startName = 'postUpdateRoleAddPermissionstart';
  const endName = 'postUpdateRoleAddPermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/updateRoleAddPermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateRoleAddPermission', startName, endName);

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

api.postUpdateRoleDeletePermission = function postUpdateRoleDeletePermission(data, scope, needOriginResponse) {

  const startName = 'postUpdateRoleDeletePermissionstart';
  const endName = 'postUpdateRoleDeletePermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/updateRoleDeletePermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateRoleDeletePermission', startName, endName);

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

api.postDeleteRole = function postDeleteRole(data, scope, needOriginResponse) {

  const startName = 'postDeleteRolestart';
  const endName = 'postDeleteRoleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/delete', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteRole', startName, endName);

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

api.getPermissionList = function getPermissionList(data, scope, needOriginResponse) {

  const startName = 'getPermissionListstart';
  const endName = 'getPermissionListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/listPermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getPermissionList', startName, endName);

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

api.postAssignRole = function postAssignRole(data, scope, needOriginResponse) {

  const startName = 'postAssignRolestart';
  const endName = 'postAssignRoleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/assignRole', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postAssignRole', startName, endName);

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

api.postDeleteOwnerRole = function postDeleteOwnerRole(data, scope, needOriginResponse) {

  const startName = 'postDeleteOwnerRolestart';
  const endName = 'postDeleteOwnerRoleend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/deleteOwnerRole', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteOwnerRole', startName, endName);

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

api.postEnablePermission = function postEnablePermission(data, scope, needOriginResponse) {

  const startName = 'postEnablePermissionstart';
  const endName = 'postEnablePermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/role/enablePermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postEnablePermission', startName, endName);

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

api.getRoleOwners = function getRoleOwners(data, scope, needOriginResponse) {

  const startName = 'getRoleOwnersstart';
  const endName = 'getRoleOwnersend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/getRoleOwners', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getRoleOwners', startName, endName);

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

api.getRoleSearchUserOrGroup = function getRoleSearchUserOrGroup(data, scope, needOriginResponse) {

  const startName = 'getRoleSearchUserOrGroupstart';
  const endName = 'getRoleSearchUserOrGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/search/userOrGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getRoleSearchUserOrGroup', startName, endName);

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

api.listPermissionGroup = function listPermissionGroup(data, scope, needOriginResponse) {

  const startName = 'listPermissionGroupstart';
  const endName = 'listPermissionGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/role/listPermissionGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('listPermissionGroup', startName, endName);

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
