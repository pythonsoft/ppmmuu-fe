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
  NORMAL: { text: '正常', value: 30, key: 'NORMAL' },
  WARNING: { text: '警告', value: 60, key: 'WARNING' },
  CRASH: { text: '宕机', value: 90, key: 'CRASH' }
};

method.getTextByValue = function (v, st) {
  let text = '';
  const target = status[st];
  const keys = Object.keys(target);

  for (let i = 0, len = keys.length; i < len; i++) {
    if (target[keys[i]].value === v) {
      text = target[keys[i]].text;
      break;
    }
  }

  return text;
};
/**
 * 显示当前引擎状态
 * @param command
 * @param time UTC时间, 如："2017-07-26T09:23:20.216Z"
 * @returns {string}
 */
method.getRunStatus = function (command, time) {
  let text = '';

  if (command === '0') {
    const now = new Date();
    const activeTime = new Date(time); // 转为当地时间
    const t = now - activeTime;

    if (t < 30000) {
      text = status.active.NORMAL.text;
    } else if (t < 90000) {
      text = status.active.WARNING.text;
    } else {
      text = status.active.CRASH.text;
    }
  } else {
    text = method.getTextByValue(command, 'command');
  }

  return text;
};

module.exports = method;
