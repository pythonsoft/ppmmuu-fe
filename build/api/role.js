import axios from 'axios';
const api = {};

api.getRoleList = function getRoleList(data) {
  axios.get('http://localhost:8080/role/list', data);
}

api.getRoleDetail = function getRoleDetail(data) {
  axios.get('http://localhost:8080/role/getDetail', data);
}

api.postAddRole = function postAddRole(data) {
  axios.post('http://localhost:8080/role/add', data);
}

api.postUpdateRole = function postUpdateRole(data) {
  axios.post('http://localhost:8080/role/update', data);
}

api.postDeleteRole = function postDeleteRole(data) {
  axios.post('http://localhost:8080/role/delete', data);
}

api.getPermissionList = function getPermissionList(data) {
  axios.get('http://localhost:8080/role/listPermission', data);
}

api.postAssignRole = function postAssignRole(data) {
  axios.post('http://localhost:8080/role/assignRole', data);
}

api.postEnablePermission = function postEnablePermission(data) {
  axios.post('http://localhost:8080/role/enablePermission', data);
}

api.getUserOrDepartmentRoleAndPermissions = function getUserOrDepartmentRoleAndPermissions(data) {
  axios.post('http://localhost:8080/role/getUserOrDepartmentRoleAndPermissions', data);
}

module.exports = api;
