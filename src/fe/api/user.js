import axios from 'axios';

const api = {};

api.postUserLogin = function postUserLogin(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/user/login', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postUserUpdate = function postUserUpdate(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/user/update', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getUserDetail = function getUserDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/user/detail', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postUserLogout = function postUserLogout(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/user/logout', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = api;
