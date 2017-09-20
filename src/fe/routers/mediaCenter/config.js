const utils = require('../../common/utils');

const config = {};
const method = {};

config.FIELD_NAME = {
  ACCESSCOUNT: { cn: '' },
  ARCHIVETYPE: { cn: '' },
  CAPCHANNEL: { cn: '' },
  CHANNEL: { cn: '' },
  CHECKFILE: { cn: '' },
  CREATETIME: { cn: '' },
  DELAFTERARCHIVE: { cn: '' },
  DESCRIPTION: { cn: '' },
  EXPIRETIME: { cn: '' },
  FILECLASS: { cn: '' },
  FILENAME: { cn: '文件名' },
  FILESIZE: { cn: '文件大小' },
  FILETYPE: { cn: '文件类型' },
  FILETYPEID: { cn: '文件类型ID' },
  FILETYPENAME: { cn: '文件类型名称' },
  INPOINT: { cn: '入点' },
  ISOK: { cn: '' },
  LANGUAGEID: { cn: '' },
  LASTACCESS: { cn: '' },
  MD5CODE: { cn: '' },
  MEDIAINFOFLAG: { cn: '' },
  NAME: { cn: '名称' },
  OBJECTID: { cn: '' },
  OUTPOINT: { cn: '出点' },
  PATHID: { cn: '' },
  PROCESSSTATUS: { cn: '' },
  PURGETIME: { cn: '' },
  RESERVED1: { cn: '' },
  RESERVED2: { cn: '' },
  SAID: { cn: '' },
  SANAME: { cn: '' },
  SASTATUS: { cn: '' },
  SATYPE: { cn: '' },
  SOURCE: { cn: '' },
  SPSTATUS: { cn: '' },
  STATUS: { cn: '' },
  STREAMMEDIAID: { cn: '' },
  STREAMMEDIAINFO: { cn: '' },
  STREAMMEDIAINFOID: { cn: '' },
  STREAMTYPE: { cn: '' },
  TAPECODE: { cn: '' },
  UNCPATH: { cn: '' },
  VIDEOSTANDARD: { cn: '' }
};

method.getTextByValue = function (v, st) {
  return utils.getTextByValue(config, v, st) || {};
};

method.getConfig = function (configName, key) {
  const cfg = config[configName];

  if (cfg && key) {
    return cfg[key] || {};
  }

  return cfg || {};
};

method.getTimeRange = function getTimeRange(datetimerange) {
  let result = '';
  if (datetimerange.length) {
    let startTime = datetimerange[0];
    let endTime = datetimerange[1];
    startTime = startTime ? new Date(startTime).toISOString() : '';
    endTime = endTime ? new Date(endTime).toISOString() : '';
    if (startTime && !endTime) {
      result = `[${startTime} TO *]`;
    } else if (!startTime && endTime) {
      result = `[0 TO ${endTime}]`;
    } else if (startTime && endTime) {
      result = `[${startTime} TO ${endTime}]`;
    }
  }
  return result;
};

method.getQuery = function getQuery(must, configs) {
  for (let i = 0, len = configs.length; i < len; i++) {
    const temp = configs[i];
    const key = temp.key;
    if (temp.selected !== undefined && temp.selected !== '' && temp.selected !== 'all') {
      const item = {
        key: temp.key,
        value: temp.selected
      };
      must.push(item);
    }
  }
};

method.formatMust = function (must, obj) {
  for (const key in obj) {
    if (obj[key]) {
      const item = {
        key: key,
        value: obj[key]
      };
      must.push(item);
    }
  }
};

method.getSearchNotice = function getSearchNotice(configs) {
  const q = [];
  for (let i = 0, len = configs.length; i < len; i++) {
    const temp = configs[i];
    const key = temp.key;
    if (temp.selected !== undefined && temp.selected !== 'all' && temp.selected !== '') {
      const items = temp.items;
      for (let j = 0, len1 = items.length; j < len1; j++) {
        if (items[j].value === temp.selected) {
          q.push(items[j].label);
          break;
        }
      }
    }
  }

  return q;
};

const ORDER_OPTIONS = [
  { value: 'order1', label: '关联度排序', sort: '' },
  { value: 'order2', label: '新闻时间由远到近', sort: 'asc', key: 'f_date_162' },
  { value: 'order3', label: '新闻时间由近到远', sort: 'desc', key: 'f_date_162' },
  { value: 'order4', label: '首播时间由近到远', sort: 'desc', key: 'f_date_36' },
  { value: 'order5', label: '首播时间由远到近', sort: 'asc', key: 'f_date_36' }
];

const HHIGHLIGHT_FIELDS1 = 'name,program_name_cn,program_name_en,f_str_03,f_str_187';
const HHIGHLIGHT_FIELDS2 = 'program_type,name,program_name_cn,program_name_en,f_str_03,f_str_187';
const FILETR_FIELDS = 'id,duration,name,ccid,program_type,program_name_cn,hd_flag,program_name_en,last_modify,f_str_03,f_str_187';

method.ORDER_OPTIONS = ORDER_OPTIONS;
method.HHIGHLIGHT_FIELDS1 = HHIGHLIGHT_FIELDS1;
method.HHIGHLIGHT_FIELDS2 = HHIGHLIGHT_FIELDS2;
method.FILETR_FIELDS = FILETR_FIELDS;

method.getOrder = function getOrder(selectedValue) {
  const sort = [];
  if (selectedValue) {
    for (let i = 0, len = ORDER_OPTIONS.length; i < len; i++) {
      if (selectedValue === ORDER_OPTIONS[i].value && ORDER_OPTIONS[i].sort) {
        const item = {
          key: ORDER_OPTIONS[i].key,
          value: ORDER_OPTIONS[i].sort
        };
        sort.push(item);
      }
    }
  }
  return sort;
};

method.getHighLightFields = function getHighLightFields(fields) {
  const obj = {};
  fields = fields.split(',');
  for (let i = 0, len = fields.length; i < len; i++) {
    obj[fields[i]] = {};
  }
  return obj;
};

module.exports = method;
