/**
 * Created by steven on 2017/10/11.
 */
const config = {};
import { valueLengthLimit } from '../../../../common/utils';

const STATUS = {
  UNUSED: '0',
  USING: '1',
  EXPIRED: '2'
};

const STATUS_OPTIONS = [
  { value: '', label: '全部' },
  { value: '0', label: '未使用' },
  { value: '1', label: '使用中' },
  { value: '2', label: '过期' }
];

config.formatStatus = {
  0: '<span class="permission-status-span not-use">未使用</span>',
  1: '<span class="permission-status-span using">使用中</span>',
  2: '<span class="permission-status-span expired">过期</span>'
};

const SUBSCRIBE_TYPE = [
  { value: '0', label: '政治' },
  { value: '1', label: '体育' },
  { value: '2', label: '娱乐' }
];

const PERIOD_OF_USE = [
  { value: 1, label: '1个月' },
  { value: 3, label: '3个月' },
  { value: 6, label: '6个月' },
  { value: 12, label: '1年' },
  { value: 24, label: '2年' },
  { value: 36, label: '3年' },
  { value: 60, label: '5年' },
  { value: 120, label: '10年' }
];

config.getLabelByValue = function getLabelByValue(val, options) {
  for (let i = 0, len = options.length; i < len; i++) {
    if (val === options[i].value) {
      return options[i].label;
    }
  }
  return '';
};

config.formatRows = function formatRows(rows) {
  for (let i = 0, len = rows.length; i < len; i++) {
    const row = rows[i];
    const t = new Date();
    if (new Date(row.startTime) > t) {
      row.status = '0';
    } else if (new Date(row.expiredTime) <= t) {
      row.status = '2';
    } else {
      row.status = '1';
    }
  }
};

config.getSubScribeTypeOptions = function getSubScribeTypeOptions(rows) {
  const options = [];
  rows.forEach((item) => {
    const option = { value: item._id, label: valueLengthLimit(`${item.name}(${item._id})`, 30), key: item._id };
    options.push(option);
  });
  return options;
};

config.STATUS = STATUS;
config.STATUS_OPTIONS = STATUS_OPTIONS;
config.SUBSCRIBE_TYPE = SUBSCRIBE_TYPE;
config.PERIOD_OF_USE = PERIOD_OF_USE;

module.exports = config;
