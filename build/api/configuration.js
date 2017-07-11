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

module.exports = api;
