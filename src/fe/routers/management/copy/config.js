/**
 * Created by steven on 2017/10/11.
 */
const config = {};

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
  { value: 'all', label: '全部', active: true},
  { value: '3', label: '提交失败', active: false},
  { value: '0,1', label: '处理中', active: false},
  { value: '2', label: '已提交', active: false},
];

config.SUBMIT_MENUS = SUBMIT_MENUS;

module.exports = config;