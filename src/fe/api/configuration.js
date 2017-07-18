import axios from 'axios';
const api = {};

api.postAddConfig = function postAddConfig(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/add', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postUpdateConfig = function postUpdateConfig(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/update', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getListConfig = function getListConfig(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/configuration/list', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postDeleteConfig = function postDeleteConfig(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/delete', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postAddGroup = function postAddGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/addGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postUpdateGroup = function postUpdateGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/updateGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getListGroup = function getListGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/configuration/listGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postDeleteGroup = function postDeleteGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/configuration/deleteGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

module.exports = api;
