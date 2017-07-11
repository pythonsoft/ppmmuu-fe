const utils = {};

utils.formatQuery = function formatQuery(obj) {
  const rs = Object.assign(obj);
  rs.timestamps = new Date().getTime();

  return rs;
};

module.exports = utils;
