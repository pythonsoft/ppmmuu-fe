const utils = require('../../../../common/utils');

const config = {};
const method = {};

//generateIndex //帧索引创建  divideFile, //文件分割 transcoding, //转码 mergeFile //文件合并

config.STATUS = {
  All: { text: '全部', value: '', key: 'ALL' },
  generateIndex: { text: '帧索引创建', value: 'generateIndex', key: 'generateIndex' },
  divideFile: { text: '文件分割', value: 'divideFile', key: 'divideFile' },
  transcoding: { text: '转码', value: 'transcoding', key: 'transcoding' },
  mergeFile: { text: '文件合并', value: 'mergeFile', key: 'mergeFile' },
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
