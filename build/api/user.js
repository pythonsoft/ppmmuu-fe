import axios from 'axios';
const api = {};

api.postUserLogin = function postUserLogin(data) {
  axios.post('http://localhost:8080/user/login', data);
}

module.exports = api;
