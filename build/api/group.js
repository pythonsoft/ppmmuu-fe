import axios from 'axios';
const api = {};

api.getGroupList = function getGroupList(data) {
  axios.get('http://localhost:8080/group/list', data);
}

api.getAllChildGroupList = function getAllChildGroupList(data) {
  axios.get('http://localhost:8080/group/listAllChildGroup', data);
}

api.getGroupDetail = function getGroupDetail(data) {
  axios.get('http://localhost:8080/group/getDetail', data);
}

api.postAddGroup = function postAddGroup(data) {
  axios.post('http://localhost:8080/group/add', data);
}

api.postUpdateGroup = function postUpdateGroup(data) {
  axios.post('http://localhost:8080/group/update', data);
}

api.postDeleteGroup = function postDeleteGroup(data) {
  axios.post('http://localhost:8080/group/delete', data);
}

api.getGroupUserDetail = function getGroupUserDetail(data) {
  axios.post('http://localhost:8080/group/userDetail', data);
}

api.postGroupAddUser = function postGroupAddUser(data) {
  axios.post('http://localhost:8080/group/addUser', data);
}

api.postGroupUpdateUser = function postGroupUpdateUser(data) {
  axios.post('http://localhost:8080/group/updateUser', data);
}

module.exports = api;
