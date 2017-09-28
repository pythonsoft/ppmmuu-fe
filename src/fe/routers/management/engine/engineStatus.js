const utils = require('../../../common/utils');

const method = {};
const status = {};

status.isVirtual = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
};

status.isTest = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
};

status.isInstallMonitor = {
  0: { text: '否', value: '0', key: 'NO' },
  1: { text: '是', value: '1', key: 'YES' }
};

status.command = {
  0: { text: '无', value: '0', key: 'NORMAL' },
  1: { text: '安装监控', value: '1', key: 'INSTALL_MONITOR' },
  2: { text: '停止', value: '2', key: 'STOP' },
  3: { text: '重启', value: '3', key: 'REBOOT' }
};

status.active = {
  NORMAL: { text: '正常', value: 30, key: 'NORMAL', css: 'engine-status-base engine-status-created' },
  WARNING: { text: '警告', value: 60, key: 'WARNING', css: 'engine-status-base engine-status-dealing' },
  CRASH: { text: '宕机', value: 90, key: 'CRASH', css: 'engine-status-base engine-status-error' }
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(status, v, st);
};
/**
 * 显示当前引擎状态
 * @param command
 * @param time UTC时间, 如："2017-07-26T09:23:20.216Z"
 * @returns {string}
 */
method.getRunStatus = function (command, time) {
  let rs = '';

  if (command === '0') {
    const now = new Date();
    const activeTime = new Date(time); // 转为当地时间
    const t = now - activeTime;

    if (t < 1000 * 60) {
      rs = status.active.NORMAL;
    } else if (t < 1000 * 60 * 5) {
      rs = status.active.WARNING;
    } else {
      rs = status.active.CRASH;
    }
  } else {
    rs = method.command[command];
  }

  return rs;
};

module.exports = method;
