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

config.FILE_TYPE_ID = [
  { filetypeid: '575D9E77-91AF-4CBE-B2C6-AAF89B08380B', name: '字幕', fileclass: 11, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '997C86F2-0129-425D-A343-6109F843DB18', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: '040130E8-9C84-4D0B-B181-AC5B9D523EF0', name: '高清視頻', fileclass: 5, streamtype: 2, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6C5DC27E-BCCC-41A9-BB90-9CD068E91528', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: '75C908C1-2C45-4E3F-AFA0-11859C3FC174', name: '低碼流視音頻', fileclass: 2, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '04B18414-2477-41F9-B89A-96CDBE49D7E8', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'A2694839-8D87-42D8-87B5-419DFC0FDFCE', name: '視頻服務器', fileclass: 3, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6C5DC27E-BCCC-41A9-BB90-9CD068E91528', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'A8480910-490C-4CCF-B997-25D3FF9D1C9E', name: '立體聲音頻', fileclass: 6, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6C5DC27E-BCCC-41A9-BB90-9CD068E91528', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'B1ECE21B-3DAF-4B82-9874-C49600BE9837', name: '單聲道音頻', fileclass: 1, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6C5DC27E-BCCC-41A9-BB90-9CD068E91528', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'D51E2DDC-8742-4F9A-9CC8-84CC2255A689', name: '關鍵幀', fileclass: 4, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: 'C7D8D39C-F0B2-43D1-B320-D2BD89043A47', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'E2255D0F-2E98-4F93-B389-6542C8685B76', name: '標清視頻', fileclass: 0, streamtype: 16, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 15, said: '6C5DC27E-BCCC-41A9-BB90-9CD068E91528', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'EE92684D-42A9-449C-8B78-774BDE860AEC', name: '附件', fileclass: 100, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6767D518-4481-40C9-BDFF-F47FE19CE6D9', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: 'EE92684D-42A9-449C-8B78-774BDE860AFC', name: '圖文', fileclass: 7, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, said: '6767D518-4481-40C9-BDFF-F47FE19CE6D9', status: 0, filterclass: 0, standardrate: 0 },
  { filetypeid: '454E105B-F521-444a-A0E8-3763A6471DC2', name: '肖像', fileclass: 10, streamtype: 0, videotype: 0, audiotype: 0, minbitrate: 0, maxbitrate: 0, status: 0, filterclass: 0, standardrate: 0 }
];

config.IVIDEO_EDIT_FILE_TYPE_ID = [
  '040130E8-9C84-4D0B-B181-AC5B9D523EF0',
  'A2694839-8D87-42D8-87B5-419DFC0FDFCE',
  'E2255D0F-2E98-4F93-B389-6542C8685B76'
];

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

method.getTimeRange = function getTimeRange(datetimerange, key) {
  const result = { key: key, gte: '', lt: '' };
  if (datetimerange.length) {
    let startTime = datetimerange[0];
    let endTime = datetimerange[1];
    startTime = startTime ? new Date(startTime).toISOString() : '';
    endTime = endTime ? new Date(endTime).toISOString() : '';
    if (startTime && !endTime) {
      result.gte = startTime;
    } else if (!startTime && endTime) {
      result.lt = endTime;
    } else if (startTime && endTime) {
      result.gte = startTime;
      result.lt = endTime;
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

// 从哪个接口拿的数据
const FROM_WHERE = {
  program: 1,
  sequence: 2
};


const HHIGHLIGHT_FIELDS1 = 'name,program_name_cn,program_name_en,f_str_03,f_str_187,from_where,full_text';
const HHIGHLIGHT_FIELDS2 = 'program_type,name,program_name_cn,program_name_en,f_str_03,f_str_187,from_where';
const FILETR_FIELDS = 'id,duration,name,ccid,program_type,program_name_cn,hd_flag,program_name_en,last_modify,f_str_03,f_str_187,f_date_162,f_str_01,from_where,full_text,publish_time,rootid';

method.ORDER_OPTIONS = ORDER_OPTIONS;
method.HHIGHLIGHT_FIELDS1 = HHIGHLIGHT_FIELDS1;
method.HHIGHLIGHT_FIELDS2 = HHIGHLIGHT_FIELDS2;
method.FILETR_FIELDS = FILETR_FIELDS;
method.FROM_WHERE = FROM_WHERE;

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
