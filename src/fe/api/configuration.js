/**
 * Created by steven on 2017/7/24.
 */
import axios from 'axios';

const api = {};

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
    Promise.reject(error)
);

api.postAddConfig = function postAddConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/add', data)
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

api.postUpdateConfig = function postUpdateConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/update', data)
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

api.getListConfig = function getListConfig(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/configuration/list', data)
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

api.postDeleteConfig = function postDeleteConfig(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/delete', data)
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

api.postAddGroup = function postAddGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/addGroup', data)
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

api.postUpdateGroup = function postUpdateGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/updateGroup', data)
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

api.getListGroup = function getListGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/configuration/listGroup', data)
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

api.postDeleteGroup = function postDeleteGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/configuration/deleteGroup', data)
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
