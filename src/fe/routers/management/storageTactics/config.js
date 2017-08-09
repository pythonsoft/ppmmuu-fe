const utils = require('../../../common/utils');

const config = {};
const method = {};

config.STATUS = {
  All: { text: '全部', value: '-1', key: 'ALL' },
  NORMAL: { text: '正常', value: '0', key: 'NORMAL' },
  HAND_UP: { text: '挂起', value: '1', key: 'HAND_UP' }
};

config.PERMISSION = {
  PRIVATE: { text: '私有', value: '0', key: 'PRIVATE' },
  PUBLIC_READ_ONLY: { text: '公开只读', value: '1', key: 'PUBLIC_READ_ONLY' },
  PUBLIC_READ_WRITE: { text: '公开读写', value: '2', key: 'PUBLIC_READ_WRITE' }
};

config.TYPE = {
  ARCHIVE: { text: '归档', value: '0', key: 'ARCHIVE' },
  CLEAR_ONLINE: { text: '在线文档清除', value: '1', key: 'CLEAR_ONLINE' },
  DELETE_OBJECT: { text: '删除对象', value: '2', key: 'DELETE_OBJECT' },
  CLEAR_PART_OF_DOWNLOAD_FILE: { text: '分段下载文件清除', value: '3', key: 'CLEAR_PART_OF_DOWNLOAD_FILE' },
  DELETE_FILE: { text: '删除文件(按任务)', value: '4', key: 'DELETE_FILE' },
  CANCEL_PUBLISH: { text: '取消发布', value: '5', key: 'CANCEL_PUBLISH' },
  DELETE_MANUALLY: { text: '手动删除', value: '6', key: 'DELETE_MANUALLY' }
};

config.PRIORITY = {
  0: { text: '高', value: '0', key: 'HIGH' },
  1: { text: '普通', value: '1', key: 'NORMAL' },
  2: { text: '低', value: '2', key: 'LOW' }
};

config.TRIGGER_TYPE = {
  0: { text: '水位线', value: '0', key: 'LINE' },
  1: { text: '时间', value: '1', key: 'TIME' },
  2: { text: '水位线+时间', value: '2', key: 'LINE_TIME' }
};

config.SCHEDULE_TYPE = {
  0: { text: '现在', value: '0', key: 'NOW' },
  1: { text: '每天', value: '1', key: 'EVERY_DAY' },
  2: { text: '每周', value: '2', key: 'EVERY_WEEK' },
  3: { text: '每月', value: '2', key: 'EVERY_MONTH' },
  4: { text: '每年', value: '2', key: 'EVERY_YEAR' }
};

config.ORDER_BY = {
  0: { text: '创建时间', value: '0', key: 'CREATE_TIME' },
  1: { text: '最后访问时间', value: '1', key: 'LAST_VISIT_TIME' },
  2: { text: '访问次数', value: '2', key: 'VISIT_COUNT' },
};


config.LEVELS = [
  { text: '5%', value: 5},
  { text: '10%', value: 10},
  { text: '20%', value: 20},
  { text: '30%', value: 30},
  { text: '40%', value: 40},
  { text: '50%', value: 50},
  { text: '60%', value: 60},
  { text: '70%', value: 70},
  { text: '80%', value: 80},
  { text: '90%', value: 90}
];

module.exports = config;
