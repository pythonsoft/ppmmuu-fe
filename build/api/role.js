import axios from 'axios';
const api = {};

api.getRoleList = function getRoleList(data,cb) {
  axios.get('http://10.0.15.105:8080/role/list', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getRoleDetail = function getRoleDetail(data,cb) {
  axios.get('http://10.0.15.105:8080/role/getDetail', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postAddRole = function postAddRole(data,cb) {
  axios.post('http://10.0.15.105:8080/role/add', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postUpdateRole = function postUpdateRole(data,cb) {
  axios.post('http://10.0.15.105:8080/role/update', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postDeleteRole = function postDeleteRole(data,cb) {
  axios.post('http://10.0.15.105:8080/role/delete', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getPermissionList = function getPermissionList(data,cb) {
  axios.get('http://10.0.15.105:8080/role/listPermission', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postAssignRole = function postAssignRole(data,cb) {
  axios.post('http://10.0.15.105:8080/role/assignRole', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postEnablePermission = function postEnablePermission(data,cb) {
  axios.post('http://10.0.15.105:8080/role/enablePermission', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getUserOrDepartmentRoleAndPermissions = function getUserOrDepartmentRoleAndPermissions(data,cb) {
  axios.post('http://10.0.15.105:8080/role/getUserOrDepartmentRoleAndPermissions', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

module.exports = api;
