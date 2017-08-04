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

api.getRoleList = function getRoleList (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/role/list', data).then((response) => {
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
 
 api.getRoleDetail = function getRoleDetail (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/role/getDetail', data).then((response) => {
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
 
 api.postAddRole = function postAddRole (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/add', data).then((response) => {
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
 
 api.postUpdateRole = function postUpdateRole (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/update', data).then((response) => {
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
 
 api.postUpdateRoleAddPermission = function postUpdateRoleAddPermission (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/updateRoleAddPermission', data).then((response) => {
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
 
 api.postUpdateRoleDeletePermission = function postUpdateRoleDeletePermission (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/updateRoleDeletePermission', data).then((response) => {
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
 
 api.postDeleteRole = function postDeleteRole (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/delete', data).then((response) => {
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
 
 api.getPermissionList = function getPermissionList (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/role/listPermission', data).then((response) => {
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
 
 api.postAssignRole = function postAssignRole (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/assignRole', data).then((response) => {
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
 
 api.postDeleteOwnerRole = function postDeleteOwnerRole (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/deleteOwnerRole', data).then((response) => {
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
 
 api.postEnablePermission = function postEnablePermission (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.post('http://localhost:8080/role/enablePermission', data).then((response) => {
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
 
 api.getRoleOwners = function getRoleOwners (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/role/getRoleOwners', data).then((response) => {
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
 
 api.getRoleSearchUserOrGroup = function getRoleSearchUserOrGroup (data, scope) {
  return new Promise((resolve, reject) => {
    if(scope) { scope.$progress.start(); }
    axios.get('http://localhost:8080/role/search/userOrGroup', data).then((response) => {
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
