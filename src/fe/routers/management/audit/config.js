const utils = require('../../../common/utils');

const config = {};
const method = {};

config.AUDIT_STATUS = {
  ALL: { text: '全部', value: '', key: 'ALL' },
  WAITING: { text: '待审核', value: '1', key: 'WAITING' },
  PASS: { text: '通过', value: '2', key: 'PASS' },
  REJECT: { text: '拒绝', value: '3', key: 'REJECT' }
};

config.AUDIT_RULE_PERMISSTION_TYPE = {
  ALL: { text: '全部', value: '-1', key: 'ALL' },
  PUBLIC: { text: '公开', value: '1', key: 'PUBLIC' },
  AUDIT: { text: '审核', value: '2', key: 'AUDIT' }
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(config, v, st);
};

config.formatStatus = {
  1: '<span class="audit-download-status-span doing">待审核</span>',
  2: '<span class="audit-download-status-span submitted">已通过</span>',
  3: '<span class="audit-download-status-span deleted">已拒绝</span>'
};

config.STATUS = {
  DOING: '1', // 待审核
  SUBMITTED: '2', // 审核通过(待上架)
  DELETE: '3' // 拒绝
};

module.exports = { config, method };
