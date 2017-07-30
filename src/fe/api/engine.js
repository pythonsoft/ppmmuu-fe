/**
 * Created by steven on 2017/7/24.
 */
import axios from 'axios';

const api = {};         //eslint-disable-line

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

api.listGroup = function listGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/engine/listGroup', data)
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

api.addGroup = function addGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/addGroup', data)
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

api.removeGroup = function removeGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/removeGroup', data)
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

api.getGroup = function getGroup(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/engine/getGroup', data)
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

api.updateGroup = function updateGroup(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/updateGroup', data)
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

api.listEngine = function listEngine(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/engine/listEngine', data)
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

api.addEngine = function addEngine(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/addEngine', data)
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

api.getEngine = function getEngine(data) {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8080/engine/getEngine', data)
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

api.updateEngine = function updateEngine(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/updateEngine', data)
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

api.removeEngine = function removeEngine(data) {
  return new Promise((resolve, reject) => {
    axios.post('http://localhost:8080/engine/removeEngine', data)
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
