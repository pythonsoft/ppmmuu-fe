import axios from 'axios';
const api = {};

api.postAddConfig = function postAddConfig(data,cb) {
  axios.post('http://localhost:8080/configuration/add', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postUpdateConfig = function postUpdateConfig(data,cb) {
  axios.post('http://localhost:8080/configuration/update', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

module.exports = api;
