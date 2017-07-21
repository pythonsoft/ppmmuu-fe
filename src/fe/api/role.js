import axios from 'axios';
axios.defaults.withCredentials = true

const api = {};

api.getRoleList = function getRoleList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/list', data)
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

api.getRoleDetail = function getRoleDetail(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/getDetail', data)
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

api.postAddRole = function postAddRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/add', data)
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

api.postUpdateRole = function postUpdateRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/update', data)
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

api.postUpdateRoleAddPermission = function postUpdateRoleAddPermission(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/updateRoleAddPermission', data)
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

api.postUpdateRoleDeletePermission = function postUpdateRoleDeletePermission(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/updateRoleDeletePermission', data)
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

api.postDeleteRole = function postDeleteRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/delete', data)
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

api.getPermissionList = function getPermissionList(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/listPermission', data)
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

api.postAssignRole = function postAssignRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/assignRole', data)
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

api.postDeleteOwnerRole = function postDeleteOwnerRole(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/deleteOwnerRole', data)
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

api.postEnablePermission = function postEnablePermission(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/role/enablePermission', data)
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

api.getRoleOwners = function getRoleOwners(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/getRoleOwners', data)
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

api.getRoleSearchUserOrGroup = function getRoleSearchUserOrGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/role/search/userOrGroup', data)
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
