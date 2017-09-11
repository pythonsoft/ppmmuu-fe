export const TYPE_CONFIG = {
  0: '公司',
  1: '部门',
  2: '小组'
};
export const APPENDCHILD_CONFIG = {
  0: '1',
  1: '2'
};
export const GROUP_CONFIG = {
  company: { type: '0', text: '公司' },
  department: { type: '1', text: '部门' },
  group: { type: '2', text: '小组' }
};
export const CHILD_NODE_CONFIG = {
  0: '1',
  1: '2'
};
export const MENU_CONFIG = {
  0: [
    { command: 'delete', name: '删除公司' },
    { command: 'new', name: '新建部门' },
    { command: 'permission', name: '权限信息' },
    { command: 'edit', name: '属性' }
  ],
  1: [
    { command: 'delete', name: '删除部门' },
    { command: 'new', name: '新建小组' },
    { command: 'permission', name: '权限信息' },
    { command: 'edit', name: '属性' }
  ],
  2: [
    { command: 'delete', name: '删除小组' },
    { command: 'permission', name: '权限信息' },
    { command: 'edit', name: '属性' }
  ]
};

export const STATUS_OPTIONS = [
  { value: 'all', label: '全部' },
  { value: '1', label: '启用' },
  { value: '0', label: '禁用' }
];
export const STATUS_CONFIG = {
  0: { class: 'status-danger', text: '禁用' },
  1: { class: 'status-success', text: '启用' }
};
export const VERIFY_TYPE_CONFIG = {
  0: '密码',
  1: '域',
  2: 'WebOS'
};

export const PERMISSION_TYPE_CONFIG = {
  company: { type: '0', text: '公司' },
  department: { type: '1', text: '部门' },
  group: { type: '2', text: '小组' },
  user: { type: '3', text: '账户' }
};

export const MEMBERCOUNT_LIST = [
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 500, label: '500' }
];
export const TYPE_TO_MENU_CONFIG = {
  0: [{ label: '公司', name: 'company' }],
  1: [
    { label: '部门', name: 'department' },
    { label: '公司', name: 'company' },
    { label: '最终权限', name: 'effective' }
  ],
  2: [
    { label: '小组', name: 'group' },
    { label: '部门', name: 'department' },
    { label: '公司', name: 'company' },
    { label: '最终权限', name: 'effective' }
  ],
  3: [
    { label: '账户', name: 'account' },
    { label: '小组', name: 'group' },
    { label: '部门', name: 'department' },
    { label: '公司', name: 'company' },
    { label: '最终权限', name: 'effective' }
  ]
};
