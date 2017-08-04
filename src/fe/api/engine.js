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
  Promise.reject(typeof error === 'object' ? error.message ? error.message === 'Network Error' ? '网络连接出错，请检查网络是否连接正常' : error.message : '出错了' : error)
);

api.listGroup = function listGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/listGroup', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.addGroup = function addGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/addGroup', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.removeGroup = function removeGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/removeGroup', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.getGroup = function getGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/getGroup', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.updateGroup = function updateGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/updateGroup', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.listEngine = function listEngine (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/listEngine', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.addEngine = function addEngine (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/addEngine', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.getEngine = function getEngine (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/getEngine', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.updateEngine = function updateEngine (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/updateEngine', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.removeEngine = function removeEngine (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/removeEngine', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.updateEngineConfiguration = function updateEngineConfiguration (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/updateEngineConfiguration', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.listProcess = function listProcess (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/listProcess', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.listAction = function listAction (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/engine/listAction', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.emitAction = function emitAction (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/emitAction', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 api.installMonitor = function installMonitor (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/engine/installMonitor', data).then((response) => {
      if(!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        if(scope) { scope.$progress.finish(); }
        resolve(res)
      }
      if(scope) { scope.$progress.fail(); }
      reject(res.statusInfo.message);
    }).catch(error =>{
        if(scope) { scope.$progress.fail(); }
        reject(error);
     });
   });
 };
 
 module.exports = api;
