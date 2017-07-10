import axios from 'axios';
const api = {};

api.getGroupList = function getGroupList(data,cb) {
  axios.get('http://localhost:8080/group/list', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getAllChildGroupList = function getAllChildGroupList(data,cb) {
  axios.get('http://localhost:8080/group/listAllChildGroup', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getGroupDetail = function getGroupDetail(data,cb) {
  axios.get('http://localhost:8080/group/getDetail', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postAddGroup = function postAddGroup(data,cb) {
  axios.post('http://localhost:8080/group/add', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postUpdateGroup = function postUpdateGroup(data,cb) {
  axios.post('http://localhost:8080/group/update', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postDeleteGroup = function postDeleteGroup(data,cb) {
  axios.post('http://localhost:8080/group/delete', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.getGroupUserDetail = function getGroupUserDetail(data,cb) {
  axios.post('http://localhost:8080/group/userDetail', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postGroupAddUser = function postGroupAddUser(data,cb) {
  axios.post('http://localhost:8080/group/addUser', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

api.postGroupUpdateUser = function postGroupUpdateUser(data,cb) {
  axios.post('http://localhost:8080/group/updateUser', data)
    .then(function (res) {
      return cb && cb(null, res.data);
    })
    .catch(function (error) {
      return cb && cb(error);
    });
}

module.exports = api;
