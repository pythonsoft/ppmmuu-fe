const utils = {};

const mediaAPI = require('../api/media');
const config = require('../config');

utils.fillupZero = function (v) {
  return v < 10 ? `0${v}` : v;
};
utils.formatQuery = function formatQuery(obj, isGet = false) {
  return isGet ? {
    params: obj
  } : obj;
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

utils.merge = function merge(source, target) {
  if (utils.isEmptyObject(target)) { return source; }
  if (utils.isEmptyObject(source)) {
    if (typeof source === 'string') {
      return '';
    }

    return {};
  }

  const s = Object.assign({}, source);
  const keys = Object.keys(s);
  for (let i = 0, len = keys.length; i < len; i++) {
    if (target[keys[i]]) {
      s[keys[i]] = target[keys[i]];
    }
  }

  return s;
};

utils.isIP = function isIP(strIP) {
  if (!(strIP)) return false;
  const re = /^(\d+)\.(\d+)\.(\d+)\.(\d+)$/g;
  if (re.test(strIP)) {
    if (RegExp.$1 < 256 && RegExp.$2 < 256 && RegExp.$3 < 256 && RegExp.$4 < 256) return true;
  }
  return false;
};

function transferDataToTree(data, keyName) {
  keyName = keyName || '_id';

  const format = function (d) {
    if (d && d.constructor && d.constructor === Array) {
      if (d.length === 0 || (typeof d[0] !== 'object')) {
        return d;
      }
      const rs = {
        indexs: [],
        infos: {}
      };
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

/**
 *
 * @param treeData array
 * @param data array 通过parentId去后台获取的数据
 * @param parentId
 * @param key
 * @returns {*}
 */
utils.getTree = function getTree(treeData, data, parentId = '', key = '_id') {
  let flag = 0;
  const loopTree = function loopTree(tree) {
    if (flag === 1) {
      return;
    }
    for (let i = 0, len = tree.length; i < len; i++) {
      if (tree[i][key] === parentId) {
        tree[i].children = data;
        flag = 1;
        break;
      }
      if (tree[i].children && tree[i].children.length) {
        loopTree(tree[i].children);
      }
    }
  };

  if (parentId) {
    loopTree(treeData);
  } else {
    treeData = data;
  }

  return treeData;
};

/**
 *
 * @param treeData
 * @param treeNodeId
 * @param key
 */
utils.getTreeNode = function getTreeNode(treeData, treeNodeId, key = '_id') {
  let flag = 0;
  let treeNode = null;
  const loopTree = function loopTree(tree) {
    if (flag === 1) {
      return;
    }
    for (let i = 0, len = tree.length; i < len; i++) {
      if (tree[i][key] === treeNodeId) {
        treeNode = tree[i];
        flag = 1;
        break;
      } else if (tree[i].children && tree[i].children.length) {
        loopTree(tree[i].children);
      }
    }
  };
  if (!treeNodeId) {
    return treeNode;
  }
  loopTree(treeData);
  return treeNode;
};

utils.formatTree = function formatTree(list, keyName = '_id', topNodeType = 2) {
  if (list.length === 0) {
    return ({ topNode: [], node: {} });
  }
  const topNode = [];
  for (let i = 0; i < list.length; i++) {
    if (list[i].type === topNodeType) {
      topNode.push(list[i][keyName]);
    }
  }
  return ({
    topNode: topNode,
    node: transferDataToTree(list, keyName).infos
  });
};

utils.transferDataToFP = function transferDataToFP(data, keyName) {
  keyName = keyName || '_id';

  const format = function (d) {
    if (d && d.constructor && d.constructor === Array) {
      const rs = { indexs: [], infos: {} };
      let index = '';
      for (let i = 0, len = d.length; i < len; i++) {
        if (typeof d[i][keyName] === 'undefined') {
          index = `${i + 1}`;
        } else {
          index = d[i][keyName];
        }

        rs.indexs.push(index);
        rs.infos[index] = transferDataToFP(d[i], keyName);
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
    for (let i = 0, len = keys.length; i < len; i++) {
      newData[keys[i]] = format(data[keys[i]]);
    }
  } else {
    newData = data;
  }

  return newData;
};

utils.checkEmail = function checkEmail(email) {
  if ((email.length > 128) || (email.length < 6)) {
    return false;
  }
  return !!email.match(/^[A-Za-z0-9+]+[A-Za-z0-9\.\_\-+]*@([A-Za-z0-9\-]+\.)+[A-Za-z0-9]+$/); //eslint-disable-line
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

utils.isEmptyObject = function isEmptyObject(obj) {
  if (obj === null || typeof obj === 'undefined') return true;

  if (obj.constructor === Array) {
    return obj.length === 0;
  }

  if (Object.keys(obj).length === 0) {
    return true;
  }

  return false;
};

/**
 *
 * @param str 比如"30分钟内","2小时内"
 * @returns {*}
 */
utils.getTimeByStr = function getTimeByStr(str) {
  str = str.trim();
  if (str.indexOf('分钟') !== -1) {
    return str[0] * 60 * 25;
  } else if (str.indexOf('小时') !== -1) {
    return str[0] * 60 * 60 * 25;
  }
  return '*';
};

utils.getTextByValue = function getTextByValue(col, v, st) {
  let text = '';
  const target = col[st];
  const keys = Object.keys(target);

  for (let i = 0, len = keys.length; i < len; i++) {
    if (target[keys[i]].value === v) {
      text = target[keys[i]].text;
      break;
    }
  }

  return text;
};

const isDate = function (date) {
  if (date === undefined || date === null) return false;
  return !isNaN(new Date(date).getTime());
};
const toDate = function (date) {
  return isDate(date) ? new Date(date) : null;
};
const fillupZero = function (v) {
  return v < 10 ? `0${v}` : v;
};

utils.formatTime = function (date, format = 'YYYY-MM-DD HH:mm:ss') {
  date = toDate(date);
  if (!date) return '';
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  const secs = date.getSeconds();

  let result = format;
  result = result.replace(/YYYY/, year);
  result = result.replace(/MM/, fillupZero(month));
  result = result.replace(/DD/, fillupZero(day));
  result = result.replace(/HH/, fillupZero(hours));
  result = result.replace(/mm/, fillupZero(minutes));
  result = result.replace(/ss/, fillupZero(secs));
  return result;
};

/**
 *
 * @param duration 毫秒
 * @returns {string}
 */
utils.formatDuration = function formatDuration(duration) {
  const hours = Math.floor(duration / (60 * 60 * 1000));
  duration %= (60 * 60 * 1000);
  const minutes = Math.floor(duration / (60 * 1000));
  duration %= 60 * 1000;
  const seconds = Math.floor(duration / 1000);
  return `${fillupZero(hours)}:${fillupZero(minutes)}:${fillupZero(seconds)}`;
};

utils.transformSecondsToStr = function (time = 0, format = 'HH:mm:ss:ff', fps = 25) {
  if (time < 0) time = 0;
  const hours = Math.floor(time / (60 * 60));
  time %= (60 * 60);
  const minutes = Math.floor(time / 60);
  time %= 60;
  const seconds = Math.floor(time);
  let frame = (time % 1) * fps;
  frame = frame % 1 > 0.9 ? frame + 1 : frame;
  frame = Math.floor(frame);

  let result = format;
  result = result.replace(/HH/, fillupZero(hours));
  result = result.replace(/mm/, fillupZero(minutes));
  result = result.replace(/ss/, fillupZero(seconds));
  result = result.replace(/ff/, fillupZero(frame));

  return result;
};

utils.formatSize = function formatSize(size) {
  let str = '';
  if (size < 1000) {
    str = `${size} Bytes`;
  } else if (size < 1000 * 1000) {
    str = `${Math.round(100 * (size / 1024)) / 100} KB`;
  } else if (size < 1000 * 1000 * 1000) {
    str = `${Math.round(100 * (size / (1024 * 1024))) / 100} MB`;
  } else {
    str = `${Math.round(100 * (size / (1024 * 1024 * 1024))) / 100} GB`;
  }
  return str;
};

utils.formatContent = function formatContent(content) {
  if (!content) { return ''; }
  content = content.replace(/</gm, '&lt;');
  content = content.replace(/>/gm, '&gt;');
  content = content.replace(/\n/gm, '<br/>');
  return content;
};

utils.getStringLength = function getStringLength(str) {
  const len = str.length;

  let realLength = 0;
  let charCode = -1;

  for (let i = 0; i < len; i++) {
    charCode = str.charCodeAt(i);
    if (charCode >= 0 && charCode <= 128) {
      realLength += 1;
    } else {
      realLength += 2;
    }
  }

  return realLength;
};

utils.appendToBody = function appendToBody(el) {
  document.body.appendChild(el);
};

utils.getPosition = function getPosition(ele, oRefer) {
  // oRefer是定位参照物。可以不写，不写就是和浏览器的绝对位置
  // 注意：oRefer必须是ele的offset祖先，要不然取到的值是ele距离body的绝对偏移量

  oRefer = oRefer || document.body;
  let x = ele.offsetLeft;
  let y = ele.offsetTop;
  let p = ele.offsetParent;

  while (p !== oRefer && p !== document.body) {
    if (window.navigator.userAgent.indexOf('MSIE 8.0') > -1) {
      x += p.offsetLeft;
      y += p.offsetTop;
    } else {
      x += p.offsetLeft + p.clientLeft;
      y += p.offsetTop + p.clientTop;
    }

    p = p.offsetParent;
  }

  return { x, y };
};

function formatSRTTime(timeStr = '00:00:00,00', fps = 25) {
  let timeArr = timeStr.split(',');
  let seconds = Number(timeArr[1]) / fps;
  timeArr = timeArr[0].split(':');
  seconds += Number(timeArr[2]);
  seconds += Number(timeArr[1]) * 60;
  seconds += Number(timeArr[0]) * 60 * 60;
  return seconds;
}

utils.getSRT = function (objectId, cb, scope, fps = 25) {
  mediaAPI.xml2srt({ params: { objectid: objectId } }, scope).then((res) => {
    const tempArr = res.data.split('\n\n');
    tempArr.pop();
    const data = tempArr.map((str) => {
      const item = {};
      const tempStrArr = str.split('\n');
      item.text = tempStrArr[2];
      const durationArr = tempStrArr[1].split(' --> ');
      item.start = formatSRTTime(durationArr[0], fps);
      item.end = formatSRTTime(durationArr[1], fps);
      return item;
    });
    cb && cb(null, data, res);
  }).catch((error) => {
    cb && cb(error);
  });
};

utils.getStreamURL = function getStreamURL(objectId, cb, scope) {
  mediaAPI.getStream({ params: { objectid: objectId } }, scope).then((res) => {
    let dateString = res.result.UNCPATH;
    const fileName = res.result.FILENAME;

    if (dateString) {
      dateString = dateString.replace('\\', '\\\\').match(/\\\d{4}\\\d{2}\\\d{2}/g);
      if (dateString.length === 1) {
        dateString = dateString[0].replace(/\\/g, '\/');
      }
      let url = `${config.defaults.streamURL + dateString}/${fileName}`;
      if (config.defaults.streamURL === 'http://localhost:8080' || config.defaults.streamURL === 'http://api.szdev.cn') {
        url = '/static/video/test.mp4';
      }
      cb && cb(null, url, res);
    }
  }).catch((error) => {
    cb && cb(error);
  });
};

module.exports = utils;
