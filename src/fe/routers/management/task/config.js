const utils = require('../../../common/utils');

const config = {};
const method = {};

// 转码
config.CURRENT_STEP = {
  all: { text: '全部', value: '', key: 'all' },
  generateIndex: { text: '帧索引创建', value: 'generateIndex', key: 'generateIndex' },
  divideFile: { text: '文件分割', value: 'divideFile', key: 'divideFile' },
  transcoding: { text: '转码', value: 'transcoding', key: 'transcoding' },
  mergeFile: { text: '文件合并', value: 'mergeFile', key: 'mergeFile' }
};

// created, //创建 dealing, //处理中 error,//错误 complete //完成

// 转码任务状态
config.STATUS = {
  all: { text: '全部', value: '', key: 'all' },
  created: { text: '已创建', value: 'created', key: 'created', css: 'task-status-base task-status-created' },
  dealing: { text: '处理中', value: 'dealing', key: 'dealing', css: 'task-status-base task-status-dealing' },
  stopping: { text: '停止中', value: 'stopping', key: 'stopping', css: 'task-status-base task-status-dealing' },
  stopped: { text: '已停止', value: 'stopped', key: 'stopped', css: 'task-status-base task-status-dealing' },
  restarting: { text: '重启中', value: 'restarting', key: 'restarting', css: 'task-status-base task-status-created' },
  error: { text: '错误', value: 'error', key: 'error', css: 'task-status-base task-status-error' },
  complete: { text: '已完成', value: 'complete', key: 'complete', css: 'task-status-base task-status-complete' }
};

// 下载任务状态
config.DOWNLOAD_STATUS = {
  all: { text: '全部', value: '', key: 'all' },
  created: { text: '已创建', value: 'created', key: 'created', css: 'task-status-base task-status-created' },
  dealing: { text: '处理中', value: 'dealing', key: 'dealing', css: 'task-status-base task-status-dealing' },
  stopping: { text: '停止中', value: 'stopping', key: 'stopping', css: 'task-status-base task-status-dealing' },
  stopped: { text: '已停止', value: 'stopped', key: 'stopped', css: 'task-status-base task-status-dealing' },
  restart: { text: '重启中', value: 'restart', key: 'restart', css: 'task-status-base task-status-created' },
  error: { text: '错误', value: 'error', key: 'error', css: 'task-status-base task-status-error' },
  complete: { text: '已完成', value: 'complete', key: 'complete', css: 'task-status-base task-status-complete' },
  delete: { text: '已删除', value: 'delete', key: 'delete', css: 'task-status-base task-status-dealing' }
};

config.PERMISSION = {
  PRIVATE: { text: '私有', value: '0', key: 'PRIVATE' },
  PUBLIC_READ_ONLY: { text: '公开只读', value: '1', key: 'PUBLIC_READ_ONLY' },
  PUBLIC_READ_WRITE: { text: '公开读写', value: '2', key: 'PUBLIC_READ_WRITE' }
};

config.TYPE = {
  STANDARD: { text: '标准存储', value: '0', key: 'STANDARD' },
  IA: { text: '低频存储', value: '1', key: 'IA' },
  ARCHIVE: { text: '归档存储', value: '2', key: 'ARCHIVE' }
};

config.DELETE_DENY = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
};

config.TASK_TYPE = {
  media_download: { text: '下载', value: '0', key: 'media_download' },
  transcoding: { text: '转码', value: '1', key: 'transcoding' },
  fmft_transfer: { text: '传输', value: '2', key: 'fmft_transfer' }
};

config.FIELD_NAME = {
  id: { cn: '标识' },
  workServerId: { cn: '服务器ID' },
  filePath: { cn: '文件路径' },
  taskInfoId: { cn: '任务ID' },
  totalTime: { cn: '时长' },
  status: { cn: '状态' },
  lastModify: { cn: '修改时间' },
  createTime: { cn: '创建时间' },
  processRate: { cn: '进度(%)' },
  presentInfoId: { cn: '主任务ID' },
  serialNO: { cn: 'serialNO' }
};

config.NODE_TEMPLATE = {
  DOWNLOAD: { text: '下载模板', value: '1', key: 'DOWNLOAD' }
};

config.TEMPLATE_TYPE = Object.assign({
  ALL: { text: '全部', value: '', key: 'ALL' },
  TRANSCODE: { text: '转码模板', value: '0', key: 'TRANSCODE' }
}, config.NODE_TEMPLATE);

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(config, v, st) || {};
};

method.getConfig = function (configName, key) {
  const cfg = config[configName];

  if (cfg && key) {
    return cfg[key] || {};
  }

  return cfg || {};
};

module.exports = method;
