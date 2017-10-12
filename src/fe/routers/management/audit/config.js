const utils = require('../../../common/utils');

const config = {};
const method = {};

config.AUDIT_STATUS = {
  All: { text: '全部', value: '-1', key: 'ALL' },
  WAITING: { text: '审核中', value: '1', key: 'WAITING' },
  PASS: { text: '通过', value: '2', key: 'PASS' },
  REJECT: { text: '拒绝', value: '3', key: 'REJECT' },
};

config.AUDIT_RULE_PERMISSTION_TYPE = {
  All: { text: '全部', value: '-1', key: 'ALL' },
  PUBLIC: { text: '公开', value: '1', key: 'PUBLIC' },
  AUDIT: { text: '审核', value: '2', key: 'AUDIT' },
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(status, v, st);
};

module.exports = { config, method };
