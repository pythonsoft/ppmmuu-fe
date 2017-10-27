/**
 * Created by steven on 2017/8/4.
 */
import axios from 'axios';

axios.defaults.withCredentials = true;

axios.defaults.jobApi = 'http://10.0.15.80:8080';

axios.defaults.baseURL = 'http://localhost:8080';
// axios.defaults.baseURL = 'http://10.0.16.125:8080';

// axios.defaults.streamURL = 'http://localhost:8080';
axios.defaults.streamURL = 'http://ump-live.phoenixtv.com';

if (window.location.hostname.indexOf('phoenixtv.com') !== -1) {
  axios.defaults.baseURL = 'http://ump-api.phoenixtv.com';
}

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
  const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004', '-3005'];
  if (loginStatusCodeArr.indexOf(res.status) !== -1 && response.config.url.indexOf('/user/auth') === -1) {
    window.location.href = '/login';
  }
  return response;
}, error =>
  // Do something with response error
  /* eslint-disable no-nested-ternary */
  Promise.reject(typeof error === 'object' ? error.message ? error.message === 'Network Error' ? '网络连接出错，请检查网络是否连接正常' : error.message : '出错了' : error)
  /* eslint-enable no-nested-ternary */
);

module.exports = axios;
