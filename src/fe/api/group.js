/**
 * Created by steven on 2017/7/24.
 */
import axios from 'axios';

const api = {};

axios.defaults.withCredentials = true;

axios.interceptors.request.use((config) => {
  // Do something before request is sent
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params.t = new Date().getTime();
  } else if (config.method === 'post') {
    config.data = config.data || {};
    config.data.t = new Date().getTime();
  }

  return config;
}, error =>
  // Do something with request error
  Promise.reject(error)
);

axios.interceptors.response.use((response) => {
  // Do something with response data
  const res = response.data;
  const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004'];
  if (loginStatusCodeArr.indexOf(res.status) !== -1) {
    window.location.href = '/login';
  }
  return response;
}, error =>
  // Do something with response error
  Promise.reject(error)
);

api.getGroupList = function getGroupList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/list', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getGroupDetail = function getGroupDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/getDetail', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postAddGroup = function postAddGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/add', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postDeleteGroup = function postDeleteGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/delete', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getGroupUserList = function getGroupUserList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/listUser', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getGroupUserDetail = function getGroupUserDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/userDetail', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postGroupAddUser = function postGroupAddUser(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/addUser', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postJustifyUserGroup = function postJustifyUserGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/justifyUserGroup', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postJustifyUserGroup = function postJustifyUserGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/justifyUserGroup', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postEnableGroupUser = function postEnableGroupUser(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/enableUser', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postGroupUpdateUser = function postGroupUpdateUser(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/updateUser', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getOwnerPermission = function getOwnerPermission(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/getOwnerPermission', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getOwnerEffectivePermission = function getOwnerEffectivePermission(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/getOwnerEffectivePermission', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postUpdateOwnerPermission = function postUpdateOwnerPermission(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/updateOwnerPermission', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.postUpdateGroupInfo = function postUpdateGroupInfo(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/group/updateGroupInfo', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

api.getGroupSearchUser = function getGroupSearchUser(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/group/searchUser', data)
      .then((response) => {
        const res = response.data;
        if (res.status === '0') {
          resolve(res);
        }
        reject(res.statusInfo.message);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

module.exports = api;
