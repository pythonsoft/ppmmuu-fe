const utils = {};

utils.formatQuery = function formatQuery(obj, isGet = false) {
  const rs = Object.assign(obj);
  rs.timestamps = new Date().getTime();

  return isGet ? { params: rs } : rs;
};

utils.deepClone = function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

module.exports = utils;
