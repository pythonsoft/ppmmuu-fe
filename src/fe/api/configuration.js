/**
 * Created by steven on 2017/7/24.
 */
import axios from 'axios';

const api = {};         //eslint-disable-line

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  // Do something before request is sent
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params.t = new Date().getTime();
  } else if (config.method === 'post') {
    config.data = config.data || {};
    config.data.t = new Date().getTime();
  }

  return config;
}, error =>
  // Do something with request error
  Promise.reject(error)
);

axios.interceptors.response.use((response) => {
  // Do something with response data
  const res = response.data;
  const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004'];
  if (loginStatusCodeArr.indexOf(res.status) !== -1) {
    window.location.href = '/login';
  }
  return response;
}, error =>
  // Do something with response error
  /* eslint-disable no-nested-ternary */
  Promise.reject(typeof error === 'object' ? error.message ? error.message === 'Network Error' ? '网络连接出错，请检查网络是否连接正常' : error.message : '出错了' : error)
  /* eslint-enable no-nested-ternary */
);

api.postAddConfig = function postAddConfig(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/add', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.postUpdateConfig = function postUpdateConfig(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/update', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getListConfig = function getListConfig(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/configuration/list', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.postDeleteConfig = function postDeleteConfig(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/delete', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.postAddGroup = function postAddGroup(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/addGroup', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.postUpdateGroup = function postUpdateGroup(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/updateGroup', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.getListGroup = function getListGroup(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/configuration/listGroup', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.postDeleteGroup = function postDeleteGroup(data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/configuration/deleteGroup', data).then((response) => {
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
      return reject(res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

module.exports = api;
