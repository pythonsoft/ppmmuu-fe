import axios from 'axios';
const api = {};

api.postUserLogin = function postUserLogin(data,cb) {
  axios.post('http://localhost:8080/user/login', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

module.exports = api;
