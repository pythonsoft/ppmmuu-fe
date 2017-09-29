export const TASK_STATUS = {
  PREPARE: { code: 0, text: '待认领', css: 'task-status-base prepare' },
  DOING: { code: 1, text: '编目中', css: 'task-status-base doing' },
  SUBMITTED: { code: 2, text: '已提交', css: 'task-status-base submitted' },
  DELETED: { code: 3, text: '已删除', css: 'task-status-base delete' },
  ALL: { code: 'all', text: '全部', css: '' }
};

export function getStatusByCode(code) {
  const keys = Object.keys(TASK_STATUS);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    if (TASK_STATUS[key].code == code) {
      return TASK_STATUS[key];
    }
  }
  return {};
}
