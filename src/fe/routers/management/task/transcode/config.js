const utils = require('../../../../common/utils');

const config = {};
const method = {};

config.STATUS = {
  All: { text: '全部', value: '-1', key: 'ALL' },
  NORMAL: { text: '正常', value: '0', key: 'NORMAL' },
  HAND_UP: { text: '挂起', value: '1', key: 'HAND_UP' },
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
  return utils.getTextByValue(status, v, st);
};

module.exports = { config, method };
