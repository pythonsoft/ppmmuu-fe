const utils = {};

utils.formatQuery = function formatQuery(obj, isGet = false) {
  const rs = Object.assign(obj);
  rs.timestamps = new Date().getTime();

  return isGet ? { params: rs} : rs;
};

module.exports = utils;
