const api = {};
const axios = require('../config');

api.workflow_instance_create = function workflow_instance_create(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/workflow/instance/create', data).then((response) => {
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

api.workflow_instance_detail = function workflow_instance_detail(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/workflow/instance/detail', data).then((response) => {
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

api.workflow_instance_list = function workflow_instance_list(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/workflow/instance/list', data).then((response) => {
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

api.workflow_instance_log_list = function workflow_instance_log_list(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/workflow/instance/log/list', data).then((response) => {
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

api.workflow_definition_list = function workflow_definition_list(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/workflow/definition/list', data).then((response) => {
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

api.workflow_definition_create = function workflow_definition_create(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/workflow/definition/create', data).then((response) => {
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

api.workflow_definition_update = function workflow_definition_update(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/workflow/definition/update', data).then((response) => {
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

api.workflow_definition_detail = function workflow_definition_detail(data, scope, needOriginResponse) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/workflow/definition/detail', data).then((response) => {
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
