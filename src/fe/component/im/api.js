import axios from 'axios';

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

const api = {};

api.login = function login(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://182.61.30.36:9999/api/timaccounts', data).then((response) => {
      if (!response) {
        reject('返回数据格式不正确');
        return false;
      }
      const res = response.data;
      if (res.status === '0') {
        return resolve(res);
      }
      return reject(res.statusInfo.message);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = api;
