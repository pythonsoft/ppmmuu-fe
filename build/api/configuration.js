import axios from 'axios';
const api = {};

api.postAddConfig = function postAddConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/add', data)
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

api.postUpdateConfig = function postUpdateConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/update', data)
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

api.getListConfig = function getListConfig(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/configuration/list', data)
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

api.postDeleteConfig = function postDeleteConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/delete', data)
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
    axios.post('http://localhost:8080/configuration/addGroup', data)
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
    axios.post('http://localhost:8080/configuration/updateGroup', data)
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

api.getListGroup = function getListGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/configuration/listGroup', data)
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
    axios.post('http://localhost:8080/configuration/deleteGroup', data)
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
