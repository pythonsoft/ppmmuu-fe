import axios from 'axios';
const api = {};

api.getRoleList = function getRoleList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/list', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getRoleDetail = function getRoleDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/getDetail', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postAddRole = function postAddRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/add', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postUpdateRole = function postUpdateRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/update', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postDeleteRole = function postDeleteRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/delete', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getPermissionList = function getPermissionList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/listPermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postAssignRole = function postAssignRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/assignRole', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postDeleteOwnerRole = function postDeleteOwnerRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/deleteOwnerRole', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.postEnablePermission = function postEnablePermission(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/enablePermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getUserOrDepartmentRoleAndPermissions = function getUserOrDepartmentRoleAndPermissions(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/getUserOrDepartmentRoleAndPermissions', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

api.getRoleOwners = function getRoleOwners(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/getRoleOwners', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch(function (error) {
        reject(error);
      });
  })
}

module.exports = api;
