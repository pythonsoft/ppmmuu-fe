const config = require('./config');

const st = config.getConfig('STATUS');
const handle = {};

handle.isTaskCanStop = function (status) {
  let flag = false;

  if (['created', 'dealing'].indexOf(st[status].value) !== -1) {
    flag = true;
  }

  return flag;
};

handle.isTaskCanRestart = function (status) {
  let flag = false;

  if (['stopped', 'error'].indexOf(st[status].value) !== -1) {
    flag = true;
  }

  return flag;
};


module.exports = handle;
