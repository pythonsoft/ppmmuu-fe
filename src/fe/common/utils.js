import axios from 'axios';
const utils = {};

axios.defaults.withCredentials = true

axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.url += "?t=" + new Date().getTime();
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

axios.interceptors.response.use(function (response) {
  // Do something with response data
  const res = response.data;
  const loginStatusCodeArr = ['-3001', '-3002', '-3003', '-3004']
  if(loginStatusCodeArr.indexOf(res.status) !== -1){
    window.location.href= '/login';
  }
  return response;
}, function (error) {
  // Do something with response error
  return Promise.reject(error);
});

utils.formatQuery = function formatQuery(obj, isGet = false) {
  return isGet ? { params: obj } : obj;
};

utils.deepClone = function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
};

/**
 * @description 去重合并
 * @param arr1
 * @param arr2
 * @returns []
 */
utils.hardMerge = function hardMerge(arr1, arr2) {
  for (let i = 0; i < arr1.length; i++) {
    for (let j = 0; j < arr2.length; j++) {
      if (arr1[i] === arr2[j]) {
        arr1.splice(i, 1);
      }
    }
  }
  for (let i = 0; i < arr2.length; i++) {
    arr1.push(arr2[i]);
  }
  return arr1;
};

function transferDataToTree(data, keyName) {
  keyName = keyName || '_id';

  const format = function (d) {
    if (d && d.constructor && d.constructor === Array) {
      if (d.length === 0 || (typeof d[0] !== 'object')) {
        return d;
      }
      const rs = { indexs: [], infos: {} };
      let index = '';
      for (let i = 0, len = d.length; i < len; i++) {
        if (typeof d[i][keyName] === 'undefined') {
          index = `${i + 1}`;
        } else {
          index = d[i][keyName];
        }

        rs.indexs.push(index);
        rs.infos[index] = transferDataToTree(d[i], keyName);
      }
      return rs;
    }
    return d;
  };

  let newData = {};

  if (data.constructor === Array) {
    newData = format(data);
  } else if (data.constructor === Object) {
    const keys = Object.keys(data);
    for (let i = 0; i < keys.length; i++) {
      newData[keys[i]] = format(data[keys[i]]);
    }
  } else {
    newData = data;
  }
  return newData;
}

utils.transferDataToTree = transferDataToTree;

utils.formatTree = function formatTree(list, keyName) {
  if (list.length === 0) {
    return ({ topNode: '', node: {} });
  }
  keyName = keyName || '_id';
  let topNode = '';
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === 2) {
      topNode = list[i][keyName];
      break;
    }
  }
  return ({ topNode: topNode, node: transferDataToTree(list, keyName).infos });
};

utils.checkEmail = function checkEmail(email) {
  if ((email.length > 128) || (email.length < 6)) {
    return false;
  }
  return !!email.match(/^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/);
};

utils.checkPhone = function checkPhone(phone) {
  if (phone.length !== 11) {
    return false;
  }
  if (/^1[34578]\d{9}$/.test(phone) === false) {
    return false;
  }
  return true;
};

/**
 * 2-20位有效字符
 * @param name
 * @returns {boolean}
 */
utils.checkVipName = function checkVipName(name) {
  return /^[0-9a-zA-Z_\u4e00-\u9fa5]{2,20}$/.test(name);
};

utils.checkPassword = function checkPassword(password) {
  return /^[0-9a-zA-Z_]{6,20}$/.test(password);
};

module.exports = utils;
