import axios from 'axios';
const api = {};

api.getRoleList = function getRoleList(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/role/list', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getRoleDetail = function getRoleDetail(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/role/getDetail', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postAddRole = function postAddRole(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/add', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postUpdateRole = function postUpdateRole(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/update', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postUpdateRoleAddPermission = function postUpdateRoleAddPermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/updateRoleAddPermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postUpdateRoleDeletePermission = function postUpdateRoleDeletePermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/updateRoleDeletePermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postDeleteRole = function postDeleteRole(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/delete', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getPermissionList = function getPermissionList(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/role/listPermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          console.log("afasfasgasg");
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postAssignRole = function postAssignRole(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/assignRole', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postDeleteOwnerRole = function postDeleteOwnerRole(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/deleteOwnerRole', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.postEnablePermission = function postEnablePermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/role/enablePermission', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getRoleOwners = function getRoleOwners(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/role/getRoleOwners', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

api.getRoleSearchUserOrGroup = function getRoleSearchUserOrGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/role/search/userOrGroup', data)
      .then(function (response) {
        const res = response.data;
        if(res.status === '0'){
          resolve(res);
        }
        else{
          me.$message.error(res.statusInfo.message);
        }
      })
      .catch(function (error) {
        me.$message.error(error);
      });
  })
}

module.exports = api;
