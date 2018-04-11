const config = {};
config.formatStatus = {
  0: '<span class="permission-status-span prepare">待认领</span>',
  1: '<span class="permission-status-span doing">处理中</span>',
  2: '<span class="permission-status-span submitted">已提交</span>',
  3: '<span class="permission-status-span deleted">已删除</span>'
};

config.STATUS = {
  PREPARE: '0', // 待认领
  DOING: '1', // 处理中
  SUBMITTED: '2', // 已提交(待上架)
  DELETE: '3', // 已删除
  ONLINE: '4', // 已上架
  OFFLINE: '5' // 已下架
};

config.SUBSCRIBE_TYPE = {
  0: '政治',
  1: '体育',
  2: '娱乐'
};

config.PACKAGE_STATUS = {
  PREPARE: '0',   // 待处理
  DEALING: '1',   // 处理中
  COMPLETED: '2', // 已完成
  ERROR: '3',     // 出错
};

config.formatPacakgeStatus = {
  0: '<span class="process-status-span prepare">待处理</span>',
  1: '<span class="process-status-span doing">处理中</span>',
  2: '<span class="process-status-span submitted">已完成</span>',
  3: '<span class="process-status-span deleted">出错</span>',
  4: '<span class="process-status-span stopped">停止</span>'
};
module.exports = config;
