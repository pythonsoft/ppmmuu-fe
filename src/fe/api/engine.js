import axios from 'axios';

const api = {};

api.listGroup = function listGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/engine/listGroup', data)
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
