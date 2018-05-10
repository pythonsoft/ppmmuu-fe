const FORM_ITEM_MORE = [
  { label: '名称', propName: 'name', valueName: 'name', type: 'text' },
  { label: '编目类', propName: 'ccid', valueName: 'ccid', type: 'select', options: [] },
  { label: '編目人', propName: 'owner', valueName: 'owner', type: 'text', disabled: true },
  { label: '资源所属部门', propName: 'resourceDepartment', valueName: 'resourceDepartment', type: 'select', options: [] },
  { label: '新闻类型', propName: 'newsType', valueName: 'newsType', type:  'select', options: [], show: (type)=>{ if(['素材'].indexOf(type) !== -1) { return true } return false } },
  { label: '人物', propName: 'keyman', valueName: 'keyman', type: 'text' },
  { label: '事发地区', propName: 'occurCountry', valueName: 'occurCountry', type: 'select', options: [], show: (type)=>{ if(['素材','包裝','自製','墊播'].indexOf(type) !== -1) { return true } return false } },
  { label: '净长', propName: 'duration', valueName: 'duration', type: 'text', disabled: true },
  { label: '版本', propName: 'version', valueName: 'version', type: 'select', options: [], show: (type)=>{ if(['包裝','自製','墊播', '採購', '宣傳'].indexOf(type) !== -1) { return true } return false } },
  { label: '语言', propName: 'language', valueName: 'language', type: 'select', options: [] },
  { label: '制作地点', propName: 'madeLocation', valueName: 'madeLocation', type: 'select', options: [], show: (type)=>{ if(['包裝','自製','墊播', '採購'].indexOf(type) !== -1) { return true } return false } },
  { label: '新闻日期', propName: 'newsTime', valueName: 'newsTime', type: 'date', show: (type)=>{ if(['素材'].indexOf(type) !== -1) { return true } return false } },
  { label: '高标清', propName: 'hdFlag', valueName: 'hdFlag', type: 'radio', options: [
    { label: '高清', value: '1' },
    { label: '标清', value: '0' }
  ] },
  { label: '首播日期', propName: 'airTime', valueName: 'airTime', type: 'date', show: (type)=>{ if(['包裝','自製','墊播', '採購', '宣傳'].indexOf(type) !== -1) { return true } return false } }
];

module.exports = FORM_ITEM_MORE;