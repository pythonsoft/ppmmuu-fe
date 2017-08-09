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
  S3: { text: 'S3', value: '0', key: 'S3' },
  BAIDU_CLOUD: { text: '百度云', value: '1', key: 'BAIDU_CLOUD' },
  ALIYUN: { text: '阿里云', value: '2', key: 'ALIYUN' },
  LOCAL: { text: '本地', value: '3', key: 'LOCAL' },
  CIFS: { text: 'CIFS', value: '4', key: 'CIFS' },
  NETWORK: { text: '网络', value: '5', key: 'NETWORK' },
};

config.DELETE_DENY = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
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
