const config = require('./config');

const st = config.getConfig('STATUS');
const downloadConfig = config.getConfig('DOWNLOAD_STATUS');
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

handle.isDownloadTaskCanStop = function (status) {
  let flag = false;

  if (['created', 'dealing'].indexOf(downloadConfig[status].value) !== -1) {
    flag = true;
  }

  return flag;
};

handle.isDownloadTaskCanRestart = function (status) {
  let flag = false;

  if (['stopped', 'error'].indexOf(downloadConfig[status].value) !== -1) {
    flag = true;
  }

  return flag;
};


module.exports = handle;
