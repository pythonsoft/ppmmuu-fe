const config = {};

const MENU = [
  { title: '我的稿件',
    index: 'my',
    children: [
      { text: '草稿箱', status: '1', route: 'drafts', count: 0 },
      { text: '已提交', status: '2', route: 'sent', count: 0 },
      { text: '垃圾箱', status: '3', route: 'spam', count: 0 }
    ] },
];
config.MENU = MENU;

const STATUS_CONFIG = {
  drafts: { code: '1' },
  sent: { code: '2' },
  spam: { code: '3' },
  deleted: { code: '4' }
};
config.STATUS_CONFIG = STATUS_CONFIG;

const CREATETYPE_CONFIG = {
  1: { text: '创建者', icon: 'icon-creator' },
  2: { text: '协作者', icon: 'icon-collaborator' }
};
config.CREATETYPE_CONFIG = CREATETYPE_CONFIG;

const getSubmitStatus = function getSubmitStatus(status){
  status = `${status}`;
  const config = {
    0: {
      class: 'submit-dealing',
      text: '处理中'
    },
    1: {
      class: 'submit-dealing',
      text: '处理中'
    },
    2: {
      class: 'submit-dealed',
      text: '已提交'
    },
    3: {
      class: 'submit-error',
      text: '提交失败'
    },
  }
  return config[status];
}

config.getSubmitStatus = getSubmitStatus;

const SUBMIT_MENUS = [
  { key: 'all', label: '全部', active: true},
  { key: '3', label: '提交失败', active: false},
  { key: '0,1', label: '处理中', active: false},
  { key: '2', label: '已提交', active: false},
];

config.SUBMIT_MENUS = SUBMIT_MENUS;

module.exports = config;