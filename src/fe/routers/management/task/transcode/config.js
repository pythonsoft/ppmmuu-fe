const utils = require('../../../../common/utils');

const config = {};
const method = {};

config.CURRENT_STEP = {
  all: { text: '全部', value: '', key: 'all' },
  generateIndex: { text: '帧索引创建', value: 'generateIndex', key: 'generateIndex' },
  divideFile: { text: '文件分割', value: 'divideFile', key: 'divideFile' },
  transcoding: { text: '转码', value: 'transcoding', key: 'transcoding' },
  mergeFile: { text: '文件合并', value: 'mergeFile', key: 'mergeFile' },
};

//created, //创建 dealing, //处理中 error,//错误 complete //完成
config.STATUS = {
  all: { text: '全部', value: '', key: 'all' },
  created: { text: '已创建', value: 'created', key: 'created', css: 'task-status-base task-status-created' },
  dealing: { text: '处理中', value: 'dealing', key: 'dealing', css: 'task-status-base task-status-dealing' },
  error: { text: '错误', value: 'error', key: 'error', css: 'task-status-base task-status-error' },
  complete: { text: '已完成', value: 'complete', key: 'complete', css: 'task-status-base task-status-complete' },
};

config.PERMISSION = {
  PRIVATE: { text: '私有', value: '0', key: 'PRIVATE' },
  PUBLIC_READ_ONLY: { text: '公开只读', value: '1', key: 'PUBLIC_READ_ONLY' },
  PUBLIC_READ_WRITE: { text: '公开读写', value: '2', key: 'PUBLIC_READ_WRITE' }
};

config.TYPE = {
  STANDARD: { text: '标准存储', value: '0', key: 'STANDARD' },
  IA: { text: '低频存储', value: '1', key: 'IA' },
  ARCHIVE: { text: '归档存储', value: '2', key: 'ARCHIVE' },
};

config.DELETE_DENY = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(config, v, st) || {};
};

method.getConfig = function (configName, key) {
  const cfg = config[configName];
  if(cfg && key) {
    return cfg[key];
  }
  return cfg;
};

module.exports = method;
