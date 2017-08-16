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

module.exports = method;
