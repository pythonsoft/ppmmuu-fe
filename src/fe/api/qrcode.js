const api = {};
const axios = require('../config');

api.qrcodeQuery = function qrcodeQuery(data, scope, needOriginResponse) {

  const startName = 'qrcodeQuerystart';
  const endName = 'qrcodeQueryend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/qrcode/query', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('qrcodeQuery', startName, endName);

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
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.qrcodeLogin = function qrcodeLogin(data, scope, needOriginResponse) {

  const startName = 'qrcodeLoginstart';
  const endName = 'qrcodeLoginend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/qrcode/login', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('qrcodeLogin', startName, endName);

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
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

api.qrcodeScan = function qrcodeScan(data, scope, needOriginResponse) {

  const startName = 'qrcodeScanstart';
  const endName = 'qrcodeScanend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.get('/qrcode/scan', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('qrcodeScan', startName, endName);

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
      return reject(needOriginResponse ? res : res.statusInfo.message);
    }).catch((error) => {
      if (scope) { scope.$progress.fail(); }
      reject(error);
    });
  });
};

module.exports = api;
