const api = {};
const axios = require('../config');

api.upload = function upload(param, config) {
  return new Promise((resolve, reject) => {
    axios.post('/upload', param, config).then((response) => {
      const res = response.data;
      if (res.status === '0') {
        resolve(res);
      }
      reject(res.statusInfo.message);
    }).catch((error) => {
      reject(error);
    });
  });
};

api.uploadWatermark = function uploadWatermark(param, config) {
  return new Promise((resolve, reject) => {
    axios.post('/upload/uploadWatermark', param, config).then((response) => {
      const res = response.data;
      if (res.status === '0') {
        resolve(res);
      }
      reject(res.statusInfo.message);
    }).catch((error) => {
      reject(error);
    });
  });
};

module.exports = api;
