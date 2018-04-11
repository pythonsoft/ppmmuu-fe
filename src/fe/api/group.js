const api = {};
const axios = require('../config');

api.getGroupList = function getGroupList(data, scope, needOriginResponse) {

  const startName = 'getGroupListstart';
  const endName = 'getGroupListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/list', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupList', startName, endName);

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

api.getGroupDetail = function getGroupDetail(data, scope, needOriginResponse) {

  const startName = 'getGroupDetailstart';
  const endName = 'getGroupDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/getDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupDetail', startName, endName);

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

api.postAddGroup = function postAddGroup(data, scope, needOriginResponse) {

  const startName = 'postAddGroupstart';
  const endName = 'postAddGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/add', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postAddGroup', startName, endName);

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

api.postDeleteGroup = function postDeleteGroup(data, scope, needOriginResponse) {

  const startName = 'postDeleteGroupstart';
  const endName = 'postDeleteGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/delete', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteGroup', startName, endName);

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

api.getGroupUserList = function getGroupUserList(data, scope, needOriginResponse) {

  const startName = 'getGroupUserListstart';
  const endName = 'getGroupUserListend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/listUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupUserList', startName, endName);

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

api.getGroupUserDetail = function getGroupUserDetail(data, scope, needOriginResponse) {

  const startName = 'getGroupUserDetailstart';
  const endName = 'getGroupUserDetailend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/userDetail', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupUserDetail', startName, endName);

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

api.postGroupAddUser = function postGroupAddUser(data, scope, needOriginResponse) {

  const startName = 'postGroupAddUserstart';
  const endName = 'postGroupAddUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/addUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postGroupAddUser', startName, endName);

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

api.postDeleteGroupUser = function postDeleteGroupUser(data, scope, needOriginResponse) {

  const startName = 'postDeleteGroupUserstart';
  const endName = 'postDeleteGroupUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/deleteGroupUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postDeleteGroupUser', startName, endName);

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

api.postJustifyUserGroup = function postJustifyUserGroup(data, scope, needOriginResponse) {

  const startName = 'postJustifyUserGroupstart';
  const endName = 'postJustifyUserGroupend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/justifyUserGroup', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postJustifyUserGroup', startName, endName);

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

api.postEnableGroupUser = function postEnableGroupUser(data, scope, needOriginResponse) {

  const startName = 'postEnableGroupUserstart';
  const endName = 'postEnableGroupUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/enableUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postEnableGroupUser', startName, endName);

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

api.postGroupUpdateUser = function postGroupUpdateUser(data, scope, needOriginResponse) {

  const startName = 'postGroupUpdateUserstart';
  const endName = 'postGroupUpdateUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/updateUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postGroupUpdateUser', startName, endName);

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

api.getOwnerPermission = function getOwnerPermission(data, scope, needOriginResponse) {

  const startName = 'getOwnerPermissionstart';
  const endName = 'getOwnerPermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/getOwnerPermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getOwnerPermission', startName, endName);

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

api.getOwnerEffectivePermission = function getOwnerEffectivePermission(data, scope, needOriginResponse) {

  const startName = 'getOwnerEffectivePermissionstart';
  const endName = 'getOwnerEffectivePermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/getOwnerEffectivePermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getOwnerEffectivePermission', startName, endName);

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

api.postUpdateOwnerPermission = function postUpdateOwnerPermission(data, scope, needOriginResponse) {

  const startName = 'postUpdateOwnerPermissionstart';
  const endName = 'postUpdateOwnerPermissionend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/updateOwnerPermission', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateOwnerPermission', startName, endName);

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

api.postUpdateGroupInfo = function postUpdateGroupInfo(data, scope, needOriginResponse) {

  const startName = 'postUpdateGroupInfostart';
  const endName = 'postUpdateGroupInfoend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/updateGroupInfo', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postUpdateGroupInfo', startName, endName);

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

api.getGroupSearchUser = function getGroupSearchUser(data, scope, needOriginResponse) {

  const startName = 'getGroupSearchUserstart';
  const endName = 'getGroupSearchUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/group/searchUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('getGroupSearchUser', startName, endName);

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

api.postBindMediaExpressUser = function postBindMediaExpressUser(data, scope, needOriginResponse) {

  const startName = 'postBindMediaExpressUserstart';
  const endName = 'postBindMediaExpressUserend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/group/bindMediaExpressUser', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('postBindMediaExpressUser', startName, endName);

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
