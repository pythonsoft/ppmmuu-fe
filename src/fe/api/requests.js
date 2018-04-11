const api = {};
const axios = require('../config');

api.sendRequests = function sendRequests(data, scope, needOriginResponse) {

  const startName = 'sendRequestsstart';
  const endName = 'sendRequestsend';
  window.performance.mark(startName);

  return new Promise((resolve, reject) => {
    if (scope) { scope.$progress.start(); }
    axios.post('/requests', data).then((response) => {

      window.performance.mark(endName);
      window.performance.measure('sendRequests', startName, endName);

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
