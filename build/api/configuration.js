import axios from 'axios';
const api = {};

api.postAddConfig = function postAddConfig(data) {
  axios.post('http://localhost:8080/configuration/add', data);
}

api.postUpdateConfig = function postUpdateConfig(data) {
  axios.post('http://localhost:8080/configuration/update', data);
}

module.exports = api;
