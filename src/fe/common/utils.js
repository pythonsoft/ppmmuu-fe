const utils = {};

utils.formatQuery = function formatQuery(obj, isGet = false) {
  const rs = Object.assign(obj);
  rs.timestamps = new Date().getTime();

  return isGet ? { params: rs } : rs;
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

module.exports = utils;
