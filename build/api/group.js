import axios from 'axios';
const api = {};

api.getGroupList = function getGroupList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/list', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getAllChildGroupList = function getAllChildGroupList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/listAllChildGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getGroupDetail = function getGroupDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/getDetail', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postAddGroup = function postAddGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/add', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postUpdateGroup = function postUpdateGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/update', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postDeleteGroup = function postDeleteGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/delete', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getGroupUserDetail = function getGroupUserDetail(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/userDetail', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postGroupAddUser = function postGroupAddUser(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/addUser', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postGroupUpdateUser = function postGroupUpdateUser(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/updateUser', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

module.exports = api;
