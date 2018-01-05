const api = {};
import { getItemFromLocalStorage } from '../../../common/utils';

import axios from 'axios';

const jswToken = getItemFromLocalStorage('jwtToken');

const axiosInstance = axios.create({
  baseURL: 'http://w2.phoenixtv.com/mamapi',
  withCredentials: true,
  headers: {
    common: {
      Authorization: `JWT ${jswToken}`
    }
  }
});

axiosInstance.interceptors.request.use((config) => {
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

api.getReport = function (data, scope) {
  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axiosInstance.post('/get_report', data).then((response) => {
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
