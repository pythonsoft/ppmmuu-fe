import axios from 'axios';
const api = {};

api.getGroupList = function getGroupList(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/list', data)
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

api.getGroupDetail = function getGroupDetail(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/getDetail', data)
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

api.postAddGroup = function postAddGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/add', data)
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

api.postUpdateGroup = function postUpdateGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/update', data)
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

api.postDeleteGroup = function postDeleteGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/delete', data)
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

api.getGroupUserList = function getGroupUserList(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/listUser', data)
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

api.getGroupUserDetail = function getGroupUserDetail(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/userDetail', data)
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

api.postGroupAddUser = function postGroupAddUser(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/addUser', data)
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

api.postJustifyUserGroup = function postJustifyUserGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/justifyUserGroup', data)
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

api.postJustifyUserGroup = function postJustifyUserGroup(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/justifyUserGroup', data)
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

api.postEnableGroupUser = function postEnableGroupUser(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/enableUser', data)
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

api.postGroupUpdateUser = function postGroupUpdateUser(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/updateUser', data)
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

api.getOwnerPermission = function getOwnerPermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/getOwnerPermission', data)
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

api.getOwnerEffectivePermission = function getOwnerEffectivePermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/getOwnerEffectivePermission', data)
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

api.postUpdateOwnerPermission = function postUpdateOwnerPermission(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/updateOwnerPermission', data)
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

api.postUpdateGroupInfo = function postUpdateGroupInfo(data, me) {
  return new Promise((resolve, reject) => {
    axios.post('http://10.0.15.105:8080/group/updateGroupInfo', data)
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

api.getGroupSearchUser = function getGroupSearchUser(data, me) {
  return new Promise((resolve, reject) => {
    axios.get('http://10.0.15.105:8080/group/searchUser', data)
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
